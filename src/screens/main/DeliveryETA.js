import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationService} from '~/core/services';
import {Screen, Input, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {showNotification} from '~/store/actions';
import {fetchAPI} from '~/core/utility';

export const DeliveryETAScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const [isLoading, setLoading] = useState(false);
  const orderId = useMemo(() => navigation.getParam('orderId'), []);
  const delivery_request_id = useMemo(
    () => navigation.getParam('delivery_request_id'),
    [],
  );

  const saveETA = useCallback(time => {
    setLoading(true);
    const formData = new FormData();
    formData.append('app', 'seller');
    formData.append('delivery_request_id', delivery_request_id);
    formData.append('delivery_eta', time);
    fetchAPI(`/delivery_request/save_eta`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        if (orderId != undefined) {
          NavigationService.reset('Home');
          NavigationService.navigate('PastOrders', {activeTab: 1});
          NavigationService.navigate('OrderDetails', {
            orderId: orderId,
            requestDelivery: true,
            delivery_request_id: delivery_request_id,
          });
        } else {
          NavigationService.reset('Home');
          NavigationService.navigate('PastOrders', {activeTab: 1});
        }
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  });

  return (
    <Screen isLoading={isLoading} keyboardAware={true}>
      <View style={styles.container}>
        <AppText style={styles.number}>
          When will this order be ready to deliver?
        </AppText>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginTop: 20, marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('5')}>
            5 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginTop: 20, marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('10')}>
            10 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('15')}>
            15 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('20')}>
            20 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('25')}>
            25 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('30')}>
            30 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('35')}>
            35 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('40')}>
            40 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('45')}>
            45 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('50')}>
            50 Min
          </Button>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Button
            type="bordered-dark"
            style={{marginRight: 10, marginBottom: 10, flex: 1}}
            fullWidth
            onClick={() => saveETA('55')}>
            55 Min
          </Button>
          <Button
            type="bordered-dark"
            fullWidth
            style={{marginLeft: 10, marginBottom: 10, flex: 1}}
            onClick={() => saveETA('60')}>
            60 Min
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

DeliveryETAScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'DELIVERY ETA',
    },
  });
