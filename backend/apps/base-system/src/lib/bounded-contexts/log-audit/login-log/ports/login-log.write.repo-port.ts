import { LoginLogEntity } from '../domain/login-log.entity';

export interface LoginLogWriteRepoPort {
  save(loginLog: LoginLogEntity): Promise<void>;
}
