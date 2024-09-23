import { ulid } from 'ulid';

export class UlidGenerator {
  /**
   * Generates a new ULID.
   * @returns {string} A new unique ULID.
   */
  public static generate(): string {
    return ulid();
  }
}
