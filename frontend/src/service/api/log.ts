import { request } from '../request';

/** get login-log list */
export function fetchGetLoginLogList(params?: Log.LoginLogSearchParams) {
  return request<Log.LoginLogList>({
    url: '/login-log',
    method: 'get',
    params
  });
}

/** get operation-log list */
export function fetchGetOperationLogList(params?: Log.OperationLogSearchParams) {
  return request<Log.OperationLogList>({
    url: '/operation-log',
    method: 'get',
    params
  });
}
