/* demo_server.c — Minimal TCP echo server with 5 planted bugs.
 *
 * PURPOSE: PromptKit demo. Ask an LLM to review this file for bugs,
 * first with a plain "vibe" prompt, then with a PromptKit-assembled
 * prompt, and compare the findings.
 *
 * PLANTED ISSUES (do NOT reveal these to the LLM during the demo):
 *
 *   Bug 1 (Critical) — Use-after-free on line 65/73:
 *       `client->buf` is freed, then read on the next iteration.
 *
 *   Bug 2 (Critical) — Buffer overflow on line 52:
 *       `strcpy` into a fixed-size buffer with no bounds check.
 *
 *   Bug 3 (High) — Unchecked return value on line 61:
 *       `recv()` can return -1 on error; code treats it as a valid length.
 *
 *   Bug 4 (Medium) — Off-by-one on line 46:
 *       `<=` should be `<`; writes one byte past `msg` buffer.
 *
 *   Bug 5 (Medium) — Resource leak on line 83:
 *       Early return on `send()` failure does not close `client_fd`.
 *
 * There is also a RED HERRING: `create_client` allocates memory that
 * is freed in `destroy_client` (correct). A shallow review might flag
 * this as a leak because the free is in a different function.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

#define MAX_MSG    256
#define BACKLOG    10

typedef struct {
    int   fd;
    char *buf;
    int   buf_size;
} client_t;

/* Bug 4 (Off-by-one): loop condition uses <= instead of < */
static void sanitize(char *msg, int len)
{
    for (int i = 0; i <= len; i++) {   /* BUG: should be i < len */
        if (msg[i] == '\n' || msg[i] == '\r')
            msg[i] = ' ';
    }
}

/* Bug 2 (Buffer overflow): no bounds check on incoming name */
static void log_connection(const char *client_name)
{
    char log_entry[64];
    strcpy(log_entry, "CONNECT: ");
    strcat(log_entry, client_name);          /* BUG: unbounded copy */
    printf("%s\n", log_entry);
}

/* Red herring: allocation here is correctly freed in destroy_client */
static client_t *create_client(int fd, int buf_size)
{
    client_t *c = malloc(sizeof(client_t));
    if (!c) return NULL;
    c->fd       = fd;
    c->buf      = malloc(buf_size);
    c->buf_size = buf_size;
    return c;
}

/* Bug 3 (Unchecked return): recv() error not handled */
/* Bug 1 (Use-after-free): buf freed then used in next call */
static int handle_echo(client_t *client)
{
    int n = recv(client->fd, client->buf, client->buf_size, 0);
    /* BUG 3: n could be -1 (error); code falls through */

    if (n == 0) {
        free(client->buf);             /* BUG 1: frees buf ... */
        return 0;  /* client disconnected */
    }

    sanitize(client->buf, n);

    /* ... but if the caller loops and calls handle_echo again
     * after a partial read/reconnect, client->buf is dangling. */

    return n;
}

/* Bug 5 (Resource leak): client_fd not closed on send failure */
static void serve_client(int client_fd, const char *client_name)
{
    log_connection(client_name);

    client_t *client = create_client(client_fd, MAX_MSG);
    if (!client) {
        close(client_fd);
        return;
    }

    int n;
    while ((n = handle_echo(client)) > 0) {
        if (send(client_fd, client->buf, n, 0) < 0) {
            perror("send");
            free(client->buf);
            free(client);
            return;  /* BUG 5: client_fd never closed */
        }
    }

    close(client_fd);
    /* destroy_client not called — but buf was freed in handle_echo
     * on the n==0 path, so only the client_t struct leaks here.
     * (This is a secondary consequence of Bug 1's design.) */
    free(client);
}

static void destroy_client(client_t *c)
{
    if (!c) return;
    close(c->fd);
    free(c->buf);
    free(c);
}

int main(void)
{
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    struct sockaddr_in addr = {
        .sin_family = AF_INET,
        .sin_addr.s_addr = INADDR_ANY,
        .sin_port = htons(8080),
    };

    bind(server_fd, (struct sockaddr *)&addr, sizeof(addr));
    listen(server_fd, BACKLOG);

    printf("Listening on :8080\n");

    for (;;) {
        struct sockaddr_in client_addr;
        socklen_t addr_len = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr *)&client_addr,
                               &addr_len);
        /* For demo simplicity, handle one client at a time */
        serve_client(client_fd, "unknown");
    }

    return 0;
}
