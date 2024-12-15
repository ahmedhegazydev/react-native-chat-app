import axios, {AxiosInstance, AxiosRequestConfig, AxiosError} from 'axios';
import axiosRetry from 'axios-retry';
import {Constants} from '../Constants/Constants';

const AUTH_TOKENS: Record<string, string> = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};

let currentUser: string = 'user1';

function setActiveUser(user: string): void {
  if (!AUTH_TOKENS[user]) {
    throw new Error(`No token found for user: ${user}`);
  }
  currentUser = user;
}

const chatApi: AxiosInstance = axios.create({
  baseURL: Constants.BASE_URL_Chat,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosRetry(chatApi, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

chatApi.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = AUTH_TOKENS[currentUser];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

function handleNetworkError(error: AxiosError): void {
  if (error.isAxiosError && !error.response) {
    startNetworkErrorTimer();
  } else if (error.response) {
    switch (error.response.status) {
      case 400:
        break;
      case 401:
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        break;
      case 502:
        break;
      default:
        break;
    }
  }
}

let networkErrorTimer: NodeJS.Timeout | null = null;

function startNetworkErrorTimer(): void {
  if (!networkErrorTimer) {
    networkErrorTimer = setTimeout(() => {}, 3 * 60 * 1000);
  }
}

chatApi.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    handleNetworkError(error);
    return Promise.reject(error);
  },
);

export {chatApi as wosolApi, setActiveUser};
