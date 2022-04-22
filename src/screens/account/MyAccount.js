import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { NavigationService } from '~/core/services';
import { Screen, Button, AppText } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import BackgroundTimer from 'react-native-background-timer';
import { formatPhoneNumber } from '~/core/utility';
import { signOut, setPastOrders } from '~/store/actions';

export const MyAccountScreen = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.account.userInfo);

  return (
    <Screen>
      {userInfo && (
        <View style={styles.container}>
          <AppText style={styles.name}>
            {userInfo.firstName} {userInfo.lastName}
          </AppText>
          <AppText style={styles.number}>
            {userInfo.email}
          </AppText>
          {/* <AppText style={styles.number}>
            {formatPhoneNumber(userInfo.phone)}
          </AppText> */}
          <Button
            type="bordered-dark"
            style={GlobalStyles.formControl}
            onClick={() => {
              NavigationService.navigate('Splash');
              BackgroundTimer.stopBackgroundTimer(); 
              dispatch(setPastOrders(false));
              dispatch(signOut());
            }}>
            Sign Out
          </Button>
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
  },

  name: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    marginBottom: 5,
  },

  number: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 10,
    color: '#6f6f6e',
  },
});

MyAccountScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'My Account',
    },
  });
