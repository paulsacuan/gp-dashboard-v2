import jwtDecode from 'jwt-decode';
import { removeLocalStorage, getLocalStorage } from './tokenStorage';

interface Token {
  exp: number;
  roles: any;
}

export const Auth = {
  isLogged() {
    const storedToken = getLocalStorage() && getLocalStorage().token;
    if (storedToken) {
      const token: Token = jwtDecode(storedToken);
      if (typeof token === 'object' && token !== null) {
        if (token.exp < Date.now() / 1000) {
          removeLocalStorage();
          return false;
        }
      }
      return true;
    }
    return false;
  },
  role() {
    const storedToken = getLocalStorage() && getLocalStorage().token;
    if (storedToken) {
      const token: Token = jwtDecode(storedToken);
      return token.roles[0];
    }
    return null;
  },
  user() {
    const storedToken = getLocalStorage() && getLocalStorage().token;
    if (storedToken) {
      const token: Token = jwtDecode(storedToken);
      return token;
    }
    return null;
  },
  token() {
    return getLocalStorage() && getLocalStorage().token;
  },
};
