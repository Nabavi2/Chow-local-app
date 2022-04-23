import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Screen, Input, Button, LocationSelector, Selector} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {fetchAPI} from '~/core/utility';
import {
  showNotification,
  setAddress as setAddressdata,
  setAddressFull as setAddressFullAction,
} from '~/store/actions';
import {NavigationService} from '~/core/services';
import {DashedLine, AppText} from '../../components';
import {Constants} from '~/core/constant';
import {Config} from '~/core/config';
import Dialog from 'react-native-dialog';
import parseAddress from 'parse-address-string';

process.nextTick = setImmediate;

export const RequestDeliveryAddressScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [buildType, setBuildType] = useState('House');
  const [street, setStreet] = useState('');
  const [unit, setUnit] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [note, setNote] = useState('');
  const [onceComplete, setCompleted] = useState(false);
  const [address, setAddress] = useState('');
  const [addressFull, setAddressFull] = useState(null);
  const [country, setCountry] = useState('');
  const pickup_address = useMemo(
    () => navigation.getParam('pickup_Address'),
    [],
  );
  const delivery_request_Id = useMemo(
    () => navigation.getParam('delivery_request_Id'),
    [],
  );
  const mapRef = useRef();
  const token = useSelector(state => state.account.token);
  const dispatch = useDispatch();

  const saveDelivery = useCallback(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('drop_off_city', city);
    formData.append('drop_off_province', province);
    formData.append('drop_off_zipcode', postalCode);
    formData.append('drop_off_country', country);
    formData.append('drop_off_apartment_nr', unit);
    formData.append('drop_off_type', buildType);
    formData.append('drop_off__instructions', note);
    formData.append('drop_off_address', street);
    formData.append('from_device', Platform.OS);
    formData.append('app', 'seller');
    formData.append('delivery_request_id', delivery_request_Id);
    fetchAPI('/delivery_request/save_drop_off_address', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        NavigationService.navigate('RequestDeliveryCustomer', {
          delivery_request_Id: delivery_request_Id,
          pickup_address: pickup_address,
          dropoff_address: address,
        });
      })
      .catch(err =>
        dispatch(
          showNotification({
            type: 'error',
            message: err.message,
          }),
        ),
      )
      .finally(() => setLoading(false));
  }, [
    dispatch,
    address,
    addressFull,
    street,
    city,
    province,
    country,
    postalCode,
    unit,
    businessName,
    buildType,
    note,
  ]);

  // useEffect(() => {
  //   setLoading(true);
  //   GeoCoder.init(Config.googleAPIKey);
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 15000,
  //   })
  //     .then(() => {})
  //     // .catch((err) =>
  //     // dispatch(showNotification({ type: 'error', message: err.message })),
  //     // )
  //     .finally(() => setLoading(false));
  // }, []);

  return (
    <Screen isLoading={isLoading} hasList keyboardAware={true}>
      <View style={styles.container}>
        <AppText style={styles.description}>
          Please enter drop off location address
        </AppText>
        <View style={[styles.flexRowBetween, GlobalStyles.formControl]}>
          {
            <Selector
              style={styles.option}
              typeSelector="Building"
              value={buildType}
              title="Building"
              header="Building"
              options={Constants.buildingTypes.map(item => ({
                label: item,
                value: item,
              }))}
              placeholder="Select A Type"
              onChange={setBuildType}
            />
          }
        </View>
        <View>
          {buildType === 'Business' && (
            <Input
              style={GlobalStyles.formControl}
              title="Business Name"
              placeholder="Enter your business name"
              value={businessName}
              onChange={e => setBusinessName(e)}
            />
          )}
        </View>
        <View>
          <LocationSelector
            mapRef={mapRef}
            value={address}
            //country={country != 'other' ? country : undefined}
            onChange={data => {
              parseAddress(data.formatted_address, (err, addressObj) => {
                err = err;
                console.log(addressObj);
                setStreet(addressObj.street_address1);
                setCity(addressObj.city);
                setProvince(addressObj.state);
                setPostalCode(addressObj.postal_code);
                setCountry(addressObj.country);
                addressObj.street_address1
                  ? mapRef.current?.setAddressText(addressObj.street_address1)
                  : mapRef.current?.setAddressText('');
              });
              setCompleted(true);
              setAddressFull(data);
              setAddress(data.formatted_address);
            }}
            style={{...GlobalStyles.formControl, backgroundColor: '#dedede'}}
            actionHandler={() => {
              //setDeliveryAddress(address, 'address', addressFull);
            }}
            // selectCurrentLocation={selectCurrentLocation}
          />
        </View>
        {(buildType === 'House' ||
          buildType === 'Business' ||
          buildType === 'Apartment' ||
          buildType === 'Office Building') &&
          onceComplete == true && (
            <Input
              style={GlobalStyles.formControl}
              title="Unit#"
              placeholder="Enter your street address"
              value={unit}
              onChange={e => setUnit(e)}
            />
          )}
        {onceComplete == true && (
          <View>
            <Input
              style={GlobalStyles.formControl}
              title="City"
              placeholder="Enter your city name"
              value={city}
              editable={true}
              onChange={e => setCity(e)}
            />
            <Input
              style={GlobalStyles.formControl}
              title={country == 'USA' ? 'State' : 'Province'}
              placeholder={
                country == 'USA'
                  ? 'Enter your state name'
                  : 'Enter your province name'
              }
              value={province}
              editable={true}
              onChange={e => setProvince(e)}
            />
            <Input
              style={GlobalStyles.formControl}
              title={country == 'USA' ? 'ZIP Code' : 'Postal Code'}
              placeholder={
                country == 'USA'
                  ? 'Enter your ZIP code'
                  : 'Enter your postal code'
              }
              value={postalCode}
              editable={true}
              onChange={e => setPostalCode(e)}
            />
            <Input
              style={GlobalStyles.formControl}
              title="Country"
              placeholder="Enter your Country"
              value={country}
              editable={true}
              onChange={e => setCountry(e)}
            />
          </View>
        )}
        <Button
          type="accent"
          style={{marginTop: 30, marginBottom: 20}}
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
    height: 50,
  },
  flexRowBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formHeading: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    marginTop: 0,
    fontSize: 16,
  },

  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#484848',
  },
});

RequestDeliveryAddressScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Drop off',
    },
  });
