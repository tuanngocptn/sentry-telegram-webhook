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
}
