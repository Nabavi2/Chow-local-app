/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import { Provider } from 'react-redux';
 import { PersistGate } from 'redux-persist/integration/react';
 import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
 import { Platform } from 'react-native';
 import AppContainer from './src/router';
 import { Loading } from './src/components';
 import { NavigationService } from './src/core/services';
 import firebase from '@react-native-firebase/app';
 import store from './src/store';
 
 
 // Ask for consent first if necessary
 // Possibly only do this for iOS if no need to handle a GDPR-type flow
 var firebaseConfig = {
  apiKey: "AIzaSyA0t1b5Tt76tm61UPEjFOn6BSaIM20Emvg",
  authDomain: "chowlocal.firebaseapp.com",
  databaseURL: "https://chowlocal.firebaseio.com",
  projectId: "chowlocal",
  storageBucket: "chowlocal.appspot.com",
  messagingSenderId: "136006348676",
  appId: "1:136006348676:ios:d56c2ce7e7b0baa80b77d1",
} 
 
 
 MaterialIcon.loadFont();
 Platform.OS == 'ios' ? firebase.initializeApp(firebaseConfig) : firebase.initializeApp();
 const App = () => {
   return (
     <Provider store={store.store}>
       <PersistGate loading={<Loading />} persistor={store.persistor}>
         <AppContainer
           ref={(navigatorRef) => {
             NavigationService.setNavigator(navigatorRef);
           }}
         />
       </PersistGate>
     </Provider>
   );
 };
 
 export default App;
