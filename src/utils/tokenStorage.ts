import { throttle, merge } from 'lodash';

const LOCAL_STORAGE_KEY = 'gopartsdashboardv2';

export const getLocalStorage = throttle(() => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return null;
  }
}, 500); // lower throttling for reads

export const saveLocalStorage = throttle(state => {
  try {
    const newState = merge({}, getLocalStorage(), state);
    const serializedState = JSON.stringify(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    console.error(`Unable to save to local storage: ${err}`);
  }
}, 1000); // throttled save to ls for 1s

export const removeLocalStorage = throttle(() => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (err) {
    console.error(`Unable to clear local storage: ${err}`);
  }
}, 1000);
