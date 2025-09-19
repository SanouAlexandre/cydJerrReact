/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Ensure the app displays the login page
AppRegistry.registerComponent(appName, () => App);
