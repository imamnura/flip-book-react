/**
 * IndexedDB wrapper for caching document pages
 */

const DB_NAME = "FlipbookCache";
const DB_VERSION = 1;
const STORE_NAME = "pages";

interface CachedPage {
  id: string;
  content: string;
  timestamp: number;
  pageNumber: number;
}

class PageCacheDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });
          objectStore.createIndex("pageNumber", "pageNumber", {
            unique: false,
          });
          objectStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  async setPage(page: CachedPage): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(page);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPage(id: string): Promise<CachedPage | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPages(): Promise<CachedPage[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deletePage(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSize(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const pageCacheDB = new PageCacheDB();

// Hook untuk menggunakan cache
export const usePageCache = () => {
  const cachePage = async (id: string, content: string, pageNumber: number) => {
    try {
      await pageCacheDB.setPage({
        id,
        content,
        pageNumber,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to cache page:", error);
    }
  };

  const getCachedPage = async (id: string): Promise<string | null> => {
    try {
      const cached = await pageCacheDB.getPage(id);
      return cached?.content || null;
    } catch (error) {
      console.error("Failed to get cached page:", error);
      return null;
    }
  };

  const clearCache = async () => {
    try {
      await pageCacheDB.clear();
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  const getCacheSize = async (): Promise<number> => {
    try {
      return await pageCacheDB.getSize();
    } catch (error) {
      console.error("Failed to get cache size:", error);
      return 0;
    }
  };

  return {
    cachePage,
    getCachedPage,
    clearCache,
    getCacheSize,
  };
};
