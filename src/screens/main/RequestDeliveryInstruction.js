import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { NavigationService } from '~/core/services';
import { Screen, Input, Button, AppText, } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { fetchAPI } from '~/core/utility';
import {
  updatedInstructions,
} from '~/store/actions';

export const RequestDeliveryInstructionScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.account.token);
  const guestToken = useSelector((state) => state.account.guestToken);
  const dispatch = useDispatch();
  
  const [instructions, setInstruction] = useState('');
  const addInstruction = useCallback((instructions) => {
    dispatch(updatedInstructions(instructions));
    NavigationService.goBack();
  },[dispatch]);
  

  return (
    <Screen isLoading={isLoading}>
      <View style={styles.container}>
        <View style={GlobalStyles.formControl}>
          <Input
            type="textarea"
            title="Special Instructions (optional)"
            placeholder="Type any special instructions you want"
            value={instructions}
            onChange={setInstruction}
          />
        </View>
        <View style={GlobalStyles.formControl}>
          <Button
            type="accent"
            onClick={() => addInstruction(instructions)}>
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

RequestDeliveryInstructionScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Instructions',
    },
  });
