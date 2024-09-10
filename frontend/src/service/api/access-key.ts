import { request } from '../request';

/** get access-key list */
export function fetchGetAccessKeyList(params?: Access.AccessKeySearchParams) {
  return request<Access.AccessKeyList>({
    url: '/access-key',
    method: 'get',
    params
  });
}

/**
 * 创建access-key
 *
 * @param req access-key实体
 * @returns nothing
 */
export function createAccessKey(req: Access.AccessKeyModel) {
  return request({
    url: '/access-key',
    method: 'post',
    data: req
  });
}

/**
 * 更新access-key
 *
 * @param req access-key实体
 * @returns nothing
 */
export function updateAccessKey(req: Access.AccessKeyModel) {
  return request({
    url: '/access-key',
    method: 'put',
    data: req
  });
}

/**
 * 删除access-key
 *
 * @param id ID
 * @returns nothing
 */
export function deleteAccessKey(id: string) {
  return request({
    url: `/access-key/${id}`,
    method: 'delete'
  });
}
