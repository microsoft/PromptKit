# Demo Answer Key

> **⚠️ PRESENTER ONLY — do not share this file or include it in LLM context.**
>
> This file documents the planted issues in the demo code samples.
> Use it to score LLM outputs after each run.

---

## demo_server.c — Code Review (5 bugs + 1 red herring)

| # | Severity | Category | Location | Description |
|---|----------|----------|----------|-------------|
| 1 | Critical | Use-after-free | `handle_echo()` | `client->buf` is freed when `n == 0` (client disconnects), but `serve_client()` loops and calls `handle_echo()` again — `client->buf` is now a dangling pointer. |
| 2 | Critical | Buffer overflow | `log_connection()` | `strcpy`/`strcat` copies `client_name` into a 64-byte `log_entry` with no bounds check. If `client_name` exceeds ~54 characters, this overflows the stack buffer. |
| 3 | High | Unchecked return | `handle_echo()` | `recv()` can return -1 on error. The code only checks for `n == 0` (disconnect) and falls through to `sanitize()` with `n == -1`, passing a negative length. |
| 4 | Medium | Off-by-one | `sanitize()` | Loop condition `i <= len` iterates one past the valid data. Should be `i < len`. Reads (and potentially writes) one byte beyond the received data. |
| 5 | Medium | Resource leak | `serve_client()` | When `send()` fails, the function frees `client->buf` and `client` but returns without closing `client_fd`, leaking the file descriptor. |

### Red Herring

`create_client()` calls `malloc()` for both the `client_t` struct and
`client->buf`. A shallow review might flag this as a memory leak because
`destroy_client()` (which properly frees both) is defined but never called
in the normal code path. However, the code does free `client->buf` and
the `client_t` struct through other paths — the design is just unusual,
not leaking (aside from the bugs above that create leak-like consequences).

---

## demo_queue.c — Bug Investigation (1 root cause + 1 red herring)

### Root Cause: TOCTOU Race in `dequeue()`

```c
char *dequeue(queue_t *q)
{
    if (q->count == 0)          // CHECK — outside the lock
        return NULL;

    pthread_mutex_lock(&q->lock);   // ACQUIRE — another thread may act here
    char *item = q->items[q->head]; // USE — head/count may now be stale
```

**The interleaving:**

1. Thread A calls `dequeue()`, reads `q->count == 1`, passes the check.
2. Thread A is preempted before acquiring the lock.
3. Thread B calls `dequeue()`, also reads `q->count == 1`, passes the check.
4. Thread B acquires the lock, dequeues the last item, decrements count to 0.
5. Thread A resumes, acquires the lock, reads `q->items[q->head]` — but
   the item was already consumed by Thread B. The pointer is either NULL
   (if B set it to NULL) or stale/freed memory.
6. Thread A passes this to `process_item()` → segfault on NULL dereference
   or use-after-free.

**Why ASan doesn't catch it:** The segfault is a NULL dereference (reading
`items[head]` which was set to NULL by Thread B), not a heap corruption.
ASan's heap checks don't flag NULL pointer reads.

**Correct fix:** Move the count check inside the lock:

```c
char *dequeue(queue_t *q)
{
    pthread_mutex_lock(&q->lock);
    if (q->count == 0) {
        pthread_mutex_unlock(&q->lock);
        return NULL;
    }
    char *item = q->items[q->head];
    // ... rest unchanged
```

### Red Herring: strdup/free Pattern

`enqueue()` calls `strdup(item)` to allocate a copy of each string.
`consumer()` calls `free(item)` after `process_item()`. This is a
correct allocate-in-producer / free-in-consumer pattern. It is NOT a
memory leak.

---

## rate_limiter_description.md — Requirements Authoring

There are no planted bugs — this scenario measures **completeness and
structure**. Score by counting how many of these the LLM surfaces:

### Implicit Requirements Most Developers Miss

| Category | Requirement | Why It Matters |
|----------|-------------|----------------|
| HTTP semantics | Include `Retry-After` header in 429 response | RFC 6585 recommends it; clients need it for backoff |
| Distributed | Behavior with multiple API server instances | Single-node counters don't work behind a load balancer |
| Clock skew | Window boundary behavior | What happens to a request that arrives at the exact window boundary? |
| Persistence | Rate limit state durability | What happens to counts when the service restarts? |
| Observability | Metrics / logging for rate limit events | Ops team needs visibility into throttling patterns |
| Graceful degradation | Behavior when rate limit store is unavailable | Fail-open (allow all) or fail-closed (deny all)? |
| Burst handling | Sliding window vs. fixed window vs. token bucket | Fixed windows allow 2x burst at boundaries |
| Identity | What counts as "a user"? | API key? OAuth token? IP fallback for unauthenticated? |
| Configurability | Per-endpoint or global limits? | Different endpoints may need different thresholds |
| Response body | What information to include in the 429 body | Current usage, limit, reset time |
