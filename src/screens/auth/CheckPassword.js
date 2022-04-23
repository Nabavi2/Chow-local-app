import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {NavigationService} from '~/core/services';
import {Screen, Input, Button, AppText} from '~/components';
import {GlobalStyles, Theme} from '~/styles';

import {fetchAPI} from '~/core/utility';
import {setToken, setUserInfo, showNotification} from '~/store/actions';
import {RegisterNavigationOptions} from '~/styles';
import {firebase} from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

export const CheckPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState(''); //fang89517@gmail.com
  const [password, setPassword] = useState(''); //123456
  const [isLoading, setLoading] = useState(false);
  const [fcm_token, setFCMToken] = useState('');
  const navigateTo = useMemo(() => navigation.getParam('navigateTo'), []);

  const dispatch = useDispatch();
  const signIn = useCallback((email, password, fcm_token) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('id', email);
    formData.append('password', password);
    formData.append('fcm_token', fcm_token);
    formData.append('app', 'seller');

    fetchAPI(`/login`, {
      method: 'POST',

      body: formData,
    })
      .then(res => {
        console.log('res', res);
        const loginToken = res.data.token;
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
            my_image: res.data.image,
          }),
        );
        dispatch(setToken(loginToken));
        NavigationService.reset('Home');
      })
      .catch(err => {
        console.log(err);
        dispatch(showNotification({type: 'error', message: err.message}));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  });

  const load = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      const token_a = await firebase.messaging().getToken();
      console.log(token_a);
      setFCMToken(token_a);
    }
  };

  return (
    <Screen
      isLoading={isLoading}
      backgroundImage={require('~/assets/images/home-bg.jpg')}>
      <View style={[styles.container]}>
        <AppText style={[styles.greenText, styles.title]}>SIGN IN</AppText>
        <AppText style={[styles.whiteText, styles.subTitle]}>
          Sign in with your Chow Local Seller account
        </AppText>
        <View style={styles.inputWrapper}>
          <Input
            style={GlobalStyles.formControl}
            title="Email"
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            onChange={value => {
              setEmail(value);
            }}
          />
          <Input
            title="Password"
            type="password"
            placeholder="Password"
            keyboardType="default"
            value={password}
            onChange={value => {
              setPassword(value);
            }}
            style={GlobalStyles.formControl}
            actionHandler={() => signIn(password)}
          />
          <Button
            type="accent"
            style={GlobalStyles.formControl}
            onClick={() => signIn(email, password, fcm_token)}>
            SIGN IN
          </Button>
        </View>
      </View>
    </Screen>
  );
};

CheckPasswordScreen.navigationOptions = ({navigation}) =>
  RegisterNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
    flex: 1,
    width: '100%',
  },
  button: {
    marginTop: 30,
  },
  greenText: {
    color: Theme.color.accentColor,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  whiteText: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    fontSize: 30,
    letterSpacing: 2,
    fontWeight: '800',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
  },

  inputWrapper: {
    marginTop: 20,
    overflow: 'hidden',

    width: '100%',
  },
});
