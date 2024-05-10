import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Logger } from 'winston';
import { HookMessageDataType, SentryRequestType } from './app';
import { AppInterceptor } from './app.interceptor';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(AppInterceptor)
export class AppController {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('/sentry/webhooks')
  @HttpCode(HttpStatus.OK)
  webhooks(@Body() reqBody: SentryRequestType) {
    const running = async () => {
      try {
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
      } catch (ex) {
        this.logger.error('Error: ', ex);
      }
    };
    running();
    return reqBody.installation;
  }
}
