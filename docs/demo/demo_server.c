/* demo_server.c — Minimal TCP echo server.
 * Accepts connections, reads data, sanitizes it, and echoes it back.
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

static void sanitize(char *msg, int len)
{
    for (int i = 0; i <= len; i++) {
        if (msg[i] == '\n' || msg[i] == '\r')
            msg[i] = ' ';
    }
}

static void log_connection(const char *client_name)
{
    char log_entry[64];
    strcpy(log_entry, "CONNECT: ");
    strcat(log_entry, client_name);
    printf("%s\n", log_entry);
}

static client_t *create_client(int fd, int buf_size)
{
    client_t *c = malloc(sizeof(client_t));
    if (!c) return NULL;
    c->fd       = fd;
    c->buf      = malloc(buf_size);
    c->buf_size = buf_size;
    return c;
}

static int handle_echo(client_t *client)
{
    int n = recv(client->fd, client->buf, client->buf_size, 0);

    if (n == 0) {
        free(client->buf);
        return 0;  /* client disconnected */
    }

    sanitize(client->buf, n);

    return n;
}

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
            return;
        }
    }

    close(client_fd);
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
