/* demo_queue.c — Producer-consumer queue using a mutex.
 * Producers enqueue strings, consumers dequeue and process them.
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

char *dequeue(queue_t *q)
{
    if (q->count == 0)
        return NULL;

    pthread_mutex_lock(&q->lock);
    char *item = q->items[q->head];
    q->items[q->head] = NULL;
    q->head = (q->head + 1) % QUEUE_CAP;
    q->count--;
    pthread_mutex_unlock(&q->lock);
    return item;
}

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
            free(item);
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
