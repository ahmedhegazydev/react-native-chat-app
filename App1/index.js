import * as React from 'react';
import {AppRegistry, Text} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import {I18nManager} from 'react-native';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler'; // Add this line FIRST

I18nManager.allowRTL(true);

export default function Main() {
  return <App />;
}
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => Main);
