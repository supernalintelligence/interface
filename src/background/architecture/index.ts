/**
 * Architecture Module
 * 
 * Provides generic types and utilities for defining application architecture.
 * Applications should create their own component names, containers, and navigation connections.
 * 
 * This is the CORE library - it provides the infrastructure, not the content.
 */

export { 
  getContainer,
  getAllContainers,
  isComponentInContainer,
  findComponentContainers,
  type ContainerDefinition,
  type ContainerId
} from './Containers';

export {
  initializeArchitecture,
  createAutoInitializer,
  type ArchitectureConfig
} from './ArchitectureInitializer';

// Data Contract Types (NEW - Week 1)
export {
  type ComponentState,
  type StateContract,
  type ComponentContract,
  type DataContractRegistry,
  type ExtractState,
  type TypedComponentContract,
  isComponentState,
  isComponentContract,
} from './DataContractTypes';

