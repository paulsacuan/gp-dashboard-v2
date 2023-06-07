import axios from 'axios';
import { Auth } from './auth';

const apiClient = axios.create({
  // baseURL: 'https://apiv2.goparts.ph/v2',
  baseURL: 'http://[::1]:8080/v2',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Auth.token()}`,
  },
});

export const config = {
  apiClient,
};
