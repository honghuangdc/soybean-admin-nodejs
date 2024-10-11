import { Injectable, Inject } from '@nestjs/common';
import * as casbin from 'casbin';

import { AUTHZ_ENFORCER } from '../constants/authz.constants';

import * as authzAPI from './authz-api';

/**
 * A wrapper of casbin RBAC API.
 * All methods are transformed to async in terms of possible IO operations
 * in the future.
 */
@Injectable()
export class AuthZService {
  constructor(
    @Inject(AUTHZ_ENFORCER)
    public readonly enforcer: casbin.Enforcer,
  ) {}

  /**
   * RBAC API
   */

  /**
   * Gets the roles that a user has.
   *
   * @param {string} name username
   * @param {string} [domain] domain name
   * @returns {Promise<string[]>} roles owned by the user
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
   */
  async deleteUser(user: string): Promise<boolean> {
    return authzAPI.deleteUser(this.enforcer, user);
  }

  /**
   * Deletes a role
   *
   * @param {string} role role name
   * @returns {Promise<boolean>}
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
   */
  deletePermissionsForUser(userOrRole: string): Promise<boolean> {
    return authzAPI.deletePermissionsForUser(this.enforcer, userOrRole);
  }

  /**
   * Gets permissions for a user or role.
   *
   * @param {string} userOrRole username or role name
   * @returns {Promise<string[][]>}
   * @memberof AuthZService
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
   * @memberof AuthZService
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
   * @memberof AuthZService
   */
  getImplicitRolesForUser(
    name: string,
    ...domain: string[]
  ): Promise<string[]> {
    return authzAPI.getImplicitRolesForUser(this.enforcer, name, ...domain);
  }

