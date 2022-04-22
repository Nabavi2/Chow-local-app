import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MoneySVG from '~/assets/images/money.svg';
import { NavigationService } from '~/core/services';
import { Screen, Input, Button, AppText, } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import { showNotification, clearNotification,  updateStatus, isUpdateStatus} from '~/store/actions';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAPI } from '~/core/utility';

export const OrderRejectScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);
  const order_id = useMemo(() => navigation.getParam('order_id'), []);
  const is_update_status = useSelector((state) => state.order.updated);

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
                navigation.goBack();                
              }}>
              Go Back
            </Button>                    
          </>
        ),
      })
    );
  });

  const orderReject = useCallback((type) => {  
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('app', "seller");
    formData.append('reason_type', type)
    fetchAPI('/order/reject', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        console.log("RERRRRFund SENTTTTTTTTTTTTTTTTTTTTTTTTT", res.data);      
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
        <AppText style={{ fontSize: 18, textAlign: 'center'}}>
         Why are you rejecting this order?
        </AppText>
        <View style={GlobalStyles.formControl}>
          <Button
            type="bordered-dark"
            onClick={() => orderReject('closed')}>
            We are closed
          </Button>
      
          <Button
            style={{marginTop: 15}}
            type="bordered-dark"
            onClick={() => orderReject('too-busy')}>
            We are too busy
          </Button>

          <Button
            style={{marginTop: 15}}
            type="bordered-dark"
            onClick={() => {NavigationService.navigate("OrderRejectReason",{order_id: order_id})}}>
            Other reason
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

OrderRejectScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'REJECT ORDER',
    },
  });
