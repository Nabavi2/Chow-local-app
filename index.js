/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 import PushNotification,{Importance}  from 'react-native-push-notification';
 import {Text, TextInput} from 'react-native';
  
PushNotification.createChannel(
  {
    channelId: "com.squareflo.chowlocalchannel.chris", // (required)
    channelName: "This channel added by Chris", // (required)
    channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    channelDescription: "A channel to categorise your notifications",
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);
 Text.defaultProps = Text.defaultProps || {}
 Text.defaultProps.allowFontScaling = false

 TextInput.defaultProps = TextInput.defaultProps || {};
 TextInput.defaultProps.allowFontScaling = false;
 AppRegistry.registerComponent(appName, () => App);