  /**
   * Gets implicit resources that a user has access to.
   *
   * For example:
   *
   * g, alice, role:admin
   * p, alice, resource1, read
   * p, role:admin, resource1, write
   *
   *
   * getImplicitResourcesForUser("alice") will return: [["alice", "resource1", "read"], ["role:admin", "resource1", "write"]].
   *
   * @param {string} name username
   * @param {...string[]} domain domains
   * @returns {Promise<string[][]>}
   * @memberof AuthZService
   */
  getImplicitResourcesForUser(
    name: string,
    ...domain: string[]
  ): Promise<string[][]> {
    return authzAPI.getImplicitResourcesForUser(this.enforcer, name, ...domain);
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
   * @memberof AuthZService
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

  /**
   * Management API
   */

  /**
   * enforce decides whether a "subject" can access a "object" with the operation "action"
   *
   * @param params the request parameters, usually (sub, obj, act)
   *
   * @return whether or not the request is allowed
   */
  enforce(...params: any[]): Promise<boolean> {
    return authzAPI.enforce(this.enforcer, params);
  }

  /**
   * enforceWithMatcher uses a custom matcher to decides whether a "subject" can access a "object" with the operation "action"
   *
   * @param matcher the matcher statement to use
   * @param params the request parameters, usually (sub, obj, act)
   *
   * @return whether or not the request is allowed
   */
  enforceWithMatcher(matcher: string, ...params: any[]): Promise<boolean> {
    return authzAPI.enforceWithMatcher(this.enforcer, matcher, params);
  }

  /**
   * enforceEx explains enforcement by returning matched rules.
   *
   * @param params the request parameters, usually (sub, obj, act)
   *
   * @return whether or not the request is allowed, and what policy caused that decision
   */
  enforceEx(...params: any[]): Promise<[boolean, string[]]> {
    return authzAPI.enforceEx(this.enforcer, params);
  }

  /**
   * enforceExWithMatcher uses a custom matcher and explains enforcement by returning matched rules.
   *
   * @param matcher the matcher statement to use
   * @param params the request parameters, usually (sub, obj, act)
   *
   * @return whether or not the request is allowed, and what policy caused that decision
   */
  enforceExWithMatcher(
    matcher: string,
    ...params: any[]
  ): Promise<[boolean, string[]]> {
    return authzAPI.enforceExWithMatcher(this.enforcer, matcher, params);
  }

  /**
   * batchEnforce enforces each request and returns result in a bool array
   *
   * @param params the request parameters, usually (sub, obj, act)
   *
   * @return an array with the enforcement results for each given request
   */
  batchEnforce(params: any[][]): Promise<boolean[]> {
    return authzAPI.batchEnforce(this.enforcer, params);
  }

  /**
   * getAllSubjects gets the list of subjects that show up in the current policy.
   *
   * @return all the subjects in "p" policy rules. It actually collects the
   *         0-index elements of "p" policy rules. So make sure your subject
   *         is the 0-index element, like (sub, obj, act). Duplicates are removed.
   */
  getAllSubjects(): Promise<string[]> {
    return authzAPI.getAllSubjects(this.enforcer);
  }
  /**
   * getAllNamedSubjects gets the list of subjects that show up in the currentnamed policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @return all the subjects in policy rules of the ptype type. It actually
   *         collects the 0-index elements of the policy rules. So make sure
   *         your subject is the 0-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllNamedSubjects(ptype: string): Promise<string[]> {
    return authzAPI.getAllNamedSubjects(this.enforcer, ptype);
  }
  /**
   * getAllObjects gets the list of objects that show up in the current policy.
   *
   * @return all the objects in "p" policy rules. It actually collects the
   *         1-index elements of "p" policy rules. So make sure your object
   *         is the 1-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllObjects(): Promise<string[]> {
    return authzAPI.getAllObjects(this.enforcer);
  }
  /**
   * getAllNamedObjects gets the list of objects that show up in the current named policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @return all the objects in policy rules of the ptype type. It actually
   *         collects the 1-index elements of the policy rules. So make sure
   *         your object is the 1-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllNamedObjects(ptype: string): Promise<string[]> {
    return authzAPI.getAllNamedObjects(this.enforcer, ptype);
  }
  /**
   * getAllActions gets the list of actions that show up in the current policy.
   *
   * @return all the actions in "p" policy rules. It actually collects
   *         the 2-index elements of "p" policy rules. So make sure your action
   *         is the 2-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllActions(): Promise<string[]> {
    return authzAPI.getAllActions(this.enforcer);
  }
  /**
   * GetAllNamedActions gets the list of actions that show up in the current named policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @return all the actions in policy rules of the ptype type. It actually
   *         collects the 2-index elements of the policy rules. So make sure
   *         your action is the 2-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllNamedActions(ptype: string): Promise<string[]> {
    return authzAPI.getAllNamedActions(this.enforcer, ptype);
  }
  /**
   * getAllRoles gets the list of roles that show up in the current policy.
   *
   * @return all the roles in "g" policy rules. It actually collects
   *         the 1-index elements of "g" policy rules. So make sure your
   *         role is the 1-index element, like (sub, role).
   *         Duplicates are removed.
   */
  getAllRoles(): Promise<string[]> {
    return authzAPI.getAllRoles(this.enforcer);
  }
  /**
   * getAllNamedRoles gets the list of roles that show up in the current named policy.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @return all the subjects in policy rules of the ptype type. It actually
   *         collects the 0-index elements of the policy rules. So make
   *         sure your subject is the 0-index element, like (sub, obj, act).
   *         Duplicates are removed.
   */
  getAllNamedRoles(ptype: string): Promise<string[]> {
    return authzAPI.getAllNamedRoles(this.enforcer, ptype);
  }
  /**
   * getPolicy gets all the authorization rules in the policy.
   *
   * @return all the "p" policy rules.
   */
  getPolicy(): Promise<string[][]> {
    return authzAPI.getPolicy(this.enforcer);
  }
  /**
   * getFilteredPolicy gets all the authorization rules in the policy, field filters can be specified.
   *
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return the filtered "p" policy rules.
   */
  getFilteredPolicy(
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<string[][]> {
    return authzAPI.getFilteredPolicy(
      this.enforcer,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * getNamedPolicy gets all the authorization rules in the named policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @return the "p" policy rules of the specified ptype.
   */
  getNamedPolicy(ptype: string): Promise<string[][]> {
    return authzAPI.getNamedPolicy(this.enforcer, ptype);
  }
  /**
   * getFilteredNamedPolicy gets all the authorization rules in the named policy, field filters can be specified.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return the filtered "p" policy rules of the specified ptype.
   */
  getFilteredNamedPolicy(
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<string[][]> {
    return authzAPI.getFilteredNamedPolicy(
      this.enforcer,
      ptype,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * getGroupingPolicy gets all the role inheritance rules in the policy.
   *
   * @return all the "g" policy rules.
   */
  getGroupingPolicy(): Promise<string[][]> {
    return authzAPI.getGroupingPolicy(this.enforcer);
  }
  /**
   * getFilteredGroupingPolicy gets all the role inheritance rules in the policy, field filters can be specified.
   *
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value "" means not to match this field.
   * @return the filtered "g" policy rules.
   */
  getFilteredGroupingPolicy(
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<string[][]> {
    return authzAPI.getFilteredGroupingPolicy(
      this.enforcer,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * getNamedGroupingPolicy gets all the role inheritance rules in the policy.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @return the "g" policy rules of the specified ptype.
   */
  getNamedGroupingPolicy(ptype: string): Promise<string[][]> {
    return authzAPI.getNamedGroupingPolicy(this.enforcer, ptype);
  }
  /**
   * getFilteredNamedGroupingPolicy gets all the role inheritance rules in the policy, field filters can be specified.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return the filtered "g" policy rules of the specified ptype.
   */
  getFilteredNamedGroupingPolicy(
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<string[][]> {
    return authzAPI.getFilteredNamedGroupingPolicy(
      this.enforcer,
      ptype,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * hasPolicy determines whether an authorization rule exists.
   *
   * @param params the "p" policy rule, ptype "p" is implicitly used.
   * @return whether the rule exists.
   */
  hasPolicy(...params: string[]): Promise<boolean> {
    return authzAPI.hasPolicy(this.enforcer, ...params);
  }
  /**
   * hasNamedPolicy determines whether a named authorization rule exists.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param params the "p" policy rule.
   * @return whether the rule exists.
   */
  hasNamedPolicy(ptype: string, ...params: string[]): Promise<boolean> {
    return authzAPI.hasNamedPolicy(this.enforcer, ptype, ...params);
  }
  /**
   * addPolicy adds an authorization rule to the current policy.
   * If the rule already exists, the function returns false and the rule will not be added.
   * Otherwise the function returns true by adding the new rule.
   *
   * @param params the "p" policy rule, ptype "p" is implicitly used.
   * @return succeeds or not.
   */
  addPolicy(...params: string[]): Promise<boolean> {
    return authzAPI.addPolicy(this.enforcer, ...params);
  }

  /**
   * addPolicies adds authorization rules to the current policy.
   * If the rule already exists, the function returns false and the rules will not be added.
   * Otherwise the function returns true by adding the new rules.
   *
   * @param rules the "p" policy rules, ptype "p" is implicitly used.
   * @return succeeds or not.
   */
  addPolicies(rules: string[][]): Promise<boolean> {
    return authzAPI.addPolicies(this.enforcer, rules);
  }

  /**
   * addNamedPolicy adds an authorization rule to the current named policy.
   * If the rule already exists, the function returns false and the rule will not be added.
   * Otherwise the function returns true by adding the new rule.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param params the "p" policy rule.
   * @return succeeds or not.
   */
  addNamedPolicy(ptype: string, ...params: string[]): Promise<boolean> {
    return authzAPI.addNamedPolicy(this.enforcer, ptype, ...params);
  }

  /**
   * addNamedPolicies adds authorization rules to the current named policy.
   * If the rule already exists, the function returns false and the rules will not be added.
   * Otherwise the function returns true by adding the new rules.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param rules the "p" policy rules.
   * @return succeeds or not.
   */
  addNamedPolicies(ptype: string, rules: string[][]): Promise<boolean> {
    return authzAPI.addNamedPolicies(this.enforcer, ptype, rules);
  }

  /**
   * updatePolicy updates an authorization rule from the current policy.
   * If the rule not exists, the function returns false.
   * Otherwise the function returns true by changing it to the new rule.
   *
   * @return succeeds or not.
   * @param oldRule the policy will be remove
   * @param newRule the policy will be added
   */
  updatePolicy(oldRule: string[], newRule: string[]): Promise<boolean> {
    return authzAPI.updatePolicy(this.enforcer, oldRule, newRule);
  }

  /**
   * updateNamedPolicy updates an authorization rule from the current named policy.
   * If the rule not exists, the function returns false.
   * Otherwise the function returns true by changing it to the new rule.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param oldRule the policy rule will be remove
   * @param newRule the policy rule will be added
   * @return succeeds or not.
   */
  updateNamedPolicy(
    ptype: string,
    oldRule: string[],
    newRule: string[],
  ): Promise<boolean> {
    return authzAPI.updateNamedPolicy(this.enforcer, ptype, oldRule, newRule);
  }

  /**
   * removePolicy removes an authorization rule from the current policy.
   *
   * @param params the "p" policy rule, ptype "p" is implicitly used.
   * @return succeeds or not.
   */
  removePolicy(...params: string[]): Promise<boolean> {
    return authzAPI.removePolicy(this.enforcer, ...params);
  }
  /**
   * removePolicies removes an authorization rules from the current policy.
   *
   * @param rules the "p" policy rules, ptype "p" is implicitly used.
   * @return succeeds or not.
   */
  removePolicies(rules: string[][]): Promise<boolean> {
    return authzAPI.removePolicies(this.enforcer, rules);
  }
  /**
   * removeFilteredPolicy removes an authorization rule from the current policy, field filters can be specified.
   *
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return succeeds or not.
   */
  removeFilteredPolicy(
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<boolean> {
    return authzAPI.removeFilteredPolicy(
      this.enforcer,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * removeNamedPolicy removes an authorization rule from the current named policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param params the "p" policy rule.
   * @return succeeds or not.
   */
  removeNamedPolicy(ptype: string, ...params: string[]): Promise<boolean> {
    return authzAPI.removeNamedPolicy(this.enforcer, ptype, ...params);
  }
  /**
   * removeNamedPolicies removes authorization rules from the current named policy.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param rules the "p" policy rules.
   * @return succeeds or not.
   */
  removeNamedPolicies(ptype: string, rules: string[][]): Promise<boolean> {
    return authzAPI.removeNamedPolicies(this.enforcer, ptype, rules);
  }
  /**
   * removeFilteredNamedPolicy removes an authorization rule from the current named policy, field filters can be specified.
   *
   * @param ptype the policy type, can be "p", "p2", "p3", ..
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return succeeds or not.
   */
  removeFilteredNamedPolicy(
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<boolean> {
    return authzAPI.removeFilteredNamedPolicy(
      this.enforcer,
      ptype,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * hasGroupingPolicy determines whether a role inheritance rule exists.
   *
   * @param params the "g" policy rule, ptype "g" is implicitly used.
   * @return whether the rule exists.
   */
  hasGroupingPolicy(...params: string[]): Promise<boolean> {
    return authzAPI.hasGroupingPolicy(this.enforcer, ...params);
  }
  /**
   * hasNamedGroupingPolicy determines whether a named role inheritance rule exists.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param params the "g" policy rule.
   * @return whether the rule exists.
   */
  hasNamedGroupingPolicy(ptype: string, ...params: string[]): Promise<boolean> {
    return authzAPI.hasNamedGroupingPolicy(this.enforcer, ptype, ...params);
  }
  /**
   * addGroupingPolicy adds a role inheritance rule to the current policy.
   * If the rule already exists, the function returns false and the rule will not be added.
   * Otherwise the function returns true by adding the new rule.
   *
   * @param params the "g" policy rule, ptype "g" is implicitly used.
   * @return succeeds or not.
   */
  addGroupingPolicy(...params: string[]): Promise<boolean> {
    return authzAPI.addGroupingPolicy(this.enforcer, ...params);
  }
  /**
   * addGroupingPolicies adds a role inheritance rules to the current policy.
   * If the rule already exists, the function returns false and the rules will not be added.
   * Otherwise the function returns true by adding the new rules.
   *
   * @param rules the "g" policy rules, ptype "g" is implicitly used.
   * @return succeeds or not.
   */
  addGroupingPolicies(rules: string[][]): Promise<boolean> {
    return authzAPI.addGroupingPolicies(this.enforcer, rules);
  }
  /**
   * addNamedGroupingPolicy adds a named role inheritance rule to the current policy.
   * If the rule already exists, the function returns false and the rule will not be added.
   * Otherwise the function returns true by adding the new rule.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param params the "g" policy rule.
   * @return succeeds or not.
   */
  addNamedGroupingPolicy(ptype: string, ...params: string[]): Promise<boolean> {
    return authzAPI.addNamedGroupingPolicy(this.enforcer, ptype, ...params);
  }
  /**
   * addNamedGroupingPolicies adds named role inheritance rules to the current policy.
   * If the rule already exists, the function returns false and the rules will not be added.
   * Otherwise the function returns true by adding the new rules.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param rules the "g" policy rule.
   * @return succeeds or not.
   */
  addNamedGroupingPolicies(ptype: string, rules: string[][]): Promise<boolean> {
    return authzAPI.addNamedGroupingPolicies(this.enforcer, ptype, rules);
  }
  /**
   * removeGroupingPolicy removes a role inheritance rule from the current policy.
   *
   * @param params the "g" policy rule, ptype "g" is implicitly used.
   * @return succeeds or not.
   */
  removeGroupingPolicy(...params: string[]): Promise<boolean> {
    return authzAPI.removeGroupingPolicy(this.enforcer, ...params);
  }
  /**
   * removeGroupingPolicies removes role inheritance rules from the current policy.
   *
   * @param rules the "g" policy rules, ptype "g" is implicitly used.
   * @return succeeds or not.
   */
  removeGroupingPolicies(rules: string[][]): Promise<boolean> {
    return authzAPI.removeGroupingPolicies(this.enforcer, rules);
  }
  /**
   * removeFilteredGroupingPolicy removes a role inheritance rule from the current policy, field filters can be specified.
   *
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return succeeds or not.
   */
  removeFilteredGroupingPolicy(
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<boolean> {
    return authzAPI.removeFilteredGroupingPolicy(
      this.enforcer,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * removeNamedGroupingPolicy removes a role inheritance rule from the current named policy.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param params the "g" policy rule.
   * @return succeeds or not.
   */
  removeNamedGroupingPolicy(
    ptype: string,
    ...params: string[]
  ): Promise<boolean> {
    return authzAPI.removeNamedGroupingPolicy(this.enforcer, ptype, ...params);
  }
  /**
   * removeNamedGroupingPolicies removes role inheritance rules from the current named policy.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param rules the "g" policy rules.
   * @return succeeds or not.
   */
  removeNamedGroupingPolicies(
    ptype: string,
    rules: string[][],
  ): Promise<boolean> {
    return authzAPI.removeNamedGroupingPolicies(this.enforcer, ptype, rules);
  }
  /**
   * removeFilteredNamedGroupingPolicy removes a role inheritance rule from the current named policy, field filters can be specified.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param fieldIndex the policy rule's start index to be matched.
   * @param fieldValues the field values to be matched, value ""
   *                    means not to match this field.
   * @return succeeds or not.
   */
  removeFilteredNamedGroupingPolicy(
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<boolean> {
    return authzAPI.removeFilteredNamedGroupingPolicy(
      this.enforcer,
      ptype,
      fieldIndex,
      ...fieldValues,
    );
  }
  /**
   * addFunction adds a customized function.
   * @param name custom function name
   * @param func function
   */
  addFunction(name: string, func: any): Promise<void> {
    return authzAPI.addFunction(this.enforcer, name, func);
  }

  /**
   * loadPolicy reloads the policy from file/database.
   */
  loadPolicy(): Promise<void> {
    return authzAPI.loadPolicy(this.enforcer);
  }

  /**
   * updateGroupingPolicy updates a role inheritance rule from the current policy.
   * If the rule not exists, the function returns false.
   * Otherwise the function returns true by changing it to the new rule.
   *
   * @param oldRule the role inheritance rule will be remove
   * @param newRule the role inheritance rule will be added
   * @return succeeds or not.
   */
  updateGroupingPolicy(oldRule: string[], newRule: string[]): Promise<boolean> {
    return authzAPI.updateGroupingPolicy(this.enforcer, oldRule, newRule);
  }

  /**
   * updateNamedGroupingPolicy updates a named role inheritance rule from the current policy.
   * If the rule not exists, the function returns false.
   * Otherwise the function returns true by changing it to the new rule.
   *
   * @param ptype the policy type, can be "g", "g2", "g3", ..
   * @param oldRule the role inheritance rule will be remove
   * @param newRule the role inheritance rule will be added
   * @return succeeds or not.
   */
  updateNamedGroupingPolicy(
    ptype: string,
    oldRule: string[],
    newRule: string[],
  ): Promise<boolean> {
    return authzAPI.updateNamedGroupingPolicy(
      this.enforcer,
      ptype,
      oldRule,
      newRule,
    );
  }
}
