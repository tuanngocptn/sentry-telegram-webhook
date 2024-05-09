# Sentry Telegram Webhook

**Description:** Webhook for Sentry which allows sending notification via Telegram messenger.

- Github Repository: [HERE](https://github.com/tuanngocptn/sentry-telegram-webhook).

- Docker Hub: [HERE](https://hub.docker.com/repository/docker/tuanngocptn/sentry-telegram-webhook).

- The result will look like this:

![Sentry Telegram Webhook Result](https://github.com/tuanngocptn/sentry-telegram-webhook/blob/main/.github/assets/imgs/telegram_send_result.png?raw=true 'Sentry Telegram Webhook Result')

## Requirements

- Nodejs 18+ (recommend: 20+)

## Installation

```bash
$ npm install
```

## Environment variables

| Name                     | Is Require | Type   | Note                                                                                                                                                                                                                                          | Value |
| ------------------------ | ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| LANGUAGE                 | Yes        | string | The language of message when send                                                                                                                                                                                                             | vi,en |
| TELEGRAM_BOT_TOKEN       | Yes        | string | The token from @BotFather telegram check [HERE](https://core.telegram.org/bots/tutorial#obtain-your-bot-token) for see how to get this.                                                                                                       |       |
| TELEGRAM_GROUP_ID        | Yes        | number | The id of your telegram group. You can use telegram API for check that through Postman. Check [HERE](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id) for more detail. Normally, that start with -100... |       |
| TELEGRAM_TOPIC_ID        | No         | number | The id of you topic if you enable Topics in group setting.                                                                                                                                                                                    |       |
| SENTRY_INTEGRATION_TOKEN | Yes        | string | The token that geneate by sentry. Check [HERE](https://docs.sentry.io/organization/integrations/integration-platform/#permissions) for more detail.                                                                                           |       |
| SENTRY_ORGANIZATION_SLUG | Yes        | string | The organization slug in your sentry organization setting                                                                                                                                                                                     |       |

## Custom Integrations Configuration

- After you create the new integration then you need config some part like below image

**Note:** _`<your-server-here.domain>` is your webhooks server. If you are running locally. You can use [Ngrok](https://ngrok.com/) for generate this._

![sentry internal integration config detail](https://github.com/tuanngocptn/sentry-telegram-webhook/blob/main/.github/assets/imgs/sentry_internal_integration_config_detail.png?raw=true 'sentry internal integration config detail')

- And permission, that allow you trigger to you webhook.

![sentry internal integration config permission](https://github.com/tuanngocptn/sentry-telegram-webhook/blob/main/.github/assets/imgs/sentry_internal_integration_config_permission.png?raw=true 'sentry internal integration config permission')

## Running the app (normal)

1. Clone `.env.template` file

   ```sh
   cp .env.template .env
   ```

2. Edit `.env` file with your value.

   ```env
   LANGUAGE=en
   TELEGRAM_BOT_TOKEN=<get from bot father>
   TELEGRAM_GROUP_ID=<your telegram group id or telegram channel id>
   TELEGRAM_TOPIC_ID=<not require - your telegram topic (when enable Topics in group setting)>
   SENTRY_INTEGRATION_TOKEN=<token in Custom Integrations in Sentry Setting>
   SENTRY_ORGANIZATION_SLUG=<your Sentry org slug>
   ```

3. Run with npm

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod
   ```

## Running the app with docker (Recommended)

**Note:** _You don't need run `npm install` and setup nodejs._

1. Run direct from docker hub: (don't need clone the repository)

- create the compose file with below information. More details [HERE](https://hub.docker.com/repository/docker/tuanngocptn/sentry-telegram-webhook).

  ```yml
  services:
    app:
      image: tuanngocptn/sentry-telegram-webhook:latest
      environment:
        - LANGUAGE=en
        - TELEGRAM_BOT_TOKEN=<get from bot father>
        - TELEGRAM_GROUP_ID=<your telegram group id or telegram channel id>
        - TELEGRAM_TOPIC_ID=<not require - your telegram topic (when enable Topics in group setting)>
        - SENTRY_INTEGRATION_TOKEN=<token in Custom Integrations in Sentry Setting>
        - SENTRY_ORGANIZATION_SLUG=<your Sentry org slug>
      ports:
        - 3000:3000
      volumes:
        - ./logs:/code/logs
  ```

2. For running locally (debug):

- Clone `docker-compose-template.yml`

  ```sh
  cp docker-compose-template.yml docker-compose.yml
  ```

- Edit environment variables:

  ```yml
  environment:
    - LANGUAGE=en
    - TELEGRAM_BOT_TOKEN=<get from bot father>
    - TELEGRAM_GROUP_ID=<your telegram group id or telegram channel id>
    - TELEGRAM_TOPIC_ID=<not require - your telegram topic (when enable Topics in group setting)>
    - SENTRY_INTEGRATION_TOKEN=<token in Custom Integrations in Sentry Setting>
    - SENTRY_ORGANIZATION_SLUG=<your Sentry org slug>
  ```

- Run with docker:

  ```sh
  docker compose up
  ```

3. For running production (release):

- Clone `docker-compose-prod-template.yml`

  ```sh
  cp docker-compose-prod-template.yml docker-compose.yml
  ```

- Edit environment variables:

  ```yml
  environment:
    - LANGUAGE=en
    - TELEGRAM_BOT_TOKEN=<get from bot father>
    - TELEGRAM_GROUP_ID=<your telegram group id or telegram channel id>
    - TELEGRAM_TOPIC_ID=<not require - your telegram topic (when enable Topics in group setting)>
    - SENTRY_INTEGRATION_TOKEN=<token in Custom Integrations in Sentry Setting>
    - SENTRY_ORGANIZATION_SLUG=<your Sentry org slug>
  ```

- Run with docker:

  ```sh
  docker compose up
  ```

## License

Nest is [MIT licensed](LICENSE).
