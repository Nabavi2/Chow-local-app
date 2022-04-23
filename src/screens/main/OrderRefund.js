import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import MoneySVG from '~/assets/images/money.svg';
import {NavigationService} from '~/core/services';
import {Screen, Input, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {
  showNotification,
  clearNotification,
  updateStatus,
  isUpdateStatus,
} from '~/store/actions';
import {fetchAPI} from '~/core/utility';

export const OrderRefundScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const currency = useMemo(() => navigation.getParam('currency'), []);
  const total_amount = useMemo(() => navigation.getParam('total_amount'), []);
  const total_amount_formatted = useMemo(
    () => navigation.getParam('total_amount_formatted'),
    [],
  );
  const order_id = useMemo(() => navigation.getParam('order_id'), []);
  const customer_name = useMemo(() => navigation.getParam('customer_name'), []);
  const currency_icon = useMemo(() => navigation.getParam('currency_icon'), []);
  const is_update_status = useSelector(state => state.order.updated);
  const [refundAmount, setRefundAmount] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (step == 2) {
      navigation.setParams({
        backAction: () => setStep(1),
      });
    } else {
      navigation.setParams({
        backAction: () => navigation.goBack(),
      });
    }
  }, [step]);

  const showRefundSent = useCallback(amount => {
    dispatch(
      showNotification({
        type: 'fullScreen',
        autoHide: false,
        options: {align: 'right'},
        message: (
          <>
            <MoneySVG height={120} width={120} />
            <AppText
              style={{
                fontSize: 16,
                color: 'white',
                textAlign: 'center',
                marginTop: 10,
              }}>
              REFUND SENT
            </AppText>
            <AppText
              style={{
                fontSize: 15,
                color: 'white',
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}>
              A refund of {currency_icon}
              {amount} has been sent to{' '}
              {customer_name == ' ' ? 'customer' : customer_name} (order #
              {order_id})
            </AppText>
            <Button
              type="white"
              fullWidth
              onClick={() => {
                dispatch(clearNotification());
              }}>
              Exit
            </Button>
          </>
        ),
      }),
    );
  });

  const sendFullRefund = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', order_id);
    formData.append('amount', total_amount);
    formData.append('app', 'seller');
    fetchAPI('/order/refund', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        showRefundSent(total_amount);
        dispatch(updateStatus('Refunded'));
        dispatch(isUpdateStatus(!is_update_status));
        NavigationService.goBack();
        NavigationService.goBack();
      })
      .catch(err => {
        dispatch(showNotification({type: 'error', message: err.message}));
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  const sendPartialRefund = useCallback(
    refundAmount => {
      if (refundAmount > total_amount) {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Please enter an amount up to ' + total_amount_formatted,
          }),
        );
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append('order_id', order_id);
      formData.append('type', 'partial');
      formData.append('amount', refundAmount);
      formData.append('app', 'seller');
      fetchAPI('/order/refund', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(res => {
          showRefundSent(refundAmount);
          dispatch(updateStatus('Partially Refunded'));
          dispatch(isUpdateStatus(!is_update_status));
          NavigationService.goBack();
          NavigationService.goBack();
        })
        .catch(err => {
          dispatch(showNotification({type: 'error', message: err.message}));
        })
        .finally(() => setLoading(false));
    },
    [dispatch],
  );

  return (
    <Screen isLoading={isLoading}>
      <View style={styles.container}>
        <AppText style={{fontSize: 18, textAlign: 'center'}}>
          {step == 1
            ? 'Would you like to issue a full or partial refund?'
            : 'Enter an amount up to ' + total_amount_formatted}
        </AppText>
        {step == 1 ? (
          <View style={GlobalStyles.formControl}>
            <Button
              type="bordered-dark"
              onClick={() => {
                sendFullRefund();
              }}>
              FULL REFUND
            </Button>

            <Button
              style={{marginTop: 15}}
              type="bordered-dark"
              onClick={() => setStep(2)}>
              PARTIAL REFUND
            </Button>
          </View>
        ) : (
          <View style={GlobalStyles.formControl}>
            <Input
              type="text"
              titleType="money"
              title={currency}
              placeholder="Enter an amount"
              value={refundAmount}
              keyboardType="default"
              onChange={setRefundAmount}
            />
            <Button
              style={{marginTop: 15}}
              type="bordered-dark"
              onClick={() => sendPartialRefund(refundAmount)}>
              SEND PARTIAL REFUND
            </Button>
          </View>
        )}
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

OrderRefundScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Refund',
    },
    headerTitleStyle: {
      color: 'black',
    },
  });
