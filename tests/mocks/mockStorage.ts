const memoryStore = new Map<string, string>();

export const mockAsyncStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStore.set(key, value);
  },
  getItem: async (key: string): Promise<string | null> => {
    return memoryStore.get(key) || null;
  },
  removeItem: async (key: string): Promise<void> => {
    memoryStore.delete(key);
  },
  clear: async (): Promise<void> => {
    memoryStore.clear();
  },
};

export default mockAsyncStorage;
