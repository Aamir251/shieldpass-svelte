// Re-export all PWA utilities for convenience
export { pwaManager } from './pwa';
export type { PWAState, PWAEvent, InstallPromptOutcome } from './pwa';

export {
  pwaState,
  isOnline,
  isInstallable,
  isInstalled,
  isServiceWorkerActive,
  updateAvailable,
  pwaEvents,
  canInstall,
  appStatus,
  connectionStatus,
  installApp,
  checkForUpdates,
  skipWaiting,
  clearAllCaches,
  registerSW,
  unregisterSW,
  requestNotificationPermission,
  sendNotification,
  canShare,
  shareContent,
  requestPersistentStorage,
  getStorageEstimate,
} from './stores';
export type { PWAState as PwaState, PWAEvent as PwaEvent } from './stores';
