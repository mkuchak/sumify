export const clearStorageKeys = (startsWith: string, currentKey: string) => {
  const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(startsWith) && key !== currentKey);

  keysToRemove.forEach((key) => localStorage.removeItem(key));
};
