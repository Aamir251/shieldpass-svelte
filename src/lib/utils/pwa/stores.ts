import { writable, derived, readable } from 'svelte/store';
import { pwaManager, type PWAState, type PWAEvent } from './pwa';

/**
 * Svelte stores for PWA state management
 */

// Create writable stores
export const isOnline = writable<boolean>(pwaManager.isOnline());
export const isInstallable = writable<boolean>(pwaManager.isInstallable());
export const isInstalled = writable<boolean>(pwaManager.isInstalled());
export const isServiceWorkerActive = writable<boolean>(pwaManager.isServiceWorkerActive());
export const updateAvailable = writable<boolean>(false);

// Create a store for PWA state
export const pwaState = derived(
  [isOnline, isInstallable, isInstalled, isServiceWorkerActive, updateAvailable],
  ([$isOnline, $isInstallable, $isInstalled, $isSwActive, $updateAvailable]) => ({
    isOnline: $isOnline,
    isInstallable: $isInstallable,
    isInstalled: $isInstalled,
    swActive: $isSwActive,
    updateAvailable: $updateAvailable,
  })
);

// Create a readable store for PWA events
export const pwaEvents = readable<PWAEvent | null>(null, (set) => {
  const unsubscribe = pwaManager.subscribe((event) => {
    set(event);

    // Update individual stores based on event
    switch (event.type) {
      case 'online':
        isOnline.set(true);
        break;
      case 'offline':
        isOnline.set(false);
        break;
      case 'install-prompt':
        isInstallable.set(true);
        break;
      case 'app-installed':
        isInstalled.set(true);
        isInstallable.set(false);
        break;
      case 'sw-activated':
        isServiceWorkerActive.set(true);
        break;
      case 'sw-updated':
        updateAvailable.set(true);
        break;
    }
  });

  return unsubscribe;
});

// Derived store for checking if app can be installed
export const canInstall = derived(
  [isInstallable, isInstalled],
  ([$isInstallable, $isInstalled]) => $isInstallable && !$isInstalled
);

// Derived store for app status
export const appStatus = derived(
  [isOnline, isInstalled, isServiceWorkerActive],
  ([$isOnline, $isInstalled, $isSwActive]) => {
    if ($isInstalled) {
      return 'installed';
    }
    if ($isSwActive) {
      return 'web';
    }
    return 'browser';
  }
);

// Derived store for connection status
export const connectionStatus = derived(
  isOnline,
  ($isOnline) => ($isOnline ? 'online' : 'offline')
);

/**
 * Actions for PWA operations
 */

export async function installApp(): Promise<boolean> {
  const result = await pwaManager.showInstallPrompt();
  return result?.outcome === 'accepted' ?? false;
}

export async function checkForUpdates(): Promise<boolean> {
  return await pwaManager.checkForUpdates();
}

export async function skipWaiting(): Promise<void> {
  await pwaManager.skipWaiting();
}

export async function clearAllCaches(): Promise<void> {
  await pwaManager.clearCaches();
}

export async function registerSW(scriptUrl?: string): Promise<ServiceWorkerRegistration | null> {
  return await pwaManager.registerServiceWorker(scriptUrl);
}

export async function unregisterSW(): Promise<boolean> {
  return await pwaManager.unregisterServiceWorker();
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  return await pwaManager.requestNotificationPermission();
}

export async function sendNotification(title: string, options?: NotificationOptions): Promise<void> {
  await pwaManager.sendNotification(title, options);
}

export function canShare(): boolean {
  return pwaManager.canShare();
}

export async function shareContent(data: ShareData): Promise<void> {
  await pwaManager.share(data);
}

export async function requestPersistentStorage(): Promise<boolean> {
  return await pwaManager.requestPersistentStorage();
}

export async function getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
  return await pwaManager.getStorageEstimate();
}
