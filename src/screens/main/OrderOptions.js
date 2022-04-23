import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {NavigationService} from '~/core/services';
import {Screen, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {
  showNotification,
  setTerritory,
  updateStatus,
  isUpdateStatus,
} from '~/store/actions';

import {fetchAPI} from '~/core/utility';

export const OrderOptionsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const orderId = useMemo(() => navigation.getParam('orderId'), []);
  const [orderDetail, setOrderDetail] = useState();
  const is_update_status = useSelector(state => state.order.updated);
  const token = useSelector(state => state.account.token);
  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('app', 'seller');
    fetchAPI('/order/details', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        setOrderDetail(res.data);
        navigation.setParams({orderStatus: res.data.status_name});
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = useCallback(() => {
    setLoading(true);

    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('app', 'seller');

    fetchAPI('/order/cancel', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        navigation.setParams({orderStatus: 'Cancelled'});
        dispatch(updateStatus('Cancelled'));
        dispatch(isUpdateStatus(!is_update_status));
        dispatch(
          showNotification({
            type: 'success',
            message: 'Order Cancelled Successfully',
          }),
        );
      })
      .catch(err => {
        dispatch(showNotification({type: 'error', message: err.message}));
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <Screen isLoading={isLoading}>
      <View style={styles.container}>
        {orderDetail && orderDetail.user.is_guest == false && (
          <View>
            <Button
              type="bordered-dark"
              style={GlobalStyles.formControl}
              onClick={() => {
                Linking.canOpenURL(`tel:${orderDetail.user.phone}`).then(
                  supported => {
                    if (supported) {
                      Linking.openURL(`tel:${orderDetail.user.phone}`);
                    } else {
                      dispatch(
                        showNotification({
                          type: 'error',
                          message: `Don't know how to open URI: ${orderDetail.user.phone}`,
                        }),
                      );
                    }
                  },
                );
              }}>
              {orderDetail.user.phone}
            </Button>
            <Button
              type="bordered-dark"
              style={GlobalStyles.formControl}
              onClick={() => {
                dispatch(setTerritory(orderDetail.territory));
                NavigationService.navigate('MessageRoom', {
                  token: token,
                  user: orderDetail.user.id,
                  user_image: orderDetail.user.image,
                  user_name: orderDetail.user.name,
                });
              }}>
              Send A Message
            </Button>
          </View>
        )}
        {orderDetail && orderDetail.allow_refund == true && (
          <Button
            type="bordered-dark"
            style={GlobalStyles.formControl}
            onClick={() => {
              // cancelOrder();
              NavigationService.navigate('OrderRefund', {
                currency: orderDetail.territory.currency.icon,
                total_amount_formatted:
                  orderDetail.allowed_refund_amount_formatted,
                total_amount: orderDetail.allowed_refund_amount,
                order_id: orderDetail.order_id,
                currency_icon: orderDetail.currency_icon,
                customer_name:
                  orderDetail.customer_first_name +
                  ' ' +
                  orderDetail.customer_last_name,
              });
            }}>
            Refund This Order
          </Button>
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

OrderOptionsScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: `#${
        navigation.getParam('orderId') ? navigation.getParam('orderId') : ''
      } ${
        navigation.getParam('orderStatus')
          ? navigation.getParam('orderStatus')
          : ''
      }`,
      headerTintColors: 'black',
    },
    headerTitleStyle: {
      color: 'black',
    },
  });
