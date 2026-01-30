/**
 * Component Names - Atomic UI Element IDs
 * 
 * Components are individual UI elements (buttons, inputs, etc.) that tools interact with.
 * These are flat, reusable identifiers that can appear in multiple containers.
 * 
 * Containers define WHICH components they contain (see Containers.ts).
 * ToolProviders operate within a Container namespace and act on Components.
 * 
 * Pattern: Components.ElementName = 'element-id'
 */

export const Components = {
  // Chat components
  ChatInput: 'chat-message-input',
  ChatSendButton: 'chat-send-button',
  ChatClearButton: 'chat-clear-button',
  ChatToggleButton: 'chat-bubble-toggle',
  ChatMessageList: 'chat-message-list',
  ChatTypingIndicator: 'chat-typing-indicator',
  ChatMoreMenu: 'chat-more-menu',
  ChatMoreMenuButton: 'chat-more-menu-button',

  // API Key configuration components (BYOK mode)
  ApiKeySection: 'api-key-section',
  ApiKeyInput: 'api-key-input',
  ApiKeySubmitButton: 'api-key-submit-button',
  ApiKeyClearButton: 'api-key-clear-button',
  ApiKeyConfigureButton: 'api-key-configure-button',
  ApiKeyStatus: 'api-key-status',
  ApiKeyMasked: 'api-key-masked',
  ApiKeyError: 'api-key-error',
  ApiKeyShowToggle: 'api-key-show-toggle',
  ApiKeyCancelButton: 'api-key-cancel-button',

  // Demo widget components - buttons
  OpenMenuButton: 'open-main-menu',
  CloseMenuButton: 'close-main-menu',
  
  // Demo widget components - checkboxes
  FeatureToggle: 'feature-toggle',
  NotificationsToggle: 'notification-toggle',
  
  // Demo widget components - radios
  PriorityHighRadio: 'priority-high',
  PriorityMediumRadio: 'priority-medium',
  PriorityLowRadio: 'priority-low',
  
  // Demo widget components - selects
  StatusSelect: 'status-dropdown',
  ThemeSelect: 'theme-toggle',
  
  // Demo widget components - form
  FormNameInput: 'form-name',
  DemoFormSubmitButton: 'form-submit',

  // Generic widget components
  WidgetButton: 'widget-button',
  WidgetInput: 'widget-input',
  WidgetSelect: 'widget-select',
  WidgetCheckbox: 'widget-checkbox',
  WidgetRadio: 'widget-radio',
  WidgetTextarea: 'widget-textarea',

  // Tool command components
  ToolCommandsList: 'tool-commands-list',
  ToolExecuteButton: 'tool-execute-button',
  ToolApprovalButton: 'tool-approval-button',
  ToolMetadataDisplay: 'tool-metadata-display',

  // Navigation components
  NavMainMenu: 'nav-main-menu',
  NavHomeLink: 'nav-home-link',
  NavToolsLink: 'nav-tools-link',
  NavSettingsLink: 'nav-settings-link',
  NavBackButton: 'nav-back-button',

  // Form components
  FormSubmitButton: 'form-submit-button',
  FormCancelButton: 'form-cancel-button',
  FormResetButton: 'form-reset-button',
  FormTextInput: 'form-text-input',
  FormEmailInput: 'form-email-input',
  FormPasswordInput: 'form-password-input',

  // Modal components
  ModalCloseButton: 'modal-close-button',
  ModalConfirmButton: 'modal-confirm-button',
  ModalCancelButton: 'modal-cancel-button',
  ModalOverlay: 'modal-overlay',

  // Status/Feedback components
  StatusSuccessMessage: 'status-success-message',
  StatusErrorMessage: 'status-error-message',
  StatusWarningMessage: 'status-warning-message',
  StatusLoadingSpinner: 'status-loading-spinner',
  StatusProgressBar: 'status-progress-bar',
} as const;

/**
 * Helper function to get all component IDs as a flat array
 */
export function getAllComponentIds(): string[] {
  return Object.values(Components);
}

/**
 * Helper function to validate component ID uniqueness
 */
export function validateComponentIds(): { valid: boolean; duplicates: string[] } {
  const ids = getAllComponentIds();
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  }

  return {
    valid: duplicates.length === 0,
    duplicates,
  };
}

/**
 * Type-safe component ID access
 */
export type ComponentPath = typeof Components;
export type ComponentId = (typeof Components)[keyof typeof Components];
