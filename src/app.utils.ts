import { HookMessageDataType } from './app';

export function generateHookMessageEn(data: HookMessageDataType) {
  const _data: HookMessageDataType = escapedHookMessageData(data);
  return `
*💣 Issue ${_data.issueAction}:* 

\\- *App name:* ${_data.appName}  
\\- *Title:* ${_data.title}  
\\- *Position:* ${_data.errorPosition}  
\\- *Environment:* ${_data.environment}  
\\- *Operation system:* ${_data.operationSystem} 

*Detail:* [HERE](${_data.detailLink}) 
  `;
}

export function generateHookMessageVi(data: HookMessageDataType) {
  const _data: HookMessageDataType = escapedHookMessageData(data);
  return `
*💣 Lỗi về \\(${_data.issueAction}\\):* 

\\- *Tên app:* ${_data.appName}  
\\- *Tiêu đề:* ${_data.title}  
\\- *Lỗi ở:* ${_data.errorPosition}  
\\- *Môi trường:* ${_data.environment}  
\\- *Hệ điều hành:* ${_data.operationSystem} 

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
