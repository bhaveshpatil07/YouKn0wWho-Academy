import Cookies from 'js-cookie';

export const setAuthCookie = (key, value, options = {}) => {
  Cookies.set(key, value, {
    ...options,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

export const removeAuthCookie = (key, options = {}) => {
  Cookies.remove(key, {
    ...options,
    secure: process.env.NODE_ENV === 'production',
  });
};