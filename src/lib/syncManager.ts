/**
 * Offline-First Synchronization Engine
 * Source of Truth: PRD Section 6 & 02_Architecture_Flow_AI_Logic_REFINED.md (Section 2.2)
 * 
 * Manages:
 * - Local-first offline queue
 * - Idempotency key tracking
 * - Background reconnect detection
 * - Batch upload to /api/sync/batch
 */

import { SyncPayloadItem } from '../../shared/types.js';

const SYNC_QUEUE_KEY = 'greencoach_offline_sync_queue';
const OFFLINE_DIAGNOSES_KEY = 'greencoach_local_diagnoses';
const OFFLINE_TREATMENTS_KEY = 'greencoach_local_treatments';
const OFFLINE_HEALTH_KEY = 'greencoach_local_health';

export class SyncManager {
  private isOnlineState: boolean = true;
  private listeners: ((isOnline: boolean, pendingCount: number) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnlineState = navigator.onLine;
      window.addEventListener('online', () => this.handleConnectivityChange(true));
      window.addEventListener('offline', () => this.handleConnectivityChange(false));
    }
  }

  isOnline(): boolean {
    return this.isOnlineState;
  }

  setSimulatedOffline(offline: boolean): void {
    this.isOnlineState = !offline;
    this.notify();
    if (this.isOnlineState) {
      this.flushQueue();
    }
  }

  private handleConnectivityChange(online: boolean): void {
    this.isOnlineState = online;
    this.notify();
    if (online) {
      this.flushQueue();
    }
  }

  subscribe(listener: (isOnline: boolean, pendingCount: number) => void): () => void {
    this.listeners.push(listener);
    listener(this.isOnlineState, this.getPendingCount());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    const count = this.getPendingCount();
    this.listeners.forEach(l => l(this.isOnlineState, count));
  }

  getQueue(): SyncPayloadItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getPendingCount(): number {
    return this.getQueue().length;
  }

  enqueue(entityType: SyncPayloadItem['entity_type'], data: any): string {
    const idempotencyKey = `idem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const item: SyncPayloadItem = {
      idempotency_key: idempotencyKey,
      entity_type: entityType,
      data,
      created_at_local: new Date().toISOString()
    };

    const queue = this.getQueue();
    queue.push(item);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));

    // Save locally
    if (entityType === 'diagnosis') {
      const list = this.getLocalDiagnoses();
      list.unshift(data);
      localStorage.setItem(OFFLINE_DIAGNOSES_KEY, JSON.stringify(list));
    } else if (entityType === 'treatment') {
      const list = this.getLocalTreatments();
      list.unshift(data);
      localStorage.setItem(OFFLINE_TREATMENTS_KEY, JSON.stringify(list));
    } else if (entityType === 'health_metric') {
      const list = this.getLocalHealthLogs();
      list.unshift(data);
      localStorage.setItem(OFFLINE_HEALTH_KEY, JSON.stringify(list));
    }

    this.notify();

    // If online, immediately attempt sync
    if (this.isOnlineState) {
      this.flushQueue();
    }

    return idempotencyKey;
  }

  getLocalDiagnoses(): any[] {
    try {
      const raw = localStorage.getItem(OFFLINE_DIAGNOSES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getLocalTreatments(): any[] {
    try {
      const raw = localStorage.getItem(OFFLINE_TREATMENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getLocalHealthLogs(): any[] {
    try {
      const raw = localStorage.getItem(OFFLINE_HEALTH_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async flushQueue(): Promise<{ synced: number; remaining: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, remaining: 0 };

    try {
      const res = await fetch('/api/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: queue })
      });

      if (!res.ok) throw new Error('Sync batch request failed');

      const data = await res.json();
      const syncedKeys = new Set((data.results || []).filter((r: any) => r.success).map((r: any) => r.idempotency_key));

      const remaining = queue.filter(item => !syncedKeys.has(item.idempotency_key));
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));

      this.notify();
      return { synced: syncedKeys.size, remaining: remaining.length };
    } catch (err) {
      console.warn('Sync flush deferred (offline or server error):', err);
      return { synced: 0, remaining: queue.length };
    }
  }
}

export const syncManager = new SyncManager();
