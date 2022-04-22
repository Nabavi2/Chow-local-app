import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationService} from '~/core/services';
import {Screen, Input, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {showNotification, updatedETA, isUpdateStatus} from '~/store/actions';
import {fetchAPI} from '~/core/utility';
import moment from 'moment-timezone';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {updateStatus} from '../../store/actions';

export const RequestDeliveryDetailScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const is_update_status = useSelector(state => state.order.updated);
  const token = useSelector(state => state.account.token);
  const [isLoading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const orderId_Edit = useMemo(() => navigation.getParam('orderId'), []);
  const deliveryType = useMemo(() => navigation.getParam('deliveryType'), []);
  const territory = useMemo(() => navigation.getParam('territory'), []);
  const orderAmount = useMemo(() => navigation.getParam('orderAmount'), []);
  const orderAmountCustomer = useMemo(
    () => navigation.getParam('orderAmountCustomer'),
    [],
  );
  const payType = useMemo(() => navigation.getParam('payType'), []);
  const isPreOrder = useMemo(() => navigation.getParam('isPreOrder'), []);
  const tip = useMemo(() => navigation.getParam('tipAmount'), []);
  const terminal_required = useMemo(
    () => navigation.getParam('terminal_required'),
    [],
  );
  const delivery_request_id = useMemo(
    () => navigation.getParam('delivery_request_id'),
    [],
  );
  const accept = useMemo(() => navigation.getParam('accept'), []);
  const [instructions, setInstruction] = useState();
  const [instructionsLink, setInstructionLink] = useState();
  const instructionUpdated = useSelector(state => state.notification.updated);
  const customETA = useSelector(state => state.notification.ETATime);
  const [ETATime, setETATime] = useState('');
  const [ETAOtherIf, setETAOther] = useState(false);
  const [ETADateTimeIf, setETADateTimeIf] = useState(false);

  const [orderDate, setDate] = useState(new Date());
  const [preOrder, setPreOrder] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pre_order_date, setPreOrderDate] = useState('');
  const [pre_order_date_string, setPreOrderDateString] = useState('');
  const windowHeight = Dimensions.get('window').height;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate);
  };

  const setPreOrderData = useCallback(orderDate => {
    /*    const dateRegina = moment(orderDate).tz('America/Regina').format();
    const preOrderTime = new Date(dateRegina.substring(0,19)+".000Z");*/
    const dateRegina = orderDate;
    const preOrderTime = new Date(dateRegina);
    const second = new Date(dateRegina);
    second.setMinutes(second.getMinutes() + 30);

    console.log(
      'preorderdate',
      preOrderTime.toTimeString(),
      preOrderTime,
      moment(second).format('h:mm A'),
    );

    // const date = new Date();
    // console.log('preorderdate', orderDate, dateRegina, date.toLocaleString('en-US', {timeZone: 'America/Regina'}));

    var preOrderString =
      orderDate.toDateString().substring(0, 10) +
      ' (' +
      moment(dateRegina).format('h:mm A') +
      ' - ' +
      moment(second).format('h:mm A') +
      ')';
    //console.log("test@@@@@@@@@@@@@@@@@@@",preOrderTime.toISOString().substring(0,16).replace("T"," "),preOrderString);
    console.log(
      'test@@@@@@@@@@@@@@@@@@@',
      preOrderTime.toISOString().substring(0, 16).replace('T', ' '),
      preOrderString,
    );
    setPreOrderDate(
      preOrderTime.toISOString().substring(0, 16).replace('T', ' '),
    );
    setPreOrderDateString(preOrderString);
    setLoading(false);
    setShowTimePicker(false);
  });

  useEffect(() => {
    console.log('@@@@@@@@@@@@@@@@@@@@', orderId_Edit);
  }, []);

  useEffect(() => {
    // const dateRegina = moment(orderDate).tz('America/Regina').format();
    // const preOrderTime = new Date(dateRegina.substring(0,19)+".000Z");
    const preOrderTime = new Date(orderDate);
    //console.log("prer@@@@@@@@@@@@sdsdfsdfsdfsdfsf@@@@@@@@@", preOrderTime);
    setPreOrder(preOrderTime);
  }, [orderDate]);

  const MyCart = () => {
    return (
      <View
        style={{...styles.myCartscreen, top: 0}}
        onPress={() => {
          setShowTimePicker(false);
        }}>
        <View
          style={{
            height: 280,
            bottom: 0,
            right: 0,
            left: 0,
            top: windowHeight - 280,
            backgroundColor: 'white',
          }}>
          <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
            {Platform.OS == 'android' ? (
              <DatePicker
                style={{height: 150, flex: 4, marginTop: 15}}
                date={orderDate}
                minimumDate={new Date()}
                maximumDate={
                  new Date(new Date().setDate(new Date().getDate() + 6))
                }
                onDateChange={setDate}
                minuteInterval={15}
                androidVariant="iosClone"
              />
            ) : (
              <DateTimePicker
                style={{height: 150, flex: 4, marginTop: 15}}
                value={orderDate}
                minimumDate={new Date()}
                maximumDate={
                  new Date(new Date().setDate(new Date().getDate() + 6))
                }
                onChange={onChange}
                minuteInterval={15}
                display="spinner"
                mode="datetime"
              />
            )}
            {/* <AppText style={{justifyContent:"center", marginTop:80}}>~</AppText> */}
            {/* <DatePicker style={{height:150, flex:2,marginTop: 15}} mode="time" date={time} onDateChange={setTime} minuteInterval={15}  /> */}
          </View>
          <Button
            type="accent"
            style={styles.myCartButton}
            onClick={() => {
              setPreOrderData(preOrder);
            }}>
            Save
          </Button>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setInstruction(instructionUpdated);
    setInstructionLink('- Remove Special Instructions');
  }, [instructionUpdated]);

  useEffect(() => {
    saveETA(customETA);
    setETAOther(true);
  }, [customETA]);

  useEffect(() => {
    setETAOther(false);
    setInstruction('');
    setInstructionLink('+ Add Special Instructions');
  }, []);

  const saveETA = useCallback(time => {
    setETATime(time);
    if (accept == true && time && orderId_Edit != undefined) {
      const formData = new FormData();
      formData.append('app', 'seller');
      formData.append('order_id', orderId_Edit);
      formData.append('prep_time', time + ' minutes');
      fetchAPI(`/order/prep_time`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(res => {})
        .catch(err =>
          dispatch(showNotification({type: 'error', message: err.message})),
        )
        .finally(() => setLoading(false));
    }
  });

  const submitRequest = useCallback(() => {
    if (deliveryType == 'pickup') {
      if (token) {
        //the client should accept the order only if the ETA is set.
        console.log(
          '------------------order id test ------------',
          orderId_Edit,
          orderId,
        );
        setLoading(true);
        const formData = new FormData();
        formData.append('order_id', orderId_Edit);
        formData.append('app', 'seller');
        formData.append('delivery_request_by', 'territory');
        fetchAPI('/order/accept', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then(res => {
            dispatch(updateStatus('Accepted'));
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {activeTab: 1});
            NavigationService.navigate('OrderDetails', {orderId: orderId_Edit});
          })
          .catch(err => {
            dispatch(showNotification({type: 'error', message: err.message}));
          })
          .finally(() => setLoading(false));
      }
    } else {
      console.log('hereis my token', token);
      if (token) {
        if (territory == 'territory') {
          console.log('territory deliveries');
          if (orderId == '' && order_nr != '123') {
            //NavigationService.navigate("DeliveryETA",{orderId: orderId_Edit, delivery_request_id: res.data.delivery_request_id});
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {activeTab: 1});
            NavigationService.navigate('OrderDetails', {orderId: orderId_Edit});
          } else {
            //NavigationService.navigate("DeliveryETA",{ delivery_request_id: res.data.delivery_request_id});
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {activeTab: 1});
            //NavigationService.navigate("OrderDetails", {orderId: orderId, requestDelivery: true, delivery_request_id: delivery_request_id});
          }
        } else {
          var order_nr = '';

          setLoading(true);
          const formData = new FormData();
          console.log('###################@@@@@@@@@@@@@@#########', orderId);
          if (orderId_Edit != undefined) {
            formData.append('order_id', orderId_Edit);
          } else {
            order_nr = orderId == '' ? '123' : orderId;
            formData.append('order_nr', orderId == '' ? '123' : orderId);
            formData.append('delivery_request_id', delivery_request_id);
          }
          if (ETATime) {
            formData.append('delivery_date_notification_minutes', ETATime);
          }
          if (pre_order_date) {
            formData.append('delivery_date', pre_order_date);
          }
          if (pre_order_date_string) {
            formData.append('delivery_date_string', pre_order_date_string);
          }
          if (orderAmount) {
            formData.append('order_total_amount', orderAmount);
          }
          if (orderAmountCustomer) {
            formData.append('order_total_amount_customer', orderAmountCustomer);
          }
          if (payType) {
            formData.append('order_pay_type', payType);
          }
          if (isPreOrder) {
            console.log('this is pre order');
            //            formData.append("is_pre_order", isPreOrder);
          }
          if (terminal_required) {
            formData.append('terminal_required', terminal_required);
          }

          if (instructions) {
            formData.append('more_info', instructions);
          }
          if (tip != '' && tip != undefined) {
            formData.append('order_tip_amount', tip);
          }
          formData.append('app', 'seller');
          console.log('res.data ###########', formData);

          fetchAPI(`/delivery_request/submit`, {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          })
            .then(async res => {
              console.log('ETATIME----', ETATime);
              const formData = new FormData();
              formData.append('app', 'seller');
              formData.append(
                'delivery_request_id',
                res.data.delivery_request_id,
              );
              formData.append('delivery_eta', ETATime);
              await fetchAPI(`/delivery_request/save_eta`, {
                method: 'POST',
                headers: {
                  authorization: `Bearer ${token}`,
                },
                body: formData,
              })
                .then(res => {
                  console.log(
                    '---------current order id-----------',
                    orderId,
                    orderId_Edit,
                  );
                  if (orderId == '' && order_nr != '123') {
                    console.log('checking the order id', orderId);
                    //NavigationService.navigate("DeliveryETA",{orderId: orderId_Edit, delivery_request_id: res.data.delivery_request_id});
                    NavigationService.reset('Home');
                    NavigationService.navigate('PastOrders', {activeTab: 1});
                    NavigationService.navigate('OrderDetails', {
                      orderId: orderId_Edit,
                      requestDelivery: true,
                      delivery_request_id: res.data.delivery_request_id,
                    });
                  } else {
                    //NavigationService.navigate("DeliveryETA",{ delivery_request_id: res.data.delivery_request_id});
                    NavigationService.reset('Home');
                    NavigationService.navigate('PastOrders', {activeTab: 1});
                    //NavigationService.navigate("OrderDetails", {orderId: orderId, requestDelivery: true, delivery_request_id: delivery_request_id});
                  }
                })
                .catch(err =>
                  dispatch(
                    showNotification({type: 'error', message: err.message}),
                  ),
                )
                .finally(() => setLoading(false));
            })
            .catch(err =>
              dispatch(showNotification({type: 'error', message: err.message})),
            )
            .finally(() => setLoading(false));
        }
      }
    }
  });

  return (
    <Screen
      isLoading={isLoading}
      keyboardAware={true}
      stickyBottom={showTimePicker == true && <MyCart />}>
      <View style={styles.container}>
        {!orderId_Edit && (
          <AppText style={styles.number}>What are we delivering?</AppText>
        )}
        {orderId_Edit ? (
          <AppText style={styles.orderNumber}>
            Delivery Order # {orderId_Edit}
          </AppText>
        ) : (
          <Input
            style={GlobalStyles.formControl}
            title="Order #"
            placeholder="Enter order #"
            value={orderId}
            keyboardType="number-pad"
            onChange={e => setOrderId(e)}
          />
        )}
        <View style={GlobalStyles.formControl}>
          <AppText style={styles.number}>
            How long will it take to prepare?
          </AppText>
          <View style={{flexDirection: 'row'}}>
            <Button
              type={
                ETATime == '20' && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              style={{
                marginTop: 20,
                marginRight: 10,
                marginBottom: 10,
                flex: 1,
              }}
              fullWidth
              onClick={() => {
                saveETA('20');
                setETAOther(false);
                setETADateTimeIf(false);
                setPreOrderDateString('');
              }}>
              20 Min
            </Button>
            <Button
              type={
                ETATime == '25' && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              fullWidth
              style={{marginTop: 20, marginLeft: 10, marginBottom: 10, flex: 1}}
              onClick={() => {
                saveETA('25');
                setETAOther(false);
                setETADateTimeIf(false);
                setPreOrderDateString('');
              }}>
              25 Min
            </Button>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              type={
                ETATime == '30' && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              style={{marginRight: 10, marginBottom: 10, flex: 1}}
              fullWidth
              onClick={() => {
                saveETA('30');
                setETAOther(false);
                setETADateTimeIf(false);
                setPreOrderDateString('');
              }}>
              30 Min
            </Button>
            <Button
              type={
                ETATime == '35' && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              fullWidth
              style={{marginLeft: 10, marginBottom: 10, flex: 1}}
              onClick={() => {
                saveETA('35');
                setETAOther(false);
                setETADateTimeIf(false);
                setPreOrderDateString('');
              }}>
              35 Min
            </Button>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button
              type={
                ETATime == '40' && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              style={{marginRight: 10, marginBottom: 10, flex: 1}}
              fullWidth
              onClick={() => {
                saveETA('40');
                setETAOther(false);
                setETADateTimeIf(false);
                setPreOrderDateString('');
              }}>
              40 Min
            </Button>
            <Button
              type={
                ETAOtherIf == true && ETADateTimeIf == false
                  ? 'black'
                  : 'bordered-dark'
              }
              fullWidth
              style={{marginLeft: 10, marginBottom: 10, flex: 1}}
              onClick={() =>
                NavigationService.navigate('RequestDeliveryETAOther')
              }>
              Other
            </Button>
          </View>
          {deliveryType != 'pickup' && (
            <View>
              <Button
                type={ETADateTimeIf == true ? 'black' : 'bordered-dark'}
                style={{marginRight: 10, marginBottom: 10, flex: 1}}
                fullWidth
                onClick={() => {
                  setETADateTimeIf(true);
                  setShowTimePicker(true);
                  Keyboard.dismiss();
                }}>
                {pre_order_date_string == ''
                  ? 'Select Date/Time'
                  : pre_order_date_string}
              </Button>
            </View>
          )}
          <View>
            <TouchableOpacity
              activeOpacity={0.2}
              style={{width: '100%'}}
              onPress={() =>
                instructionsLink == '- Remove Special Instructions'
                  ? (setInstructionLink('+ Add Special Instructions'),
                    setInstruction(''))
                  : NavigationService.navigate('RequestDeliveryInstruction')
              }>
              <AppText style={styles.specialInstrunction}>
                {instructionsLink}
              </AppText>
            </TouchableOpacity>
            {instructions != '' && (
              <AppText style={styles.specialInstrunctionText} numberOfLines={2}>
                {instructions}
              </AppText>
            )}
          </View>
        </View>
        <Button
          type="accent"
          style={{marginTop: 30, marginBottom: 20}}
          fullWidth
          onClick={() => submitRequest()}>
          SET PREP TIME
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

  myCartButton: {
    marginHorizontal: 10,
    marginVertical: 20,
    position: 'absolute',
    right: 10,
    bottom: 30,
    left: 10,
  },

  myCartscreen: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
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

  specialInstrunction: {
    color: Theme.color.accentColor,
    fontSize: 15,
    paddingVertical: 10,
    textAlign: 'center',
  },

  specialInstrunctionText: {
    color: 'black',
    fontSize: 14,
    paddingVertical: 10,
    marginLeft: 0,
    marginTop: -15,
  },
});

RequestDeliveryDetailScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Details',
    },
  });
