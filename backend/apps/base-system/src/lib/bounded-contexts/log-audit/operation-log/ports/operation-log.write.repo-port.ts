import { OperationLog } from '../domain/operation-log.model';

export interface OperationLogWriteRepoPort {
  save(operationLog: OperationLog): Promise<void>;
}
