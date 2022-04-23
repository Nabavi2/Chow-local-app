import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Screen, Button, AppText} from '~/components';
import {MainNavigationOptions, GlobalStyles, Theme} from '~/styles';
import {fetchAPI} from '~/core/utility';
import {NavigationService} from '~/core/services';
import {showNotification, clearNotification} from '~/store/actions';
import {useClipboard} from '@react-native-community/clipboard';

export const SubscriptionActiveScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const [isLoading, setLoading] = useState(false);
  const territory_image = useMemo(
    () => navigation.getParam('territory_image'),
    [],
  );
  const territory_name = useMemo(
    () => navigation.getParam('territory_name'),
    [],
  );
  const subscription_has_card = useMemo(
    () => navigation.getParam('subscription_has_card'),
    [],
  );
  const subscription_current_month_is_paid = useMemo(
    () => navigation.getParam('subscription_current_month_is_paid'),
    [],
  );
  const subscription_card = useMemo(
    () => navigation.getParam('subscription_card'),
    [],
  );
  const subscription_url = useMemo(
    () => navigation.getParam('subscription_url'),
    [],
  );
  const [is_active, setStatus] = useState(navigation.getParam('is_active'));
  const subscription_fee_formatted_full = useMemo(
    () => navigation.getParam('subscription_fee_formatted_full'),
    [],
  );
  const territory_id = useMemo(() => navigation.getParam('territory_id'), []);
  const [copid, setString] = useClipboard();
  const [ordersCnt, setOrdersCnt] = useState();
  const [revenue, setRevenue] = useState();
  const [deliveriesCnt, setDeliveriesCnt] = useState();

  useEffect(() => {
    setLoading(true);
    fetchAPI(`/territory/stats?territory=${territory_id}&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setOrdersCnt(res.data.total_orders);
        setDeliveriesCnt(res.data.total_deliveries);
        setRevenue(
          res.data.total_revenue.substring(0, 1) +
            parseInt(res.data.total_revenue.substring(1)),
        );
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  }, []);

  const activateSubscription = useCallback(territory_id => {
    const formData = new FormData();
    formData.append('territory', territory_id);
    formData.append('app', 'seller');
    fetchAPI(`/territory_subscription/restart`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        setStatus('Active');
        dispatch(showNotification({type: 'success', message: res.message}));
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  });

  const cancelSubscription = useCallback(territory_id => {
    const formData = new FormData();
    formData.append('territory', territory_id);
    formData.append('app', 'seller');
    fetchAPI(`/territory_subscription/cancel`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        setStatus('Inactive');
        dispatch(showNotification({type: 'success', message: res.message}));
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  });
  return (
    <Screen hasList isLoading={isLoading} keyboardAware={true}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                territory_image ||
                'https://via.placeholder.com/450?text=Image%20is%20not%20available',
            }}
            style={styles.image_territory}
            resizeMode="cover"
          />
        </View>
        <AppText style={styles.territory_name}>{territory_name}</AppText>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.detailView}>
            <AppText
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 15,
              }}>
              {ordersCnt}
            </AppText>
            <AppText
              style={{
                fontSize: 9,
                textAlign: 'center',
                fontWeight: '300',
                marginTop: 5,
              }}>
              ORDERS
            </AppText>
          </View>
          <View style={{...styles.detailView, marginHorizontal: 10}}>
            <AppText
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 15,
              }}>
              {revenue}
            </AppText>
            <AppText
              style={{
                fontSize: 9,
                textAlign: 'center',
                fontWeight: '300',
                marginTop: 5,
              }}>
              REVENUE
            </AppText>
          </View>
          <View style={styles.detailView}>
            <AppText
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 15,
              }}>
              {deliveriesCnt}
            </AppText>
            <AppText
              style={{
                fontSize: 9,
                textAlign: 'center',
                fontWeight: '300',
                marginTop: 5,
              }}>
              DELIVERIES
            </AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 0}}>
          <View style={styles.detailView}>
            <AppText
              style={{
                fontSize: 9,
                textAlign: 'center',
                fontWeight: '300',
                marginTop: 15,
              }}>
              RESTAURANT SUBSCRIPTION FEE
            </AppText>
            <AppText
              style={{
                fontSize: 23,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 5,
              }}>
              {subscription_fee_formatted_full}
            </AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View
            style={
              is_active == 'Active'
                ? {...styles.detailView, backgroundColor: '#def7df'}
                : {...styles.detailView, backgroundColor: '#fdbfbf'}
            }>
            <AppText
              style={{
                fontSize: 9,
                textAlign: 'center',
                fontWeight: '300',
                marginTop: 15,
              }}>
              SUBSCRIPTION STATUS
            </AppText>
            <AppText
              style={
                is_active == 'Active'
                  ? {
                      fontSize: 23,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                      color: '#38d455',
                    }
                  : {
                      fontSize: 23,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 5,
                      color: '#ed0e26',
                    }
              }>
              {is_active}
            </AppText>
          </View>
        </View>
        <AppText style={styles.description}>
          {is_active != 'Active'
            ? subscription_current_month_is_paid == true
              ? 'You already paid for this month but your subscription is inactive'
              : 'Tap the button below to pay ' +
                subscription_fee_formatted_full +
                ' to activate your subscription'
            : 'Tap the button below to cancel your Chow Local subscription.'}
        </AppText>
        {is_active != 'Active' ? (
          subscription_has_card == true ? (
            <View>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: '#31D457',
                  paddingVertical: 5,
                  borderRadius: 3,
                }}
                fullWidth
                onPress={() => {
                  activateSubscription(territory_id);
                }}>
                <AppText
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {'RESTART SUBSCRIPTION'}
                </AppText>
                <AppText
                  style={{textAlign: 'center', color: 'white', fontSize: 15}}>
                  {subscription_card}
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginBottom: 10,
                  marginTop: 10,
                  backgroundColor: 'black',
                  paddingVertical: 5,
                  borderRadius: 3,
                }}
                fullWidth
                onPress={() => {
                  NavigationService.navigate('UpdateCreditCard', {
                    territory_id: territory_id,
                    payButton_text: subscription_fee_formatted_full,
                    action: setStatus,
                  });
                }}>
                <AppText
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {'RESTART SUBSCRIPTION'}
                </AppText>
                <AppText
                  style={{textAlign: 'center', color: 'white', fontSize: 14}}>
                  {'With A New Credit Card'}
                </AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              type="accent-green"
              style={{marginBottom: 10, marginTop: 20}}
              fullWidth
              onClick={() => {
                NavigationService.navigate('UpdateCreditCard', {
                  territory_id: territory_id,
                  payButton_text: subscription_fee_formatted_full,
                  action: setStatus,
                });
              }}>
              START SUBSCRIPTION
            </Button>
          )
        ) : (
          <Button
            type="accent"
            style={{marginBottom: 10, marginTop: 20}}
            fullWidth
            onClick={() => {
              cancelSubscription(territory_id);
            }}>
            CANCEL SUBSCRIPTION
          </Button>
        )}
        <Button
          type="bordered-dark"
          style={{marginBottom: 10, marginTop: 0}}
          fullWidth
          onClick={() => {
            setString(subscription_url);
          }}>
          COPY THIS LINK
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

  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
  },

  image_territory: {
    borderColor: '#333',
    borderWidth: 0.1,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },

  territory_name: {
    textAlign: 'center',
    width: '100%',
    fontSize: 17,
    marginBottom: 10,
    fontWeight: 'bold',
    marginTop: 10,
  },

  description: {
    textAlign: 'center',
    width: '100%',
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    marginVertical: 15,
  },

  detailView: {
    flex: 1,
    marginVertical: 5,
    backgroundColor: '#eeeeee',
    height: 80,
    flexDirection: 'column',
  },

  inputWrapper: {
    marginTop: 0,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 10,
  },
});

SubscriptionActiveScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
