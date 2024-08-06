import { Domain } from '../domain/domain.model';

export interface DomainWriteRepoPort {
  delete(domain: Domain): Promise<void>;

  save(domain: Domain): Promise<void>;

  update(domain: Domain): Promise<void>;
}
