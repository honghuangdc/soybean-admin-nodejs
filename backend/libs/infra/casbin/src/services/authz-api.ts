import * as casbin from 'casbin';

export function getRolesForUser(
  enforcer: casbin.Enforcer,
  name: string,
  domain?: string,
): Promise<string[]> {
  return enforcer.getRolesForUser(name, domain);
}

export function getUsersForRole(
  enforcer: casbin.Enforcer,
  name: string,
  domain?: string,
): Promise<string[]> {
  return enforcer.getUsersForRole(name, domain);
}

export function hasRoleForUser(
  enforcer: casbin.Enforcer,
  name: string,
  role: string,
  domain?: string,
): Promise<boolean> {
  return enforcer.hasRoleForUser(name, role, domain);
}

export function addRoleForUser(
  enforcer: casbin.Enforcer,
  user: string,
  role: string,
  domain?: string,
): Promise<boolean> {
  return enforcer.addRoleForUser(user, role, domain);
}

export function deleteRoleForUser(
  enforcer: casbin.Enforcer,
  user: string,
  role: string,
  domain?: string,
): Promise<boolean> {
  return enforcer.deleteRoleForUser(user, role, domain);
}

export function deleteRolesForUser(
  enforcer: casbin.Enforcer,
  user: string,
  domain?: string,
): Promise<boolean> {
  return enforcer.deleteRolesForUser(user, domain);
}

export function deleteUser(
  enforcer: casbin.Enforcer,
  user: string,
): Promise<boolean> {
  return enforcer.deleteUser(user);
}

export function deleteRole(
  enforcer: casbin.Enforcer,
  role: string,
): Promise<boolean> {
  return enforcer.deleteRole(role);
}

export function deletePermission(
  enforcer: casbin.Enforcer,
  ...permission: string[]
): Promise<boolean> {
  return enforcer.deletePermission(...permission);
}

export function addPermissionForUser(
  enforcer: casbin.Enforcer,
  userOrRole: string,
  ...permission: string[]
): Promise<boolean> {
  return enforcer.addPermissionForUser(userOrRole, ...permission);
}

export function deletePermissionForUser(
  enforcer: casbin.Enforcer,
  userOrRole: string,
  ...permission: string[]
): Promise<boolean> {
  return enforcer.deletePermissionForUser(userOrRole, ...permission);
}

export function deletePermissionsForUser(
  enforcer: casbin.Enforcer,
  userOrRole: string,
): Promise<boolean> {
  return enforcer.deletePermissionsForUser(userOrRole);
}

export function getPermissionsForUser(
  enforcer: casbin.Enforcer,
  userOrRole: string,
): Promise<string[][]> {
  return enforcer.getPermissionsForUser(userOrRole);
}

export function hasPermissionForUser(
  enforcer: casbin.Enforcer,
  user: string,
  ...permission: string[]
): Promise<boolean> {
  return enforcer.hasPermissionForUser(user, ...permission);
}

export function getImplicitRolesForUser(
  enforcer: casbin.Enforcer,
  name: string,
  ...domain: string[]
): Promise<string[]> {
  return enforcer.getImplicitRolesForUser(name, ...domain);
}

export function getImplicitResourcesForUser(
  enforcer: casbin.Enforcer,
  name: string,
  ...domain: string[]
): Promise<string[][]> {
  return enforcer.getImplicitResourcesForUser(name, ...domain);
}

export function getImplicitPermissionsForUser(
  enforcer: casbin.Enforcer,
  user: string,
  ...domain: string[]
): Promise<string[][]> {
  return enforcer.getImplicitPermissionsForUser(user, ...domain);
}

export function getImplicitUsersForPermission(
  enforcer: casbin.Enforcer,
  ...permission: string[]
): Promise<string[]> {
  return enforcer.getImplicitUsersForPermission(...permission);
}

/**
 * Management API
 */

export function enforce(
  enforcer: casbin.Enforcer,
  ...params: any[]
): Promise<boolean> {
  return enforcer.enforce(params);
}

export function enforceWithMatcher(
  enforcer: casbin.Enforcer,
  matcher: string,
  ...params: any[]
): Promise<boolean> {
  return enforcer.enforceWithMatcher(matcher, params);
}

export function enforceEx(
  enforcer: casbin.Enforcer,
  ...params: any[]
): Promise<[boolean, string[]]> {
  return enforcer.enforceEx(params);
}

export function enforceExWithMatcher(
  enforcer: casbin.Enforcer,
  matcher: string,
  ...params: any[]
): Promise<[boolean, string[]]> {
  return enforcer.enforceExWithMatcher(matcher, params);
}

export function batchEnforce(
  enforcer: casbin.Enforcer,
  params: any[][],
): Promise<boolean[]> {
  return enforcer.batchEnforce(params);
}

export function getAllSubjects(enforcer: casbin.Enforcer): Promise<string[]> {
  return enforcer.getAllSubjects();
}

