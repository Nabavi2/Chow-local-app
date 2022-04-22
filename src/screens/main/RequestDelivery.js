import React,{ useEffect, useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationService } from '~/core/services';
import { Screen, Button, AppText, StoredAddress } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import { signOut, showNotification, clearNotification } from '~/store/actions';
import { fetchAPI } from '~/core/utility';
import MoneySVG from '~/assets/images/money.svg';
export const RequestDeliveryScreen = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token); 
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setLoading] = useState(false);

  
  const setRequesttDelivery = useCallback((territory_id, address) => {  
    setLoading(true);
    fetchAPI(`/territory?territory=${territory_id}&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        console.log("TTTTTTTTTTTTT", res.data.territory);
        if(res.data.territory.subscription_is_active == false && res.data.territory.has_subscription == true && res.data.territory.subscription_current_month_is_paid == false){
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
                   NO SUBSCRIPTION
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 15,
                      color: 'white',                          
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    Your Chow Local subscription for {res.data.territory.name} is currently inactive.
                  </AppText>
                  <Button
                    type="accent-green"
                    style={{ marginBottom: 10, marginTop: 20 }}
                    fullWidth
                    onClick={() => {
                      dispatch(clearNotification());
                      NavigationService.navigate("SubscriptionActive", {
                        territory_image: res.data.territory.app_image,
                        territory_name: res.data.territory.name,
                        subscription_fee_formatted_full: res.data.territory.subscription_fee_formatted_full,
                        is_active: res.data.territory.subscription_is_active == true ? "Active" : "Inactive",
                        territory_id: territory_id,
                        subscription_has_card: res.data.territory.subscription_has_card,
                        subscription_current_month_is_paid : res.data.territory.subscription_current_month_is_paid,
                        subscription_card: res.data.territory.subscription_card,
                        subscription_url: res.data.territory.subscription_url
                      });
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
          )          
        } else {
          const formData = new FormData();
          formData.append("territory", territory_id); 
          formData.append("app", "seller");
          await fetchAPI(`/delivery_request/save_set_territory`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          })
          .then((res) => {
            console.log("tes@@@@@@@", res.data.delivery_request_id);
    
            NavigationService.navigate("RequestDeliveryAddress", {pickup_Address: address, delivery_request_Id: res.data.delivery_request_id,});
          })
          .catch((err) =>
            dispatch(showNotification({ type: 'error', message: err.message }))
          )
          .finally(() => setLoading(false));
        }
      })
      .catch((err) =>
        dispatch(showNotification({ type: 'error', message: err.message }))
      )
      .finally(() => setLoading(false));  
  });

  useEffect(() => {
    if (token) {      
      setLoading(true);
      fetchAPI(`/territories/get_address_select?app=seller`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
         setAddresses(res.data.territories);
          console.log("ssssssssssssssssssssssssssssssssssssssss", res.data.territories);
          if(res.data.territories.length == 1)
          {
            setRequesttDelivery(res.data.territories[0].tid, res.data.territories[0].warehouse_address);
          }
          // if (order && order.address_id) {
          //   const currentAddress = res.data.addresses.find(
          //     (item) => item.id == order.address_id,
          //   );
          //   if (currentAddress && mapRef.current) {              
          //     mapRef.current.setAddressText(currentAddress.full_address);
          //     setAddress(currentAddress.full_address);
          //   }
          // }       
        })
        .catch((err) =>
          dispatch(showNotification({ type: 'error', message: err.message })),
        )
        .finally(() => setLoading(false));
    }
  }, [dispatch]);
  return (
    <Screen hasList  isLoading={isLoading} >     
      <View style={styles.container}>
        <AppText style={styles.number}>
          What is the pick up address?
        </AppText>
        <FlatList
              style={styles.list}
              scrollEnabled={true}
              data={addresses}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.address}
                  activeOpacity={0.8}
                  onPress={() => {
                    setRequesttDelivery(item.tid, item.warehouse_address);                    
                  }}>
                  <View style={styles.imageContainer}>
                    <Image
                        source={{ 
                                uri: 
                                    item.app_image ||
                                    'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                                }}
                        style={styles.image}
                    />
                  </View>
                  <View style={styles.addressWrapper}>
                    <StoredAddress address={item} />
                  </View>
                  <TouchableOpacity
                    onPress={(ev) => {
                      setRequesttDelivery(item.tid, item.warehouse_address);                      
                    }}>
                    <Icon size={20} color={'#333'} name="chevron-right" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />         
        {/* <Button
          type="bordered-dark"
          style={GlobalStyles.formControl}
          onClick={() => {
            NavigationService.navigate('Splash');
            dispatch(signOut());
          }}>
          Chow Local Order
        </Button>
        <Button
          type="bordered-dark"
          style={GlobalStyles.formControl}
          onClick={() => {
            NavigationService.navigate('RequestDeliveryAddress');
            dispatch(signOut());
          }}>
          Outside Order
        </Button> */}
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
    color: "#484848"
  },

  address: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,

    backgroundColor: '#e8e8e8',
  },

  iconWrapper: {
    width: 30,
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

RequestDeliveryScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Request Delivery',
    },
  });
