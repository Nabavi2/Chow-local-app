import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { Screen, SellerItem, SubscriptionItem, Button, AppText, Tabs, LoadingGIF} from '~/components';
import { MainNavigationOptions, Theme } from '~/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAPI } from '~/core/utility';
import { NavigationService } from '~/core/services';
import { showNotification, setTerritoryType, clearNotification} from '~/store/actions';
export const MySubscriptionScreen = ({navigation}) => {
  const explorer = useSelector((state) => state.explorer);
  // const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [stores, setStores] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);
  const is_update_status = useSelector((state) => state.order.updated);  
  const tabData = useMemo(() => {
    let tabData = [];
    
    tabData.push({
      title: 'My Subscriptions',
      content: (
        <View>
           {stores && stores.length > 0 ? (
            stores.map((item, index)=> (
                <TouchableOpacity
                    onPress={() => {
                      setLoading(true);
                      fetchAPI(`/territory?territory=${item.tid}&app=seller`, {
                        method: 'GET',
                        headers: {
                          authorization: `Bearer ${token}`,
                        },
                      })
                        .then(async (res) => {
                          NavigationService.navigate("SubscriptionActive", {
                            territory_image: res.data.territory.app_image,
                            territory_name: res.data.territory.name,
                            subscription_fee_formatted_full: res.data.territory.subscription_fee_formatted_full,
                            is_active: res.data.territory.subscription_is_active == true ? "Active" : "Inactive",
                            territory_id: item.tid,
                            subscription_has_card: res.data.territory.subscription_has_card,
                            subscription_current_month_is_paid : res.data.territory.subscription_current_month_is_paid,
                            subscription_card: res.data.territory.subscription_card,
                            subscription_url: res.data.territory.subscription_url
                          });
                    })
                    .catch((err) =>
                    dispatch(showNotification({ type: 'error', message: err.message }))
                  )
                  .finally(() => setLoading(false));  
                  }}>
                <SellerItem seller={item} subscription={true} ></SellerItem>
                </TouchableOpacity>
             ))            
            ) : 
        stores === false ? (
            <>
              <LoadingGIF />
            </>
        ) :
        <>
        </>
      }
      </View>
      ),
    });
    return tabData;
  }, [stores]); 

  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: (
        <Icon size={40} color='black' name="menu" />
      ),
    });
  }, []);

  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);

  useEffect(() => {    
    if(token){
      fetchAPI('/territories/active_and_inactive?app=seller', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setStores(res.data.territories.filter((item) => item.has_subscription == true));
      })
      .catch((err) =>
        dispatch(showNotification({ type: 'error', message: err.message })),
      )    
    }
  },[token,is_update_status]); 

return (
    <Screen hasList isLoading={isLoading} >
      <View style={styles.container}>
      <AppText style={styles.heading_order}>My Subscriptions</AppText>
      <Tabs tabs={tabData} setPage={()=>{}} />      
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
    paddingHorizontal: 20
  },

  heading : {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 0
  },

  heading_order : {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 20,
    marginBottom :20,
    marginTop:0,
  },

  subheading : {
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    width: '70%'
  },

  button: {
    marginBottom: 10
  },

  list: {},
});

MySubscriptionScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
      headerTintColors: 'black',
    },
  });
