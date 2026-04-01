/* demo_queue.c — Lock-free-looking producer-consumer queue with a
 *                subtle TOCTOU race condition.
 *
 * PURPOSE: PromptKit demo. Give this code to an LLM with the symptom
 * "intermittent crashes under load" and compare how a vibe prompt
 * vs. a PromptKit-assembled prompt investigates the root cause.
 *
 * PLANTED ISSUE (do NOT reveal during the demo):
 *
 *   Root Cause — TOCTOU race in dequeue() (lines 55-60):
 *       `count` is checked OUTSIDE the lock, then the lock is acquired
 *       and the item is dequeued. Between the check and the lock
 *       acquisition, another thread can dequeue the last item, causing
 *       a read from an empty queue (head == tail, stale data or
 *       segfault if items[head] was already consumed/freed).
 *
 *   Red Herring — malloc in enqueue() (line 42):
 *       `strdup(item)` allocates memory. It is correctly freed in the
 *       consumer (line 81). A shallow review may flag this as a leak.
 *
 * SYMPTOM DESCRIPTION (give this to the LLM):
 *
 *   "This producer-consumer queue works fine in our single-threaded
 *   tests but crashes intermittently under load when we run 4 producer
 *   threads and 2 consumer threads. The crash is a segfault inside
 *   process_item(), but that function looks correct. We've checked for
 *   memory corruption with AddressSanitizer — no heap issues reported."
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>

#define QUEUE_CAP 64

typedef struct {
    char *items[QUEUE_CAP];
    int   head;
    int   tail;
    int   count;
    pthread_mutex_t lock;
} queue_t;

void queue_init(queue_t *q)
{
    memset(q, 0, sizeof(*q));
    pthread_mutex_init(&q->lock, NULL);
}

/* Red herring: strdup allocates, but consumer frees — this is correct */
int enqueue(queue_t *q, const char *item)
{
    pthread_mutex_lock(&q->lock);
    if (q->count >= QUEUE_CAP) {
        pthread_mutex_unlock(&q->lock);
        return -1;  /* full */
    }
    q->items[q->tail] = strdup(item);
    q->tail = (q->tail + 1) % QUEUE_CAP;
    q->count++;
    pthread_mutex_unlock(&q->lock);
    return 0;
}

/* BUG: TOCTOU race — count checked OUTSIDE lock, then lock acquired.
 * Between the check and the lock, another consumer can drain the queue. */
char *dequeue(queue_t *q)
{
    if (q->count == 0)       /* <-- CHECK outside lock */
        return NULL;

    pthread_mutex_lock(&q->lock);   /* <-- another thread may dequeue here */
    char *item = q->items[q->head]; /* stale: head may now be invalid */
    q->items[q->head] = NULL;
    q->head = (q->head + 1) % QUEUE_CAP;
    q->count--;                     /* count can go negative! */
    pthread_mutex_unlock(&q->lock);
    return item;
}

/* This function is correct — the crash is NOT here */
void process_item(const char *item)
{
    printf("Processing: %s\n", item);
}

/* Consumer thread */
void *consumer(void *arg)
{
    queue_t *q = (queue_t *)arg;
    while (1) {
        char *item = dequeue(q);
        if (item) {
            process_item(item);
            free(item);   /* correctly frees the strdup from enqueue */
        }
    }
    return NULL;
}

/* Producer thread */
void *producer(void *arg)
{
    queue_t *q = (queue_t *)arg;
    for (int i = 0; i < 10000; i++) {
        char msg[32];
        snprintf(msg, sizeof(msg), "msg-%d", i);
        while (enqueue(q, msg) < 0)
            ;  /* spin until space available */
    }
    return NULL;
}

int main(void)
{
    queue_t q;
    queue_init(&q);

    pthread_t producers[4], consumers[2];

    for (int i = 0; i < 4; i++)
        pthread_create(&producers[i], NULL, producer, &q);
    for (int i = 0; i < 2; i++)
        pthread_create(&consumers[i], NULL, consumer, &q);

    for (int i = 0; i < 4; i++)
        pthread_join(producers[i], NULL);

    /* Note: consumers run forever — in production we'd signal them to stop */
    printf("All producers finished.\n");
    return 0;
}
