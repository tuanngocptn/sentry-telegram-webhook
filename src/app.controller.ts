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
        const action = reqBody.action;
        const data = reqBody.data;

        let title: string;
        let culprit: string;
        let projectName: string = 'Unknown';
        let projectSlug: string = '';
        let issueId: string;
        let webUrl: string;
        let issueDetails: any = {};

        // Handle different event types
        if (data.issue) {
          // issue.created, issue.resolved, etc.
          title = data.issue.title;
          culprit = data.issue.culprit;
          projectName = data.issue.project?.name || 'Unknown';
          projectSlug = data.issue.project?.slug || '';
          issueId = data.issue.id;
          webUrl = data.issue.web_url || data.issue.permalink || '';

          // Try to get issue details from API
          try {
            if (issueId) {
              issueDetails = await this.appService.getIssueDetail(issueId);
            }
          } catch (ex) {
            this.logger.warn('Failed to get issue details, continuing without them');
          }

        } else if (data.event) {
          // event_alert.triggered
          const event = data.event as any;
          title = event.title;
          culprit = event.culprit;
          issueId = event.issue_id;
          webUrl = event.web_url || '';

          // project can be an object or a number
          if (typeof event.project === 'object' && event.project) {
            projectName = event.project.name || 'Unknown';
            projectSlug = event.project.slug || '';
          } else {
            // Extract the project name from the URL
            if (event.url) {
              const match = event.url.match(/\/projects\/([^/]+)\/([^/]+)\//);
              if (match) {
                projectName = match[2];
                projectSlug = match[2];
              }
            }
          }

          // Extract data from contexts (similar to data.error)
          const contexts = event.contexts || {};
          const exception = event.exception?.values?.[0];
          const frame = exception?.stacktrace?.frames?.slice(-1)[0];

          // Position with full path and line number
          if (frame) {
            const filename = frame.abs_path || frame.filename || 'unknown';
            const lineno = frame.lineno || '?';
            const func = frame.function && frame.function !== '?' ? ` in ${frame.function}` : '';
            culprit = `${filename}:${lineno}${func}`;
          }

          // Form issueDetails from event data
          issueDetails = {
            environment: event.environment || '',
            release: event.release || '',
            dist: event.dist || '',
            level: event.level || 'error',
            handled: exception?.mechanism?.handled !== false ? 'yes' : 'no',
            mechanism: exception?.mechanism?.type || '',
            device: contexts.device?.family || contexts.device?.model || '',
            os: this.formatOs(contexts),
            user: this.formatUser(event.user),
            browser: contexts.browser?.browser || '',
            runtime: contexts.runtime?.runtime || '',
            url: event.request?.url || '',
          };

        } else if (data.error) {
          // error.created - the most detailed type
          const error = data.error as any;
          title = error.title;
          culprit = error.culprit;
          issueId = error.issue_id;
          webUrl = error.web_url || '';

          // Extract the project name from issue_url or url
          if (error.url) {
            const match = error.url.match(/\/projects\/([^/]+)\/([^/]+)\//);
            if (match) {
              projectName = match[2]; // sit30-php
              projectSlug = match[2];
            }
          }
          

          // Extracting data from contexts
          const contexts = error.contexts || {};
          const exception = error.exception?.values?.[0];
          const frame = exception?.stacktrace?.frames?.slice(-1)[0]; // last frame - location of error

          // Position with full path and line number
          if (frame) {
            const filename = frame.abs_path || frame.filename || 'unknown';
            const lineno = frame.lineno || '?';
            const func = frame.function && frame.function !== '?' ? ` in ${frame.function}` : '';
            culprit = `${filename}:${lineno}${func}`;
          }

          // Form issueDetails from error data
          issueDetails = {
            environment: error.environment || 'unknown',
            release: error.release || 'none',
            dist: error.dist || '',
            level: error.level || 'error',
            handled: exception?.mechanism?.handled !== false ? 'yes' : 'no',
            mechanism: exception?.mechanism?.type || '',
            device: contexts.device?.family || contexts.device?.model || '',
            os: this.formatOs(contexts),
            user: this.formatUser(error.user),
            browser: contexts.browser?.browser || '',
            runtime: contexts.runtime?.runtime || '',
            url: error.request?.url || '',
          };

        } else {
          this.logger.info('Unknown event structure, skipping');
          return;
        }

        if (projectSlug && !this.appHelper.isAllowNotification(projectSlug)) {
          this.logger.info(
            `This app slug "${projectSlug}" is not allowed for push notifications`,
          );
          return;
        }

        const hookMessageData: HookMessageDataType = {
          issueAction: action,
          appName: projectName,
          title: title,
          errorPosition: culprit,
          detailLink: webUrl || `${process.env.SENTRY_URL}/organizations/${process.env.SENTRY_ORGANIZATION_SLUG}/issues/${issueId}/`,
          ...issueDetails,
        };

        await this.appService.sentTelegramMessage(hookMessageData);
        this.logger.info('Telegram message sent successfully');
      } catch (ex) {
        this.logger.error(ex);
      }
    };

    running();
    return reqBody.installation || { message: 'success' };
  }

  private formatOs(contexts: any): string {
    // Priority: server OS, then client OS
    const serverOs = contexts.os;
    const clientOs = contexts.client_os;
    
    const parts: string[] = [];
    
    if (serverOs?.name) {
      parts.push(`${serverOs.name} ${serverOs.version || ''}`.trim());
    }
    
    if (clientOs?.name && clientOs.name !== serverOs?.name) {
      parts.push(`Client: ${clientOs.name} ${clientOs.version || ''}`.trim());
    }
    
    return parts.join(', ') || '';
  }

  private formatUser(user: any): string {
    if (!user) return '';
    return user.email || user.username || user.id || '';
  }
}
