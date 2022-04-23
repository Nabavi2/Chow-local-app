import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationService} from '~/core/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Screen, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';

export const SettingsScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const token = useSelector(state => state.account.token);

  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: <Icon size={40} color="black" name="menu" />,
    });
  }, []);

  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);

  return (
    <Screen hasList isLoading={isLoading}>
      <View style={styles.container}>
        <AppText style={styles.heading_order}>SETTINGS</AppText>
        {/* <AppText style={styles.name}>
            Tap button below to change status to
          </AppText>      */}
        <Button
          type="bordered-dark"
          style={GlobalStyles.formControl}
          onClick={() => {
            NavigationService.navigate('MyAccount');
          }}>
          My Account
        </Button>
        <Button
          type="bordered-dark"
          style={GlobalStyles.formControl}
          onClick={() => {
            NavigationService.navigate('MySubscription');
          }}>
          My Subscription
        </Button>
        <Button
          type="bordered-dark"
          style={GlobalStyles.formControl}
          onClick={() => {
            NavigationService.navigate('SettingsPrinter');
          }}>
          Printer Setup
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
  },

  heading_order: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    marginTop: 0,
  },

  name: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },

  number: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 10,
    color: '#6f6f6e',
  },
});

SettingsScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
