import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {
  Screen,
  SellerItem,
  Button,
  AppText,
  Tabs,
  LoadingGIF,
} from '~/components';
import {MainNavigationOptions, Theme} from '~/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {fetchAPI} from '~/core/utility';
import {NavigationService} from '~/core/services';
import {showNotification, clearNotification} from '~/store/actions';
import MoneySVG from '~/assets/images/money.svg';

export const StoreListScreen = ({navigation}) => {
  const explorer = useSelector(state => state.explorer);
  // const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [stores, setStores] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const is_update_status = useSelector(state => state.order.updated);
  const tabData = useMemo(() => {
    let tabData = [];

    tabData.push({
      title: 'Restaurant Status',
      content: (
        <View>
          {stores && stores.length > 0 ? (
            stores.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setLoading(true);
                  fetchAPI(`/territory?territory=${item.tid}&app=seller`, {
                    method: 'GET',
                    headers: {
                      authorization: `Bearer ${token}`,
                    },
                  })
                    .then(async res => {
                      if (
                        res.data.territory.subscription_is_active == false &&
                        res.data.territory.has_subscription == true &&
                        res.data.territory.subscription_current_month_is_paid ==
                          false
                      ) {
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
                                  PAYMENT REQUIRED
                                </AppText>
                                <AppText
                                  style={{
                                    fontSize: 15,
                                    color: 'white',
                                    textAlign: 'center',
                                    marginTop: 10,
                                  }}>
                                  Your Chow Local subscription for{' '}
                                  {res.data.territory.name} is currently
                                  inactive. Tap the button below to pay your{' '}
                                  {res.data.territory.subscription_type}{' '}
                                  subscription fee.
                                </AppText>
                                <Button
                                  type="accent-green"
                                  style={{marginBottom: 10, marginTop: 20}}
                                  fullWidth
                                  onClick={() => {
                                    dispatch(clearNotification());
                                    NavigationService.navigate(
                                      'SubscriptionActive',
                                      {
                                        territory_image:
                                          res.data.territory.app_image,
                                        territory_name: res.data.territory.name,
                                        subscription_fee_formatted_full:
                                          res.data.territory
                                            .subscription_fee_formatted_full,
                                        is_active:
                                          res.data.territory
                                            .subscription_is_active == true
                                            ? 'Active'
                                            : 'Inactive',
                                        territory_id: item.tid,
                                        subscription_has_card:
                                          res.data.territory
                                            .subscription_has_card,
                                        subscription_current_month_is_paid:
                                          res.data.territory
                                            .subscription_current_month_is_paid,
                                        subscription_card:
                                          res.data.territory.subscription_card,
                                        subscription_url:
                                          res.data.territory.subscription_url,
                                      },
                                    );
                                  }}>
                                  ACTIVATE SUBSCRIPTION
                                </Button>
                                <Button
                                  type="white"
                                  fullWidth
                                  onClick={() => {
                                    dispatch(clearNotification());
                                  }}>
                                  Go Back
                                </Button>
                              </>
                            ),
                          }),
                        );
                      } else {
                        NavigationService.navigate('StoreStatus', {
                          territory_id: item.tid,
                          status: item.active,
                          force_closed: item.force_closed,
                          force_closed_till: item.force_closed_till,
                        });
                      }
                    })
                    .catch(err =>
                      dispatch(
                        showNotification({type: 'error', message: err.message}),
                      ),
                    )
                    .finally(() => setLoading(false));
                }}>
                <SellerItem seller={item}></SellerItem>
              </TouchableOpacity>
            ))
          ) : stores === false ? (
            <>
              <LoadingGIF />
            </>
          ) : (
            <>
              <AppText style={styles.heading}>NO RESTAURANT</AppText>
            </>
          )}
        </View>
      ),
    });
    return tabData;
  }, [stores]);

  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: <Icon size={40} color="black" name="menu" />,
    });
  }, []);

  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);

  useEffect(() => {
    if (token) {
      fetchAPI('/territories/active_and_inactive?app=seller', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          setStores(res.data.territories);
        })
        .catch(err =>
          dispatch(showNotification({type: 'error', message: err.message})),
        );
    }
  }, [token, is_update_status]);

  // const lastAddress = useMemo(
  //   () =>
  //     {
  //       if(order || explorer){
  //           if(order && order.address && order.address){
  //             return order.address
  //           }else if(explorer.address){
  //             return explorer.address
  //           }else{
  //             return false;
  //           }
  //       }else{
  //         return false;
  //       }
  //     },
  //   [order,explorer],
  // );

  return (
    <Screen hasList isLoading={isLoading}>
      <View style={styles.container}>
        <AppText style={styles.heading_order}>RESTUARANT STATUS</AppText>
        <Tabs tabs={tabData} setPage={() => {}} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom + 20,
    paddingHorizontal: 20,
  },

  heading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 0,
  },

  heading_order: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 20,
    marginBottom: 20,
    marginTop: 0,
  },

  subheading: {
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    width: '70%',
  },

  button: {
    marginBottom: 10,
  },

  list: {},
});

StoreListScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
      headerTintColors: 'black',
    },
  });
