import { Injectable } from '@nestjs/common';
import { HelloWorldResponseType, HookMessageDataType } from './app';
import { AppHelper } from './app.helper';
import * as TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
@Injectable()
export class AppService {
  private bot;

  constructor(private readonly appHelper: AppHelper) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  }

  getHello(): HelloWorldResponseType {
    return { message: 'Hello World!' };
  }

  async sentTelegramMessage(data: HookMessageDataType) {
    const message = this.appHelper.generateHookMessage(data);
    const sendMessageOptions: TelegramBot.SendMessageOptions = {
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
      reply_to_message_id: process.env.TELEGRAM_TOPIC_ID
        ? parseInt(process.env.TELEGRAM_TOPIC_ID)
        : undefined,
    };

    await this.bot.sendMessage(
      process.env.TELEGRAM_GROUP_ID,
      message,
      sendMessageOptions,
    );
  }
  async getIssueDetail(issueId): Promise<HookMessageDataType> {
    const { data } = await axios({
      method: 'get',
      url: `https://sentry.io/api/0/organizations/${process.env.SENTRY_ORGANIZATION_SLUG}/issues/${issueId}/tags/`,
      headers: {
        Authorization: `Bearer ${process.env.SENTRY_INTEGRATION_TOKEN}`,
      },
    });
    return data?.reduce(
      (cur, nex) => ({
        ...cur,
        [nex.key]: nex?.topValues
          ?.map?.((item) => item?.value)
          ?.filter((item) => !!item)
          ?.join(', '),
      }),
      {},
    ) as HookMessageDataType;
  }
}
