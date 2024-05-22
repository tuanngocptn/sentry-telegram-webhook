import { Injectable } from '@nestjs/common';
import { HookMessageDataType } from './app';
import { generateHookMessageEn, generateHookMessageVi } from './app.utils';

@Injectable()
export class AppHelper {
  generateHookMessage(data: HookMessageDataType): string {
    if ('vi' === process.env.LANGUAGE) {
      return generateHookMessageVi(data);
    }
    return generateHookMessageEn(data);
  }

  isAllowNotification(projectSlug: string): boolean {
    const sentryProjectSlugFilter: string =
      process.env.SENTRY_PROJECT_SLUG_ALLOW_LIST;

    if (!sentryProjectSlugFilter) {
      return true;
    }

    const projectSlugFilter = sentryProjectSlugFilter
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item);

    if (
      projectSlugFilter.length > 0 &&
      !projectSlugFilter.includes(projectSlug)
    ) {
      return false;
    }

    return true;
  }
}
