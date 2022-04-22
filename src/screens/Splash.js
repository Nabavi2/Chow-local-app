import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { NavigationService } from '~/core/services';
import { Screen, AppText, Button } from '~/components';

import { fetchAPI } from '~/core/utility';
import { setUserInfo, setToken, signOut, setOrder } from '~/store/actions';
import { Theme } from '~/styles';

export const SplashScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);
  useEffect(() => {
   
    if (token) {
      console.log("token!!!!!!!!!!", token);
      fetchAPI('/token?app=seller', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("token___________________", res.data);
          if (res.data.user_active || res.data.user_verified) {
            dispatch(setToken(res.data.token));
            console.log("token___________________", res.data);
            dispatch(
              setUserInfo({
                uuid: res.data.uuid,
                firstName: res.data.first_name,
                lastName: res.data.last_name,
                phone: res.data.phone,
                email: res.data.email,
                creditcard: res.data.creditcard,
                totalOrders: res.data.total_orders,
                user_verified: res.data.user_verified,
                user_active: res.data.user_active,
                my_image: res.data.image
              }),
            );           
            setTimeout(() => NavigationService.reset('Home'), 3000);          
          } 
        })
        .catch((err) => {
          console.log("erorr!!!!!", err.message);
          setTimeout(() => NavigationService.reset('CheckPassword'), 3000);
        });
    } else {
      setTimeout(() => NavigationService.reset('CheckPassword'), 3000);
    }
  }, []); 
 
    return (
      <Screen
        align="center"
        backgroundImage={require('~/assets/images/home-bg.jpg')}>
        <View style={styles.container}>
          <Image
            source={require('~/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Screen>
    );
  
};

SplashScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,

    display: 'flex',
    minHeight: '100%',
  },

  logo: {
    width: '60%',
    height: '30%',
    resizeMode: 'cover',
    margin: 'auto',
  },

  accentColor: {
    color: Theme.color.accentColor,
  },

  heading: {
    color: '#FFF',
    fontSize: 40,
    letterSpacing: 2,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  subheading: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
