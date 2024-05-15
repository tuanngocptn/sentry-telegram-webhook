import { HookMessageDataType } from './app';

export function generateHookMessageEn(data: HookMessageDataType) {
  const _data: HookMessageDataType = escapedHookMessageData(data);
  return `
*💣 Issue ${_data.issueAction}:*

\\- *App name:* ${_data.appName || 'none'}
\\- *Title:* ${_data.title || 'none'}
\\- *Position:* ${_data.errorPosition || 'none'}
\\- *Environment:* ${_data.environment || 'none'}
\\- *Version:* ${_data.release || 'none'}
\\- *Devices:* ${_data.device || 'none'}
\\- *Operation System:* ${_data.os || 'none'}

*Detail:* [HERE](${_data.detailLink})
  `;
}

export function generateHookMessageVi(data: HookMessageDataType) {
  const _data: HookMessageDataType = escapedHookMessageData(data);
  return `
*💣 Lỗi về \\(${_data.issueAction || 'none'}\\):*

\\- *Tên app:* ${_data.appName || 'none'}
\\- *Tiêu đề:* ${_data.title || 'none'}
\\- *Lỗi ở:* ${_data.errorPosition || 'none'}
\\- *Môi trường:* ${_data.environment || 'none'}
\\- *Phiên bản:* ${_data.release || 'none'}
\\- *Thiết bị:* ${_data.device || 'none'}
\\- *Hệ điều hành:* ${_data.os || 'none'}

*Xem chi tiết:* [TẠI ĐÂY](${_data.detailLink}) 
  `;
}

function escapedHookMessageData(
  input: HookMessageDataType,
): HookMessageDataType {
  const output: HookMessageDataType = {};
  for (const [key, value] of Object.entries(input)) {
    output[key] =
      typeof value === 'string'
        ? value.replace(/([|{\[\]*_~}+)(#>!=\-.])/gm, '\\$1')
        : '';
  }
  return output;
}
