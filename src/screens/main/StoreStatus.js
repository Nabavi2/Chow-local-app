import { View, StyleSheet } from 'react-native';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAPI } from '~/core/utility';
import { NavigationService } from '~/core/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Screen, Button, AppText } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import { showNotification, updateStatus, isUpdateStatus } from '~/store/actions';

export const StoreStatusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.account.token);
  const is_update_status = useSelector((state) => state.order.updated);  
  const territory_id = useMemo(() => navigation.getParam('territory_id'), []);
  const status = useMemo(() => navigation.getParam('status'), []);
  const force_closed = useMemo(() => navigation.getParam('force_closed'), []);
  const force_closed_till = useMemo(() => navigation.getParam('force_closed_till'), []);
  const [untilTime , setUntilTime] = useState(false);
  const [operational , setOperational] = useState(false);
  
  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: (
        <Icon size={40} color='black' name="menu" />
      ),
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAPI(`/territory?territory=${territory_id}&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then(async (res) => {
      console.log("TTTTTTTTTTTTT",res.data.territory.is_operational);
      setUntilTime(res.data.territory.next_day_operation_time);
      setOperational(res.data.territory.is_operational);
    })
    .catch((err) =>
    dispatch(showNotification({ type: 'error', message: err.message }))
    )
    .finally(() => setLoading(false));  
  }, []);

  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);

  const updateStoreStatus = useCallback((type) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('territory', territory_id);
    formData.append('app', "seller");
    if(type != 'indefinitely'){
      formData.append('until', "next_day_operation_time");
      console.log("here!");
    }
    
    fetchAPI(`/territory/close`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {        
        dispatch(isUpdateStatus(!is_update_status)); 
        NavigationService.goBack();
      })
      .catch((err) =>{
        dispatch(showNotification({ type: 'error', message: err.message }));
      })
      .finally(() => setLoading(false));
  }, [dispatch, token],
  );

  const openStore = useCallback(() => {
    setLoading(true);

    const formData = new FormData();
    formData.append('territory', territory_id);
    formData.append('app', "seller");

    fetchAPI(`/territory/open`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {        
        dispatch(isUpdateStatus(!is_update_status));        
        NavigationService.goBack();
      })
      .catch((err) =>{
        dispatch(showNotification({ type: 'error', message: err.message }));
      })
      .finally(() => setLoading(false));
  }, [dispatch, token],
  );

  return (
    <Screen hasList isLoading={isLoading}>      
        <View style={styles.container}>
          <AppText style={styles.heading_order}>CHANGE STATUS</AppText>
          <AppText style={styles.name}>
            Tap button below to change status to
          </AppText>
          {force_closed_till == null && operational && <Button
              type="bordered-dark"
              style={GlobalStyles.formControl}
              onClick={() => {updateStoreStatus(untilTime);}}>
              Closed until {untilTime}
            </Button>}
          {operational &&
            <Button
              type="bordered-dark"
              style={GlobalStyles.formControl}
              onClick={() => {updateStoreStatus("indefinitely");}}>
              Closed indefinitely
            </Button>}         
          {!operational && <Button
              type="bordered-dark"
              style={GlobalStyles.formControl}
              onClick={() => {openStore();}}>
              Open
          </Button>} 
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

  heading_order : {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    marginBottom :10,
    marginTop:0,
  },

  name: {
    fontSize: 16,
    textAlign: 'center',
    // textTransform: 'uppercase',
    color: "#333",
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

StoreStatusScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
