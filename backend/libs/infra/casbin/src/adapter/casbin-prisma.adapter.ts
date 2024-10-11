import type { CasbinRule } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import type { Adapter, Model } from 'casbin';
import { Helper } from 'casbin';

export class PrismaAdapter implements Adapter {
  filtered = false;
  #option?: Prisma.PrismaClientOptions;
  #prisma: PrismaClient;

  /**
   * @param option It should be PrismaClientOptions or PrismaClient.
   * You should later call open() to activate it.
   */
  constructor(option?: Prisma.PrismaClientOptions | PrismaClient) {
    if (option instanceof PrismaClient) {
      this.#prisma = option;
    } else {
      this.#option = option;
    }
  }

  static async newAdapter(
    option?: Prisma.PrismaClientOptions | PrismaClient,
  ): Promise<PrismaAdapter> {
    const a = new PrismaAdapter(option);
    await a.#open();

    return a;
  }

  public isFiltered(): boolean {
    return this.filtered;
  }

  public enableFiltered(enabled: boolean): void {
    this.filtered = enabled;
  }

  async loadPolicy(model: Model): Promise<void> {
    const lines = await this.#prisma.casbinRule.findMany();

    for (const line of lines) {
      this.#loadPolicyLine(line, model);
    }
  }

  /**
   * loadFilteredPolicy loads policy rules that match the filter from the storage;
   * use an empty string for selecting all values in a certain field.
   */
  async loadFilteredPolicy(
    model: Model,
    filter: { [key: string]: string[][] },
  ): Promise<void> {
    const whereFilter = Object.keys(filter)
      .map((ptype) => {
        const policyPatterns = filter[ptype];
        return policyPatterns.map((policyPattern) => {
          return {
            ptype,
            ...(policyPattern[0] && { v0: policyPattern[0] }),
            ...(policyPattern[1] && { v1: policyPattern[1] }),
            ...(policyPattern[2] && { v2: policyPattern[2] }),
            ...(policyPattern[3] && { v3: policyPattern[3] }),
            ...(policyPattern[4] && { v4: policyPattern[4] }),
            ...(policyPattern[5] && { v5: policyPattern[5] }),
          };
        });
      })
      .flat();
    const lines = await this.#prisma.casbinRule.findMany({
      where: {
        OR: whereFilter,
      },
    });
    lines.forEach((line) => this.#loadPolicyLine(line, model));
    this.enableFiltered(true);
  }

  async savePolicy(model: Model): Promise<boolean> {
    await this.#prisma.$executeRaw`DELETE FROM casbin_rule;`;

    const processes: Array<Promise<CasbinRule>> = [];

    const savePolicyType = (ptype: string): void => {
      const astMap = model.model.get(ptype);
      if (astMap) {
        for (const [ptype, ast] of astMap) {
          for (const rule of ast.policy) {
            const line = this.#savePolicyLine(ptype, rule);
            const p = this.#prisma.casbinRule.create({ data: line });
            processes.push(p);
          }
        }
      }
    };

    savePolicyType('p');
    savePolicyType('g');

    // https://github.com/prisma/prisma-client-js/issues/332
    await Promise.all(processes);

    return true;
  }

  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    const line = this.#savePolicyLine(ptype, rule);
    await this.#prisma.casbinRule.create({ data: line });
  }

  async addPolicies(
    sec: string,
    ptype: string,
    rules: string[][],
  ): Promise<void> {
    const processes: Array<Promise<CasbinRule>> = [];
    for (const rule of rules) {
      const line = this.#savePolicyLine(ptype, rule);
      const p = this.#prisma.casbinRule.create({ data: line });
      processes.push(p);
    }

    // https://github.com/prisma/prisma-client-js/issues/332
    await Promise.all(processes);
  }

  async removePolicy(
    sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {
    const line = this.#savePolicyLine(ptype, rule);
    await this.#prisma.casbinRule.deleteMany({ where: line });
  }

  async removePolicies(
    sec: string,
    ptype: string,
    rules: string[][],
  ): Promise<void> {
    const processes: Array<Promise<Prisma.BatchPayload>> = [];
    for (const rule of rules) {
      const line = this.#savePolicyLine(ptype, rule);
      const p = this.#prisma.casbinRule.deleteMany({ where: line });
      processes.push(p);
    }

    // https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/transactions#bulk-operations
    await Promise.all(processes);
  }

  async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const line: Prisma.CasbinRuleCreateInput = { ptype };

    const idx = fieldIndex + fieldValues.length;
    if (fieldIndex <= 0 && 0 < idx) {
      line.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && 1 < idx) {
      line.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && 2 < idx) {
      line.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && 3 < idx) {
      line.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && 4 < idx) {
      line.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && 5 < idx) {
      line.v5 = fieldValues[5 - fieldIndex];
    }

    await this.#prisma.casbinRule.deleteMany({ where: line });
  }

  async close(): Promise<any> {
    return this.#prisma.$disconnect();
  }

  readonly #open = async (): Promise<void> => {
    if (!this.#option) {
      this.#option = {};
    }
    if (!this.#prisma) {
      this.#prisma = new PrismaClient(this.#option);
    }
    await this.#prisma.$connect();
  };

  readonly #loadPolicyLine = (
    line: Prisma.CasbinRuleCreateInput,
    model: Model,
  ): void => {
    const result =
      line.ptype +
      ', ' +
      [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]
        .filter((n) => n)
        .join(', ');
    Helper.loadPolicyLine(result, model);
  };

  readonly #savePolicyLine = (
    ptype: string,
    rule: string[],
  ): Prisma.CasbinRuleCreateInput => {
    const line: Prisma.CasbinRuleCreateInput = { ptype };

    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }

    return line;
  };
}
