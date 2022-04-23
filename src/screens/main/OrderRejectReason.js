import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MoneySVG from '~/assets/images/money.svg';
import { NavigationService } from '~/core/services';
import { Screen, Input, Button, AppText, } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { fetchAPI } from '~/core/utility';
import { showNotification, clearNotification,  updateStatus, isUpdateStatus} from '~/store/actions';
import {
  updatedInstructions,
} from '~/store/actions';
import { fetchAPI } from '~/core/utility';

export const OrderRejectReasonScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.account.token);
  const guestToken = useSelector((state) => state.account.guestToken);
  const dispatch = useDispatch();
  const order_id = useMemo(() => navigation.getParam('order_id'), []);
  const [instructions, setInstruction] = useState('');
  const addInstruction = useCallback((instructions) => {
    dispatch(updatedInstructions(instructions));
    NavigationService.goBack();
  },[dispatch]);
  const showRefundSent = useCallback((amount) => {
    dispatch(
      showNotification({
        type: 'fullScreen',
        autoHide: false,
        options: { align: 'right' },
        message: (
          <>               
            <MoneySVG height={120} width={120}/>                     
              <AppText
              style={{
                fontSize: 16,
                color: 'white',                          
                textAlign: 'center',
                marginTop: 10,
              }}>
             ORDER REJECTED
            </AppText>
            <AppText
              style={{
                fontSize: 15,
                color: 'white',                          
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20
              }}>
             This order has been rejected and refunded. The customer has been notified.
            </AppText>              
            <Button
              type="white"
              fullWidth
              onClick={() => {                         
                dispatch(clearNotification());
                NavigationService.goBack();
                NavigationService.goBack();
              }}>
              Go Back
            </Button>                    
          </>
        ),
      })
    );
  });

  const orderReject = useCallback((instructions) => {  
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('app', "seller");
    formData.append('reason_type', "other")
    formData.append('reason_message', instructions)
    fetchAPI('/order/reject', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        dispatch(updateStatus("Rejected"));
        // dispatch(isUpdateStatus(!is_update_status));
        showRefundSent();
      })
      .catch((err) =>{
        dispatch(showNotification({ type: 'error', message: err.message }));
      })
      .finally(() => setLoading(false));
  },[dispatch]); 

  return (
    <Screen isLoading={isLoading}>
      <View style={styles.container}>
        <View style={GlobalStyles.formControl}>
          <Input
            type="textarea"
            title="Provide a reason"
            placeholder="Start typing here"
            value={instructions}
            onChange={setInstruction}
          />
        </View>
        <AppText style={{ fontSize: 12, textAlign: 'center', marginTop: 10}}>
          The reason you provide above will be sent to the customer
        </AppText>
        <View style={GlobalStyles.formControl}>
          <Button
            type="accent"
            onClick={() => orderReject(instructions)}>
            Send
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

OrderRejectReasonScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Reason',
    },
  });
