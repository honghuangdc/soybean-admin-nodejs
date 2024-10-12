import * as bcrypt from 'bcryptjs';

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static async hash(password: string): Promise<Password> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return new Password(hashedPassword);
  }

  static fromHashed(password: string): Password {
    return new Password(password);
  }

  async compare(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.value);
  }

  getValue(): string {
    return this.value;
  }
}
