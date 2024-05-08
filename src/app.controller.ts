import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AppInterceptor } from './app.interceptor';
import { HookMessageDataType, SentryRequestType } from './app';
import { AppHelper } from './app.helper';

@Controller()
@UseInterceptors(AppInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appHelper: AppHelper,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('/sentry/webhooks')
  @HttpCode(HttpStatus.OK)
  async webhooks(@Body() reqBody: SentryRequestType) {
    const { issue } = reqBody.data;
    const environment = await this.appService.checkSentryDetailTagIssue(
      'environment',
      issue.id,
    );
    const operationSystem = await this.appService.checkSentryDetailTagIssue(
      'os',
      issue.id,
    );
    const hookMessageData: HookMessageDataType = {
      issueAction: reqBody.action,
      appName: issue.project.name,
      title: issue.title,
      errorPosition: issue.culprit,
      environment,
      operationSystem,
      detailLink: `https://${process.env.SENTRY_ORGANIZATION_SLUG}.sentry.io/issues/${issue.id}`,
    };
    this.appService.sentTelegramMessage(hookMessageData);

    return reqBody.installation;
  }
}
