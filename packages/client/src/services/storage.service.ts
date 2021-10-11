class StorageService {

  getStorage(): globalThis.Storage {
    return localStorage;
  }

  getObject<T>(key: string): T | void {
    const item = localStorage.getItem(key);

    if (item) {
      return JSON.parse(item);
    }

    return;
  }

  setObject<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export type Storage = StorageService;
export const storage = new StorageService();