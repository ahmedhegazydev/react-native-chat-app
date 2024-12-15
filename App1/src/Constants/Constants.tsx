export const Constants = {
  // Base urls
  BASE_URL_WEB_SOCKET: 'wss:https://cms.tetaman.app/websocket/',
  BASE_URL_Chat: 'https://cms.tetaman.app/',
};

export const SliceName = {
  auth: 'auth',
};

export const ThunkName = {
  postLogin: SliceName.auth + '/postLogin',
};

export const ScreenName = {
  ErrorScreen: 'ErrorScreen',
  SplashScreen: 'SplashScreen',
  LoginScreen: 'LoginScreen',
};
