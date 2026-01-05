/**
 * Name Contracts - Abstract Base
 * 
 * Provides base classes and interfaces for scanning codebases
 * and generating type-safe name contracts.
 */

export { ContractScanner } from './ContractScanner';
export type { ScanResult, ContractEntry } from './ContractScanner';

// RouteContractScanner uses Node.js modules (ts-node/register) - server-only
// Not exported to prevent browser bundle issues
// Import directly if needed on server: 
// import { RouteContractScanner } from '@supernal/interface/src/name-contracts/RouteContractScanner'
// export { RouteContractScanner } from './RouteContractScanner';

