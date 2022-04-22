import {View, StyleSheet} from 'react-native';
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAPI} from '~/core/utility';
import {NavigationService} from '~/core/services';
import {Screen, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';

import {formatPhoneNumber} from '~/core/utility';
import {showNotification, updateStatus, isUpdateStatus} from '~/store/actions';

export const UpdateStatusScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const token = useSelector(state => state.account.token);
  const status_slug = useSelector(state => state.order.status_slug);
  const is_update_status = useSelector(state => state.order.updated);
  // const [orderStatus, setOrderStatus] = useState('open');
  const userInfo = useSelector(state => state.account.userInfo);
  const orderId = useMemo(() => navigation.getParam('orderId'), []);
  const type = useMemo(() => navigation.getParam('type'), []);
  const delivery_request_by = useMemo(
    () => navigation.getParam('delivery_request_by'),
    [],
  );
  const [orderDetail, setOrderDetail] = useState();
  const [statusList, setStatusList] = useState();
  const [keys, setKeys] = useState();

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
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    setLoading(true);

    fetchAPI('/orders/get_statuses_list', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setStatusList(res.data.statuses);
        setKeys(Object.keys(res.data.statuses));

        if (type == 'deliver') {
          console.log('DDDDDDDDDDd');
          // item != "picked-up" && item != "ready-for-pickup"
          setKeys(
            Object.keys(res.data.statuses).filter(
              item =>
                item != 'picked-up' &&
                item != 'ready-for-pickup' &&
                item != 'processing',
            ),
          );
          // if (delivery_request_by == 'territory') {
          //   setKeys(
          //     Object.keys(res.data.statuses).filter(
          //       item => (item === 'delivered' || item === 'ready-for-delivery'),
          //     ),
          //   );
          // }
        }

        if (type == 'pickup') {
          setKeys(
            Object.keys(res.data.statuses).filter(
              item =>
                item != 'delivery-en-route' &&
                item != 'ready-for-delivery' &&
                item != 'delivered' &&
                item != 'processing',
            ),
          );
         
        }
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = useCallback(
    status => {
      setLoading(true);
      const formData = new FormData();
      formData.append('order_id', orderId);
      formData.append('app', 'seller');
      formData.append('status', status);

      fetchAPI('/order/update_status', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(res => {
          dispatch(updateStatus(statusList[status]));
          dispatch(isUpdateStatus(!is_update_status));
          NavigationService.goBack();
        })
        .catch(err => {
          dispatch(showNotification({type: 'error', message: err.message}));
        })
        .finally(() => setLoading(false));
    },
    [dispatch, token, statusList],
  );

  return (
    // console.log('++++++++++++++++++'+orderDetail.status_name),
    // console.log(orderDetail),
    <Screen keyboardAware>
      {orderDetail && (
        <View style={styles.container}>
          <AppText style={styles.name}>
            Update the status of this order from{' '}
            <AppText style={{fontWeight: 'bold', textTransform: 'uppercase'}}>
              {orderDetail.status_name}
            </AppText>{' '}
            to:
          </AppText>

          {orderDetail.status_name !== 'Picked Up' &&
            keys &&
            keys.map(item => {
              if (orderDetail.status_name != statusList[item]) {
                return (
                  <Button
                    type="bordered-dark"
                    style={GlobalStyles.formControl}
                    onClick={() => {
                      updateOrderStatus(item);
                    }}>
                    {statusList[item]}
                  </Button>
                );
              }
            })}
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
    // textTransform: 'uppercase',
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

UpdateStatusScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'STATUS',
    },
  });
