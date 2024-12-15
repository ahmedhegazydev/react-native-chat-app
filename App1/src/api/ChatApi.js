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

chatApi.interceptors.request.use(
  async config => {
    const token = AUTH_TOKENS[currentUser];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

function handleNetworkError(error) {
  if (error.isAxiosError && !error.response) {
    startNetworkErrorTimer();
  } else if (error.response) {
    const status = error.response.status;
    const errorMessages = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
    };

    console.error(
      `${errorMessages[status] || 'Unknown error'}:`,
      error.response.data,
    );

    if (status === 401) navigate('LoginScreen');
    if (status === 403) navigate('ForbiddenScreen');
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
    );
  }
}

chatApi.interceptors.response.use(
  response => response,
  error => {
    handleNetworkError(error);
    return Promise.reject(error);
  },
);

export {chatApi as wosolApi, setActiveUser};
