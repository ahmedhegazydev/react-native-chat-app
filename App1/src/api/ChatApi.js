import axios from 'axios';
import axiosRetry from 'axios-retry';
import {Constants} from '../Constants/Constants';
import {navigate} from '../Utils/Common';

const AUTH_TOKENS = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};

let currentUser = 'user2';

function setActiveUser(user) {
  if (!AUTH_TOKENS[user]) {
    throw new Error(`No token found for user: ${user}`);
  }
  currentUser = user;
}

const chatApi = axios.create({
  baseURL: Constants.BASE_URL_Chat,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosRetry(chatApi, {retries: 3, retryDelay: axiosRetry.exponentialDelay});

const logRequest = config => config;

const logError = error => Promise.reject(error);

chatApi.interceptors.request.use(
  async config => {
    const token = AUTH_TOKENS[currentUser];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return logRequest(config);
  },
  error => Promise.reject(error),
);

function handleNetworkError(error) {
  if (error.isAxiosError && !error.response) {
    startNetworkErrorTimer();
  } else if (error.response && error.response.status !== 200) {
    console.log('API responded with error status:', error.response.status);
  }
}

let networkErrorTimer = null;

function startNetworkErrorTimer() {
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
