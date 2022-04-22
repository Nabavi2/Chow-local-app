import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { NavigationService } from '~/core/services';
import { Screen, Input, Button, AppText, } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { fetchAPI } from '~/core/utility';
import {
  updatedETA,
  showNotification
} from '~/store/actions';

export const RequestDeliveryETAOtherScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  const [ETA, setETA] = useState('');
  const addETA = useCallback((time) => {
    if(time <= 20) {
      dispatch(showNotification({ type: 'error', message: "You are not able to input less than 20min" }))
      setETA('');
    } else {
      dispatch(updatedETA(time));
      NavigationService.goBack();
    }
  },[dispatch]);  

  return (
    <Screen isLoading={isLoading}>
      <View style={styles.container}>
        <View style={GlobalStyles.formControl}>
          <Input
            type="text"
            title="Minutes"
            placeholder="Please input min"
            value={ETA}
            keyboardType="number-pad"            
            onChange={setETA}
          />
        </View>
        <View style={GlobalStyles.formControl}>
          <Button
            type="accent"
            onClick={() => addETA(ETA)}>
            Save
          </Button>
        </View>
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
});

RequestDeliveryETAOtherScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Custom Min',
    },
  });
