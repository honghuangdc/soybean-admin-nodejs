import { AuthActionVerb } from '../casbin';

export interface Permission {
  resource: string;
  action: AuthActionVerb | string;
}
