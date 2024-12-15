import axios, {AxiosInstance, AxiosRequestConfig, AxiosError} from 'axios';
import axiosRetry from 'axios-retry';
import {Constants} from '../Constants/Constants';
import {navigate} from '../Utils/Common';

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

const logRequest = (config: AxiosRequestConfig): AxiosRequestConfig => config;

const logError = (error: AxiosError): Promise<never> => Promise.reject(error);

chatApi.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = AUTH_TOKENS[currentUser];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return logRequest(config);
  },
  (error: AxiosError) => Promise.reject(error),
);

function handleNetworkError(error: AxiosError): void {
  if (error.isAxiosError && !error.response) {
    startNetworkErrorTimer();
  } else if (error.response && error.response.status !== 200) {
    console.log('API responded with error status:', error.response.status);
  }
}

let networkErrorTimer: NodeJS.Timeout | null = null;

function startNetworkErrorTimer(): void {
  if (!networkErrorTimer) {
    networkErrorTimer = setTimeout(
      () => {
        navigate('ErrorScreen', {
          message: 'تحقق من الاتصال بالانترنت',
        });
      },
      3 * 60 * 1000,
    ); // 3 minutes
  }
}

export {chatApi as wosolApi, setActiveUser, logRequest, logError};
