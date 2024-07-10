import { Domain } from '../domain/domain.model';

export interface DomainWriteRepoPort {
  save(domain: Domain): Promise<void>;

  update(domain: Domain): Promise<void>;
}
