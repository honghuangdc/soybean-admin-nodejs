import { Injectable, Inject } from '@nestjs/common';
import * as casbin from 'casbin';

import { AUTHZ_ENFORCER } from '../constants/authz.constants';

import * as authzAPI from './authz-api';

/**
 * A wrapper of casbin RBAC API.
 * All methods are transformed to async in terms of possible IO operations
 * in the future.
 * @deprecated This service will be removed and replace by AuthZService in a later release.
 */
@Injectable()
export class AuthZRBACService {
  constructor(
    @Inject(AUTHZ_ENFORCER)
    public readonly enforcer: casbin.Enforcer,
  ) {}

  /**
   * Gets the roles that a user has.
   *
   * @param {string} name username
   * @param {string} [domain] domain name
   * @returns {Promise<string[]>} roles owned by the user
   * @memberof AuthZRBACService
   */
  getRolesForUser(name: string, domain?: string): Promise<string[]> {
    return authzAPI.getRolesForUser(this.enforcer, name, domain);
  }

  /**
   * Gets the users that has a role.
   *
   * @param {string} name username
   * @param {string} [domain] domain name
   * @returns {Promise<string[]>} users that has a role
   * @memberof AuthZRBACService
   */
  getUsersForRole(name: string, domain?: string): Promise<string[]> {
    return authzAPI.getUsersForRole(this.enforcer, name, domain);
  }

  /**
   * Determines whether a user has a role.
   *
   * @param {string} name username
   * @param {string} role role name
   * @param {string} [domain] domain name
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  hasRoleForUser(
    name: string,
    role: string,
    domain?: string,
  ): Promise<boolean> {
    return authzAPI.hasRoleForUser(this.enforcer, name, role, domain);
  }

  /**
   * Adds a role for a user.
   * Returns false if the user already has the role (aka not affected).
   *
   * @param {string} user username
   * @param {string} role role name
   * @param {string} [domain] domain name
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  addRoleForUser(
    user: string,
    role: string,
    domain?: string,
  ): Promise<boolean> {
    return authzAPI.addRoleForUser(this.enforcer, user, role, domain);
  }

  /**
   * deletes a role for a user.
   * Returns false if the user does not have the role (aka not affected).
   *
   * @param {string} user username
   * @param {string} role role name
   * @param {string} [domain] domain name
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deleteRoleForUser(
    user: string,
    role: string,
    domain?: string,
  ): Promise<boolean> {
    return authzAPI.deleteRoleForUser(this.enforcer, user, role, domain);
  }

  /**
   * Deletes all roles for a user.
   * Returns false if the user does not have any roles (aka not affected).
   *
   * @param {string} user username
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deleteRolesForUser(user: string, domain?: string): Promise<boolean> {
    return authzAPI.deleteRolesForUser(this.enforcer, user, domain);
  }

  /**
   * Deletes a user.
   * Returns false if the user does not exist (aka not affected).
   *
   * @param {string} user username
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  async deleteUser(user: string): Promise<boolean> {
    return authzAPI.deleteUser(this.enforcer, user);
  }

  /**
   * Deletes a role
   *
   * @param {string} role role name
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deleteRole(role: string): Promise<boolean> {
    return authzAPI.deleteRole(this.enforcer, role);
  }

  /**
   * Deletes a permission.
   * Returns false if the permission does not exist (aka not affected).
   *
   * @param {...string[]} permission permission per casbin model definition
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deletePermission(...permission: string[]): Promise<boolean> {
    return authzAPI.deletePermission(this.enforcer, ...permission);
  }

  /**
   * Adds a permission for a user or role.
   * Returns false if the user or role already has the permission (aka not affected).
   *
   * @param {string} userOrRole username or role name
   * @param {...string[]} permission permission per casbin model definition
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  addPermissionForUser(
    userOrRole: string,
    ...permission: string[]
  ): Promise<boolean> {
    return authzAPI.addPermissionForUser(
      this.enforcer,
      userOrRole,
      ...permission,
    );
  }

  /**
   * Deletes a permission for a user or role.
   * Returns false if the user or role does not have the permission (aka not affected).
   *
   * @param {string} userOrRole username or role name
   * @param {...string[]} permission permission per casbin model definition
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deletePermissionForUser(
    userOrRole: string,
    ...permission: string[]
  ): Promise<boolean> {
    return authzAPI.deletePermissionForUser(
      this.enforcer,
      userOrRole,
      ...permission,
    );
  }

  /**
   * Deletes permissions for a user or role.
   * Returns false if the user or role does not have any permissions (aka not affected).
   *
   * @param {string} userOrRole username or role name
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  deletePermissionsForUser(userOrRole: string): Promise<boolean> {
    return authzAPI.deletePermissionsForUser(this.enforcer, userOrRole);
  }

  /**
   * Gets permissions for a user or role.
   *
   * @param {string} userOrRole username or role name
   * @returns {Promise<string[][]>}
   * @memberof AuthZRBACService
   */
  getPermissionsForUser(userOrRole: string): Promise<string[][]> {
    return authzAPI.getPermissionsForUser(this.enforcer, userOrRole);
  }

  /**
   * Determines whether a user has a permission.
   *
   * @param {string} user username
   * @param {...string[]} permission permission per casbin model definition
   * @returns {Promise<boolean>}
   * @memberof AuthZRBACService
   */
  hasPermissionForUser(
    user: string,
    ...permission: string[]
  ): Promise<boolean> {
    return authzAPI.hasPermissionForUser(this.enforcer, user, ...permission);
  }

  /**
   * Gets implicit roles that a user has.
   * Compared to getRolesForUser(), this function retrieves indirect roles besides direct roles.\
   *
   * For example:
   *
   * g, alice, role:admin\
   * g, role:admin, role:user
   *
   *
   * getRolesForUser("alice") can only get: ["role:admin"].
   * But getImplicitRolesForUser("alice") will get: ["role:admin", "role:user"].
   *
   * @param {string} name username
   * @param {...string[]} domain domains
   * @returns {Promise<string[]>}
   * @memberof AuthZRBACService
   */
  getImplicitRolesForUser(
    name: string,
    ...domain: string[]
  ): Promise<string[]> {
    return authzAPI.getImplicitRolesForUser(this.enforcer, name, ...domain);
  }

  /**
   * Gets implicit permissions for a user or role.
   * Compared to getPermissionsForUser(), this function retrieves permissions for inherited roles.\
   *
   * For example:
   * p, admin, data1, read
   * p, alice, data2, read
   * g, alice, admin
   *
   * getPermissionsForUser("alice") can only get: [["alice", "data2", "read"]].\
   * But getImplicitPermissionsForUser("alice") will get: [["admin", "data1", "read"], ["alice", "data2", "read"]].
   *
   * @param {string} user username
   * @returns {Promise<string[][]>}
   * @memberof AuthZRBACService
   */
  getImplicitPermissionsForUser(
    user: string,
    ...domain: string[]
  ): Promise<string[][]> {
    return authzAPI.getImplicitPermissionsForUser(
      this.enforcer,
      user,
      ...domain,
    );
  }
  /**
   * getImplicitUsersForPermission gets implicit users for a permission.
   * For example:
   * p, admin, data1, read
   * p, bob, data1, read
   * g, alice, admin
   *
   * getImplicitUsersForPermission("data1", "read") will get: ["alice", "bob"].
   * Note: only users will be returned, roles (2nd arg in "g") will be excluded.
   */
  getImplicitUsersForPermission(...permission: string[]): Promise<string[]> {
    return authzAPI.getImplicitUsersForPermission(this.enforcer, ...permission);
  }
}
