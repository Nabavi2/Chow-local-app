import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Screen, Button, AppText, StoredAddressDelivery} from '~/components';
import {MainNavigationOptions, Theme} from '~/styles';
import {showNotification, isUpdateStatus} from '~/store/actions';
import {fetchAPI, getTimeAway} from '~/core/utility';
import DeliverySVG from '~/assets/images/delivery-truck.svg';
import PickupSVG from '~/assets/images/package.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ETADetailsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const [isLoading, setLoading] = useState(false);
  const pre_orderDetail = useMemo(
    () => navigation.getParam('pre_orderDetail'),
    [],
  );
  const [minutes, setMinutes] = useState('');
  const [pre_order_away_time, setAwayDate] = useState('');
  const is_update_status = useSelector(state => state.order.updated);
  useEffect(() => {
    let temptimer;
    setAwayDate(
      getTimeAway(pre_orderDetail.pre_order_date).replace(' away', ''),
    );
    temptimer = setInterval(() => {
      setAwayDate(
        getTimeAway(pre_orderDetail.pre_order_date).replace(' away', ''),
      );
    }, 10000);

    return () => {
      clearInterval(temptimer);
    };
  }, [pre_orderDetail]);

  useEffect(() => {
    setMinutes(pre_orderDetail.pre_order_date_notification_minutes);
  }, [pre_orderDetail]);

  const saveETA = useCallback(time => {
    setLoading(true);
    setMinutes(time);
    const formData = new FormData();
    formData.append('app', 'seller');
    formData.append('notification_minutes', time);
    formData.append('order_id', pre_orderDetail.order_id);
    fetchAPI(`/order/set_pre_order_data`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        dispatch(
          showNotification({type: 'success', message: 'Successfully changed!'}),
        );
        dispatch(isUpdateStatus(!is_update_status));
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  });

  return (
    <Screen isLoading={isLoading} keyboardAware={true}>
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 0,
          }}>
          <View
            style={{
              backgroundColor: '#EFEFEF',
              alignItems: 'center',
              flexDirection: 'column',
              height: 100,
              justifyContent: 'center',
              borderRadius: 20,
              marginBottom: 10,
              marginRight: 15,
              flex: 2,
            }}>
            {pre_orderDetail.delivery_type == 'deliver' ? (
              <DeliverySVG
                style={{justifyContent: 'center'}}
                height={50}
                width={50}
              />
            ) : (
              <PickupSVG
                style={{justifyContent: 'center'}}
                height={50}
                width={50}
              />
            )}
            <AppText
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}>
              {pre_orderDetail.delivery_type == 'deliver'
                ? 'DELIVERY'
                : 'PICK UP'}
            </AppText>
          </View>
          <View
            style={{
              backgroundColor: '#EFEFEF',
              flexDirection: 'column',
              height: 100,
              justifyContent: 'center',
              borderRadius: 20,
              marginBottom: 10,
              flex: 3,
            }}>
            <AppText
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                justifyContent: 'center',
                fontSize: 30,
                textTransform: 'uppercase',
              }}>
              {pre_order_away_time}
            </AppText>
            <AppText
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                fontSize: 11,
                marginTop: 10,
              }}>
              FROM NOW
            </AppText>
          </View>
        </View>

        <TouchableOpacity style={styles.address} activeOpacity={0.8}>
          <View style={styles.iconWrapper}>
            <Icon size={22} color={'#333'} name="calendar-month" />
          </View>
          <View style={styles.addressWrapper}>
            <AppText style={{fontSize: 16}}>
              {pre_orderDetail.pre_order_date_string}
            </AppText>
          </View>
        </TouchableOpacity>
        {pre_orderDetail.delivery_type == 'deliver' && (
          <TouchableOpacity style={styles.address} activeOpacity={0.8}>
            <View style={styles.iconWrapper}>
              <Icon size={24} color={'#333'} name="map-marker" />
            </View>
            <View style={styles.addressWrapper}>
              <StoredAddressDelivery
                address={pre_orderDetail.dropoff_address}
              />
            </View>
          </TouchableOpacity>
        )}
        <AppText style={styles.number} numberOfLines={2}>
          This pre-order will appear as a regular order {minutes} minutes before
          the{' '}
          {pre_orderDetail.delivery_type == 'deliver' ? 'delivery' : 'pick up'}{' '}
          time
        </AppText>
        <View style={{flexDirection: 'row'}}>
          <Button
            type={minutes == '20' ? 'accent' : 'bordered-dark'}
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('20')}>
            20 Min
          </Button>
          <Button
            type={minutes == '25' ? 'accent' : 'bordered-dark'}
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('25')}>
            25 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type={minutes == '30' ? 'accent' : 'bordered-dark'}
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('30')}>
            30 Min
          </Button>
          <Button
            type={minutes == '35' ? 'accent' : 'bordered-dark'}
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('35')}>
            35 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type={minutes == '40' ? 'accent' : 'bordered-dark'}
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('40')}>
            40 Min
          </Button>
          <Button
            type={minutes == '45' ? 'accent' : 'bordered-dark'}
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('45')}>
            45 Min
          </Button>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Button
            type={minutes == '50' ? 'accent' : 'bordered-dark'}
            style={{marginTop: 20, marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('50')}>
            50 Min
          </Button>
          <Button
            type={minutes == '55' ? 'accent' : 'bordered-dark'}
            fullWidth
            style={{marginTop: 20, marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('55')}>
            55 Min
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

  number: {
    fontSize: 15,
    textAlign: 'center',
    color: '#484848',
    marginTop: 10,
  },

  orderNumber: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 0,
    color: '#000000',
    fontWeight: 'bold',
  },

  question: {
    fontSize: 15,
    fontWeight: '300',
    marginLeft: 10,
    color: '#000000',
    fontWeight: 'bold',
  },

  radio: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  radioBackground: {
    backgroundColor: Theme.color.container,
    borderWidth: 0,
    marginLeft: 0,
    paddingHorizontal: 0,
  },

  address: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#e8e8e8',
    height: 50,
  },

  iconWrapper: {
    width: 30,
  },

  summaryRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  summaryValue: {
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },

  summaryKey: {
    fontSize: 16,
    flex: 10,
    textAlign: 'right',
  },

  imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 40,
    marginRight: 10,
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },

  addressWrapper: {
    flex: 1,
  },
});

ETADetailsScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'ORDER ETA',
    },
  });
