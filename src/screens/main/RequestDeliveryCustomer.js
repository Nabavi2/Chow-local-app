import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Screen, Input, Button, MessageTerritoryItem} from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';
import { fetchAPI } from '~/core/utility';
import { showNotification, setAddress as setAddressdata, setAddressFull as setAddressFullAction } from '~/store/actions';
import { NavigationService } from '~/core/services';
import { DashedLine, AppText} from '../../components';

process.nextTick = setImmediate;
export const RequestDeliveryCustomerScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');  
  const orderId_Edit = useMemo(() => navigation.getParam('orderId'), []);
  const pickup_address = useMemo(() => navigation.getParam('pickup_address'), []);
  const dropoff_address = useMemo(() => navigation.getParam('dropoff_address'), []);  
  const delivery_request_Id = useMemo(() => navigation.getParam('delivery_request_Id'), []);
  const token = useSelector((state) => state.account.token);
  const dispatch = useDispatch();

  const saveDelivery = useCallback(() => {    
    setLoading(true);
    const formData = new FormData();
    formData.append("first_name", firstName);
    // formData.append("last_name", lastName);
    formData.append("phone", phone);
    // formData.append("email", email);
    formData.append('app', "seller");
    formData.append('delivery_request_id', delivery_request_Id);
    fetchAPI('/delivery_request/save_customer', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    .then((res) => {
      console.log("here!!!!!!!!!!!!",res.data);
      // NavigationService.navigate("RequestDeliveryDetail", {delivery_request_id: delivery_request_Id, delivery_fee_amount: res.data.delivery_fee_amount, tax_amount: res.data.tax_amount, total_amount: res.data.total_amount, pickup_address: pickup_address, dropoff_address: address})
      NavigationService.navigate("RequestDeliveryOutside1", {delivery_total_amount: res.data.total_amount, delivery_request_id: delivery_request_Id, pickup_address: pickup_address, dropoff_address: dropoff_address})
    })
    .catch((err) =>
      dispatch(
        showNotification({
          type: 'error',
          message: err.message,
        }),
      ),
    )
    .finally(() => setLoading(false));    
  },[dispatch,firstName, lastName, phone, email, delivery_request_Id, token]);

return (
  <Screen isLoading={isLoading}  keyboardAware={true} >
    <View style={styles.container}>
     <AppText style={styles.description}>Please enter the customer's info</AppText>
      <View>       
      <Input
        style={GlobalStyles.formControl}
        title="Name"
        placeholder="Enter first name"
        value={firstName}
        editable={true}
        onChange={(e) => setFirstName(e)}
      />     
      {/* <Input
        style={GlobalStyles.formControl}
        title="Last Name"
        placeholder={"Enter last name"}
        value={lastName}
        editable={true}
        onChange={(e) => setLastName(e)}
      /> */}
      <Input
        style={GlobalStyles.formControl}
        title="Phone #"
        placeholder="Enter a phone number"
        value={phone}
        keyboardType="number-pad"
        editable={true}
        onChange={(e) => setPhone(e)}
      />
      {/* <Input
        style={GlobalStyles.formControl}
        title="E-mail"
        placeholder="Enter a email address"
        value={email}
        editable={true}
        keyboardType="email-address"
        onChange={(e) => setEmail(e)}
      /> */}
      </View>
      
      <Button
          type="accent"
          style={{marginTop: 30,marginBottom:20}}
          fullWidth
          onClick={() => saveDelivery()}>
          CONTINUE
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
  option: {
    flex: 5,
    borderWidth: 0,
    backgroundColor: '#dedede',
    height: 50
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formHeading : {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 0,
    fontSize: 16
  },

  description: {
    fontSize: 15,
    textAlign: 'center',
    color: "#484848"
  },
});

RequestDeliveryCustomerScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'CUSTOMER',
    },
  });
