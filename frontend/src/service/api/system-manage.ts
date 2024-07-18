import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/role',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/user',
    method: 'get',
    params
  });
}

/** get menu list */
export const fetchGetMenuList = () =>
  request<Api.SystemManage.Menu[]>({
    url: '/route',
    method: 'get'
  })
    .then(response => {
      const menus = response.data || [];
      return {
        data: {
          records: menus,
          total: menus.length,
          current: 1,
          size: menus.length
        },
        error: null
      };
    })
    .catch(error => {
      return {
        data: null,
        error: error.message
      };
    });

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}
