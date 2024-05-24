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
import { AppHelper } from './app.helper';

@Controller()
@UseInterceptors(AppInterceptor)
export class AppController {
  constructor(
    @Inject('winston')
    private readonly logger: Logger,
    private readonly appService: AppService,
    private readonly appHelper: AppHelper,
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
        this.logger.info(reqBody);
        const { issue } = reqBody.data;
        if (!this.appHelper.isAllowNotification(issue.project.slug)) {
          return;
        }
        const issueDetails = await this.appService.getIssueDetail(issue.id);
        const hookMessageData: HookMessageDataType = {
          issueAction: reqBody.action,
          appName: issue.project.name,
          title: issue.title,
          errorPosition: issue.culprit,
          detailLink: `https://${process.env.SENTRY_ORGANIZATION_SLUG}.sentry.io/issues/${issue.id}`,
          ...issueDetails,
        };
        this.appService.sentTelegramMessage(hookMessageData);
      } catch (ex) {
        this.logger.error(ex);
      }
    };
    running();
    return reqBody.installation || { message: 'success' };
  }
}
