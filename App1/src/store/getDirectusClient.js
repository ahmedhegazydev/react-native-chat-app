import {Directus} from '@directus/sdk';
import {networkManager} from '../Utils/NetworkManager';

const AUTH_TOKENS = {
  user1: 'I5BbIZ2F973BBSDDO2juOWZfrk8_q9Qf',
  user2: 'hGEfdrLdLBmn-EcaU-dfRpGRt3kzyofH',
};

const WEBSOCKET_URL = 'wss://cms.tetaman.app/websocket';
const currentUser = 'user2';

let directusClient = null;

function getDirectusClient() {
  if (!directusClient) {
    directusClient = new Directus(WEBSOCKET_URL, {
      auth: {
        staticToken: AUTH_TOKENS[currentUser],
      },
    });
  }
  return directusClient;
}

export default getDirectusClient;
