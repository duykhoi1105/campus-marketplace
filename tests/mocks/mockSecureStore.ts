const secureMap = new Map<string, string>();

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  secureMap.set(key, value);
};

export const getItemAsync = async (key: string): Promise<string | null> => {
  return secureMap.get(key) || null;
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  secureMap.delete(key);
};

