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
  async checkSentryDetailTagIssue(tag, issueId) {
    const res = await axios({
      method: 'get',
      url: `https://sentry.io/api/0/issues/${issueId}/tags/${tag}/`,
      headers: {
        Authorization: `Bearer ${process.env.SENTRY_INTEGRATION_TOKEN}`,
      },
    });
    return res?.data?.topValues?.[0].value;
  }
}
