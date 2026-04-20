// PWA Utilities Module
// Provides easy access to PWA features like service worker management, install prompts, and offline detection

export interface PWAState {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  swActive: boolean;
  updateAvailable: boolean;
}

export interface PWAEvent {
  type: 'online' | 'offline' | 'install-prompt' | 'app-installed' | 'sw-updated' | 'sw-activated';
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface InstallPromptOutcome {
  outcome: 'accepted' | 'dismissed';
}

class PWAManager {
  private state: PWAState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isInstallable: false,
    isInstalled: false,
    swActive: false,
    updateAvailable: false,
  };

  private listeners: Set<(event: PWAEvent) => void> = new Set();
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    // Online/Offline listeners
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Service Worker controller changed
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('controller', () => {
        this.state.swActive = true;
        this.emit({
          type: 'sw-activated',
          timestamp: new Date(),
        });
      });

      // Check if already controlling
      if (navigator.serviceWorker.controller) {
        this.state.swActive = true;
      }
    }

    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.state.isInstallable = true;
      this.emit({
        type: 'install-prompt',
        timestamp: new Date(),
      });
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.state.isInstalled = true;
      this.state.isInstallable = false;
      this.deferredPrompt = null;
      this.emit({
        type: 'app-installed',
        timestamp: new Date(),
      });
    });
  }

  private handleOnline(): void {
    this.state.isOnline = true;
    this.emit({
      type: 'online',
      timestamp: new Date(),
    });
  }

  private handleOffline(): void {
    this.state.isOnline = false;
    this.emit({
      type: 'offline',
      timestamp: new Date(),
    });
  }

  private emit(event: PWAEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  // Public API

  /**
   * Get current PWA state
   */
  getState(): Readonly<PWAState> {
    return Object.freeze({ ...this.state });
  }

  /**
   * Check if app is online
   */
  isOnline(): boolean {
    return this.state.isOnline;
  }

  /**
   * Check if app is installable
   */
  isInstallable(): boolean {
    return this.state.isInstallable;
  }

  /**
   * Check if app is installed
   */
  isInstalled(): boolean {
    return this.state.isInstalled;
  }

  /**
   * Check if service worker is active
   */
  isServiceWorkerActive(): boolean {
    return this.state.swActive;
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<InstallPromptOutcome | null> {
    if (!this.deferredPrompt) {
      console.warn('Install prompt not available');
      return null;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.state.isInstallable = false;

    return { outcome: outcome as 'accepted' | 'dismissed' };
  }

  /**
   * Register service worker manually
   */
  async registerServiceWorker(scriptUrl: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported in this browser');
      return null;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register(scriptUrl, {
        scope: '/',
      });
      this.state.swActive = !!navigator.serviceWorker.controller;
      console.log('✓ Service Worker registered:', this.swRegistration);
      return this.swRegistration;
    } catch (error) {
      console.error('✗ Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Unregister service worker
   */
  async unregisterServiceWorker(): Promise<boolean> {
    if (!this.swRegistration) {
      console.warn('No service worker registered');
      return false;
    }

    try {
      const success = await this.swRegistration.unregister();
      if (success) {
        this.swRegistration = null;
        this.state.swActive = false;
        console.log('✓ Service Worker unregistered');
      }
      return success;
    } catch (error) {
      console.error('✗ Service Worker unregistration failed:', error);
      return false;
    }
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.swRegistration) {
      this.swRegistration = await this.registerServiceWorker();
    }

    if (!this.swRegistration) {
      return false;
    }

    try {
      await this.swRegistration.update();

      if (this.swRegistration.waiting) {
        this.state.updateAvailable = true;
        this.emit({
          type: 'sw-updated',
          timestamp: new Date(),
          details: { updateAvailable: true },
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('✗ Error checking for updates:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('✓ All caches cleared');
    } catch (error) {
      console.error('✗ Error clearing caches:', error);
    }
  }

  /**
   * Subscribe to PWA events
   */
  subscribe(listener: (event: PWAEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Request notification permission
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Send notification
   */
  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Notifications or service workers not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        return;
      }
    }

    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      icon: '/images/icon-192.png',
      badge: '/images/icon-192.png',
      ...options,
    });
  }

  /**
   * Share content via Web Share API
   */
  async share(data: ShareData): Promise<void> {
    if (!navigator.share) {
      console.warn('Web Share API not supported');
      throw new Error('Web Share API not supported');
    }

    try {
      await navigator.share(data);
    } catch (error) {
      console.error('✗ Error sharing:', error);
      throw error;
    }
  }

  /**
   * Check if Web Share API is available
   */
  canShare(): boolean {
    return !!navigator.share;
  }

  /**
   * Request persistent storage
   */
  async requestPersistentStorage(): Promise<boolean> {
    if (!navigator.storage || !navigator.storage.persist) {
      console.warn('Persistent storage API not supported');
      return false;
    }

    try {
      const persisted = await navigator.storage.persist();
      console.log(persisted ? '✓ Persistent storage granted' : '⚠ Persistent storage denied');
      return persisted;
    } catch (error) {
      console.error('✗ Error requesting persistent storage:', error);
      return false;
    }
  }

  /**
   * Get storage estimate
   */
  async getStorageEstimate(): Promise<{ usage: number; quota: number } | null> {
    if (!navigator.storage || !navigator.storage.estimate) {
      console.warn('Storage estimation not supported');
      return null;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    } catch (error) {
      console.error('✗ Error getting storage estimate:', error);
      return null;
    }
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Export for use in browser context
if (typeof window !== 'undefined') {
  (window as any).__pwaManager = pwaManager;
}
