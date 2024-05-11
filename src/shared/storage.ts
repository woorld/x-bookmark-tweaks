import { storageKeys } from '../constants';

type keys = keyof typeof storageKeys;

export const getStorageValue = async (key: keys): Promise<any> => {
  return (await chrome.storage.sync.get(key))[key];
};

export const setStorageValue = async (key: keys, value: any): Promise<void> => {
  await chrome.storage.sync.set({ [key]: value });
};

export const removeStorageValue = async (key: keys): Promise<void> => {
  await chrome.storage.sync.remove(key);
};
