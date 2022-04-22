import React from 'react';
import { View, Image } from 'react-native';
import { TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText } from '../components';
import { Theme } from './theme';
import { NavigationService } from '~/core/services/NavigationService';

export const NavigationOptions = {
  headerTruncatedBackTitle: true,
  gestureEnabled: false,

  headerLeftContainerStyle: {
    marginLeft: 10,
  },
  headerRightContainerStyle: {
    marginRight: 10,
  },
};

export const RegisterNavigationOptions = ({ navigation, options }) => {
  return {
    headerStyle: {
      height: Theme.header.height,
    },

    headerTintColor: Theme.registerHeader.actionColor,
    headerTransparent: true,

    headerTitleStyle: {
      color: Theme.registerHeader.titleColor,
      fontFamily: 'Montserrat-Bold',
      textAlign: 'center',
      fontSize: 18,
      textTransform: 'uppercase',
      marginLeft: 0,
      // marginLeft: navigation.getParam('action') ? 60 : 0,
    },

    headerLeft: () =>
      navigation.dangerouslyGetParent().state.index > 0 ? (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.goBack()}>
          <Icon size={30} color="white" name="chevron-left" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }}></View>
      ),

    headerRight: () =>
      navigation.getParam('action') ? (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={navigation.getParam('action')}>
          <AppText
            style={{
              color: Theme.registerHeader.actionColor,
              textAlign: 'center',
            }}>
            NEXT
          </AppText>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }}></View>
      ),
    ...NavigationOptions,
    ...options,
  };
};

export const MainNavigationOptions = ({
  navigation,
  options = {},
  headerTitleStyle = {},
}) => {
  return {
    headerStyle: {
      height: Theme.header.height,
      backgroundColor: 'green',
    },

    headerTintColor: Theme.registerHeader.actionColor,
    headerTransparent: true,
    
    headerTitleStyle: {
      color: Theme.registerHeader.titleColor,
      textAlign: 'center',
      fontFamily: 'Montserrat-Bold',
      fontSize: navigation.getParam('fontSize')? navigation.getParam('fontSize') : 18,
      textTransform: 'uppercase',

      marginLeft: 0,
      // navigation.getParam('action') && navigation.getParam('actionTitle')
      //   ? 60
      //   : 0,

      ...headerTitleStyle,
    },

    headerLeft: () =>
      navigation.dangerouslyGetParent().state.index > 0 && (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={navigation.getParam('backAction') ? navigation.getParam('backAction') : () => navigation.goBack()}>
          <Icon size={30} name={navigation.getParam('backIcon') ? navigation.getParam('backIcon') : "chevron-left"} />
        </TouchableOpacity>
      ),

    headerRight: () =>
      navigation.getParam('action') && navigation.getParam('actionTitle') ? (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={navigation.getParam('action')}>
          <AppText
            style={{
              color:
                navigation.getParam('actionColor') || Theme.color.accentColor,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {navigation.getParam('actionTitle')}
          </AppText>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }}></View>
      ),

    ...NavigationOptions,
    ...options,
  };
};

export const MessageRoomNavigationOptions = ({
  navigation,
  options = {},
  headerTitleStyle = {},
}) => {
  return {
    headerStyle: {
      height: Theme.header.height,
      backgroundColor: '#EFEFEF',
    },

    headerTintColor: Theme.registerHeader.actionColor,

    headerTitleStyle: {
      color: Theme.registerHeader.titleColor,
      textAlign: 'center',
      fontFamily: 'Montserrat-Bold',
      fontSize: 18,
      textTransform: 'uppercase',

      marginLeft: 0,
      // navigation.getParam('action') && navigation.getParam('actionTitle')
      //   ? 60
      //   : 0,

      ...headerTitleStyle,
    },

    headerLeft: () =>
      navigation.dangerouslyGetParent().state.index > 0 && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity 
            onPress={navigation.getParam('backAction') ? navigation.getParam('backAction') : () => navigation.goBack()}>
            <Icon size={30} name={navigation.getParam('backIcon') ? navigation.getParam('backIcon') : "chevron-left"} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', marginTop: -5}}>  
            <TouchableOpacity 
            onPress={navigation.getParam('sellerHome') ? navigation.getParam('sellerHome') : () => NavigationService.navigate('Products')}>
              <View style={{ width: 40, alignItems: 'center',marginRight: 10 }}>
                <Image
                  source={{ uri: navigation.getParam('territoryImage') }}
                  style={{ width: 40, height: 40, borderRadius: 40, borderWidth: 0 }}
                />
              </View>
              </TouchableOpacity>
              <View style={{width:'70%'}}>
                <AppText numberOfLines={1} style={{fontWeight: 'bold'}}>
                  {navigation.getParam('territoryTitle')}
                </AppText>
                <AppText>
                  {navigation.getParam('territoryAddress')}
                </AppText>
              </View>
            </View>
        </View>
      ),

    headerRight: () =>
      navigation.getParam('action') && navigation.getParam('actionTitle') ? (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={navigation.getParam('action')}>
          <AppText
            style={{
              color:
                navigation.getParam('actionColor') || Theme.color.accentColor,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundColor:
                navigation.getParam('actionBackground') || Theme.color.backgroundColor,
              padding: 5,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 10,
              fontSize: 10
            }}>
            {navigation.getParam('actionTitle')}
          </AppText>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30 }}></View>
      ),

    ...NavigationOptions,
    ...options,
  };
};
