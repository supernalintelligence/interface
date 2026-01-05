/**
 * DataContractTypes - Enterprise Feature Stub
 * 
 * Basic types for data contracts. Full story system and validation
 * available in @supernal/interface-enterprise.
 */

export type DataContract = Record<string, unknown>;

export interface ContractValidation {
  valid: boolean;
  errors?: string[];
}

export interface ContractSchema {
  fields: Record<string, { type: string; required?: boolean }>;
}

// Story system types (stubs)
export type ComponentState = Record<string, unknown>;
export type StateContract = DataContract;
export type ComponentContract = DataContract;

export class DataContractRegistry {
  static register(id: string, contract: DataContract): void {
    // Enterprise feature - no-op
  }
  
  static get(id: string): DataContract | undefined {
    return undefined;
  }
}

// Type helpers
export type ExtractState<T> = T extends { state: infer S } ? S : unknown;
export type TypedComponentContract<T = unknown> = DataContract & { state?: T };

// Type guards
export function isComponentState(value: unknown): value is ComponentState {
  return typeof value === 'object' && value !== null;
}

export function isComponentContract(value: unknown): value is ComponentContract {
  return typeof value === 'object' && value !== null;
}