export function getAllNamedSubjects(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[]> {
  return enforcer.getAllNamedSubjects(ptype);
}

export function getAllObjects(enforcer: casbin.Enforcer): Promise<string[]> {
  return enforcer.getAllObjects();
}

export function getAllNamedObjects(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[]> {
  return enforcer.getAllNamedObjects(ptype);
}

export function getAllActions(enforcer: casbin.Enforcer): Promise<string[]> {
  return enforcer.getAllActions();
}

export function getAllNamedActions(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[]> {
  return enforcer.getAllNamedActions(ptype);
}

export function getAllRoles(enforcer: casbin.Enforcer): Promise<string[]> {
  return enforcer.getAllRoles();
}

export function getAllNamedRoles(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[]> {
  return enforcer.getAllNamedRoles(ptype);
}

export function getPolicy(enforcer: casbin.Enforcer): Promise<string[][]> {
  return enforcer.getPolicy();
}

export function getFilteredPolicy(
  enforcer: casbin.Enforcer,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<string[][]> {
  return enforcer.getFilteredPolicy(fieldIndex, ...fieldValues);
}

export function getNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[][]> {
  return enforcer.getNamedPolicy(ptype);
}

export function getFilteredNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<string[][]> {
  return enforcer.getFilteredNamedPolicy(ptype, fieldIndex, ...fieldValues);
}

export function getGroupingPolicy(
  enforcer: casbin.Enforcer,
): Promise<string[][]> {
  return enforcer.getGroupingPolicy();
}

export function getFilteredGroupingPolicy(
  enforcer: casbin.Enforcer,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<string[][]> {
  return enforcer.getFilteredGroupingPolicy(fieldIndex, ...fieldValues);
}

export function getNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
): Promise<string[][]> {
  return enforcer.getNamedGroupingPolicy(ptype);
}

export function getFilteredNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<string[][]> {
  return enforcer.getFilteredNamedGroupingPolicy(
    ptype,
    fieldIndex,
    ...fieldValues,
  );
}

export function hasPolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.hasPolicy(...params);
}

export function hasNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.hasNamedPolicy(ptype, ...params);
}

export function addPolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.addPolicy(...params);
}

export function addPolicies(
  enforcer: casbin.Enforcer,
  rules: string[][],
): Promise<boolean> {
  return enforcer.addPolicies(rules);
}

export function addNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.addNamedPolicy(ptype, ...params);
}

export function addNamedPolicies(
  enforcer: casbin.Enforcer,
  ptype: string,
  rules: string[][],
): Promise<boolean> {
  return enforcer.addNamedPolicies(ptype, rules);
}

export function updatePolicy(
  enforcer: casbin.Enforcer,
  oldRule: string[],
  newRule: string[],
): Promise<boolean> {
  return enforcer.updatePolicy(oldRule, newRule);
}

export function updateNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  oldRule: string[],
  newRule: string[],
): Promise<boolean> {
  return enforcer.updateNamedPolicy(ptype, oldRule, newRule);
}

export function removePolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.removePolicy(...params);
}

export function removePolicies(
  enforcer: casbin.Enforcer,
  rules: string[][],
): Promise<boolean> {
  return enforcer.removePolicies(rules);
}

export function removeFilteredPolicy(
  enforcer: casbin.Enforcer,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<boolean> {
  return enforcer.removeFilteredPolicy(fieldIndex, ...fieldValues);
}

export function removeNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.removeNamedPolicy(ptype, ...params);
}

export function removeNamedPolicies(
  enforcer: casbin.Enforcer,
  ptype: string,
  rules: string[][],
): Promise<boolean> {
  return enforcer.removeNamedPolicies(ptype, rules);
}

export function removeFilteredNamedPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<boolean> {
  return enforcer.removeFilteredNamedPolicy(ptype, fieldIndex, ...fieldValues);
}

export function hasGroupingPolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.hasGroupingPolicy(...params);
}

export function hasNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.hasNamedGroupingPolicy(ptype, ...params);
}
export function addGroupingPolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.addGroupingPolicy(...params);
}
export function addGroupingPolicies(
  enforcer: casbin.Enforcer,
  rules: string[][],
): Promise<boolean> {
  return enforcer.addGroupingPolicies(rules);
}
export function addNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.addNamedGroupingPolicy(ptype, ...params);
}
export function addNamedGroupingPolicies(
  enforcer: casbin.Enforcer,
  ptype: string,
  rules: string[][],
): Promise<boolean> {
  return enforcer.addNamedGroupingPolicies(ptype, rules);
}
export function removeGroupingPolicy(
  enforcer: casbin.Enforcer,
  ...params: string[]
): Promise<boolean> {
  return enforcer.removeGroupingPolicy(...params);
}
export function removeGroupingPolicies(
  enforcer: casbin.Enforcer,
  rules: string[][],
): Promise<boolean> {
  return enforcer.removeGroupingPolicies(rules);
}
export function removeFilteredGroupingPolicy(
  enforcer: casbin.Enforcer,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<boolean> {
  return enforcer.removeFilteredGroupingPolicy(fieldIndex, ...fieldValues);
}
export function removeNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  ...params: string[]
): Promise<boolean> {
  return enforcer.removeNamedGroupingPolicy(ptype, ...params);
}
export function removeNamedGroupingPolicies(
  enforcer: casbin.Enforcer,
  ptype: string,
  rules: string[][],
): Promise<boolean> {
  return enforcer.removeNamedGroupingPolicies(ptype, rules);
}
export function removeFilteredNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  fieldIndex: number,
  ...fieldValues: string[]
): Promise<boolean> {
  return enforcer.removeFilteredNamedGroupingPolicy(
    ptype,
    fieldIndex,
    ...fieldValues,
  );
}
export function addFunction(
  enforcer: casbin.Enforcer,
  name: string,
  func: any,
): Promise<void> {
  return enforcer.addFunction(name, func);
}

export function loadPolicy(enforcer: casbin.Enforcer): Promise<void> {
  return enforcer.loadPolicy();
}

export function updateGroupingPolicy(
  enforcer: casbin.Enforcer,
  oldRule: string[],
  newRule: string[],
): Promise<boolean> {
  return enforcer.updateGroupingPolicy(oldRule, newRule);
}

export function updateNamedGroupingPolicy(
  enforcer: casbin.Enforcer,
  ptype: string,
  oldRule: string[],
  newRule: string[],
): Promise<boolean> {
  return enforcer.updateNamedGroupingPolicy(ptype, oldRule, newRule);
}
