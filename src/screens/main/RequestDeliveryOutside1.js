import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Switch,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {NavigationService} from '~/core/services';
import {Screen, Input, Button, AppText} from '~/components';
import {GlobalStyles, MainNavigationOptions, Theme} from '~/styles';
import {CheckBox} from 'react-native-elements';
import {showNotification, clearNotification} from '~/store/actions';
import MoneySVG from '~/assets/images/money.svg';
import {fetchAPI} from '~/core/utility';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const RequestDeliveryOutside1Screen = ({navigation}) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const [isLoading, setLoading] = useState(false);
  const [orderAmountIf, setOrderAmountIf] = useState('');
  const [orderAmount, setOrderAmount] = useState(false);
  const [tipAmountIf, setTipAmountIf] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [isTerminalEnabled, setTerminalIsEnabled] = useState(false);
  const [terminal_surcharge_amount, setTerminal_surcharge_amount] =
    useState('');
  const [showTip, setShowTip] = useState(false);
  const [debitCardEnable, setDriverDebitCard] = useState(false);
  // const [orderAmountCustomer, setOrderAmountCustomer] = useState(false);
  const orderId_Edit = useMemo(() => navigation.getParam('orderId'), []);
  const delivery_request_id = useMemo(
    () => navigation.getParam('delivery_request_id'),
    [],
  );
  //const delivery_total_amount = useMemo(() => navigation.getParam('delivery_total_amount'), []);
  const [delivery_total_amount, setDelivery_total_amount] = useState(
    navigation.getParam('delivery_total_amount'),
    [],
  );

  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('delivery_request_id', delivery_request_id);
    formData.append('required', 1);
    formData.append('app', 'seller');
    fetchAPI(`/delivery_request/save_terminal`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async res => {
        setDriverDebitCard(
          res.data.drivers_have_credit_debit_card_payment_terminal,
        );
        if (res.data.terminal_surcharge_amount != '') {
          setTerminal_surcharge_amount(
            res.data.terminal_surcharge_amount.substring(0, 1) +
              parseFloat(
                res.data.terminal_surcharge_amount.substring(1),
              ).toFixed(2),
          );
        } else {
          setTerminal_surcharge_amount('');
        }
        const formData = new FormData();
        formData.append('delivery_request_id', delivery_request_id);
        formData.append('required', 0);
        formData.append('app', 'seller');
        await fetchAPI(`/delivery_request/save_terminal`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then(async res => {
          })
          .catch(err =>
            dispatch(showNotification({type: 'error', message: err.message})),
          )
          .finally(() => setLoading(false));
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  }, []);

  const toggleSwitch = () => {
    setTerminalIsEnabled(previousState => !previousState);
    setLoading(true);
    const formData = new FormData();
    formData.append('delivery_request_id', delivery_request_id);
    formData.append('required', isTerminalEnabled == true ? 0 : 1);
    formData.append('app', 'seller');
    fetchAPI(`/delivery_request/save_terminal`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        setDelivery_total_amount(res.data.total_amount);

        if (res.data.terminal_surcharge_amount != '') {
          setTerminal_surcharge_amount(
            res.data.terminal_surcharge_amount.substring(0, 1) +
              parseFloat(
                res.data.terminal_surcharge_amount.substring(1),
              ).toFixed(2),
          );
        } else {
          setTerminal_surcharge_amount('');
        }
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  };

  const requestContinue = useCallback(() => {
    if (orderAmountIf == '1') {
      NavigationService.navigate('RequestDeliveryDetail', {
        isPreOrder: true,
        payType: 'paid-online',
        delivery_request_id: delivery_request_id,
        tipAmount: tipAmount,
      });
    } else {
      NavigationService.navigate('RequestDeliveryDetail', {
        isPreOrder: true,
        payType: 'pending',
        orderAmount: orderAmount,
        delivery_request_id: delivery_request_id,
        tipAmount: tipAmount,
        terminal_required: isTerminalEnabled == true ? 1 : 0,
      });
    }
  });

  const showAlertNotification = useCallback(() => {
    setOrderAmount(false);
    dispatch(
      showNotification({
        type: 'fullScreen',
        autoHide: false,
        options: {align: 'right'},
        message: (
          <>
            <View style={styles.avatarContainer}>
              <Icon size={100} color="#e9472a" name="alert-outline" />
            </View>
            <AppText
              style={{
                fontSize: 16,
                color: 'white',
                textAlign: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}>
              ERROR
            </AppText>
            <AppText
              style={{
                fontSize: 12,
                color: 'white',
                textAlign: 'center',
                marginTop: 10,
                marginBottom: 20,
              }}>
              The amount the customer must pay should be at least{' '}
              {delivery_total_amount} greater than the amount the restaurant
              gets to cover the driver's delivery fee.
            </AppText>
            <Button
              type="white"
              fullWidth
              onClick={() => {
                dispatch(clearNotification());
              }}>
              GO BACK
            </Button>
          </>
        ),
      }),
    );
  }, [delivery_total_amount]);

  return (
    <Screen isLoading={isLoading} keyboardAware={true}>
      <View style={styles.container}>
        {!orderId_Edit && showTip == false && (
          <AppText style={styles.number}>
            Has the customer already paid?
          </AppText>
        )}
        {!orderId_Edit && orderAmountIf == '1' && showTip == true && (
          <AppText style={styles.number}>Did the customer leave a tip?</AppText>
        )}
        {!orderId_Edit && showTip == false && (
          <View style={styles.radio}>
            <CheckBox
              containerStyle={styles.radioBackground}
              title="Yes"
              checkedColor={Theme.color.accentColor}
              checked={orderAmountIf == '1' ? true : false}
              checkedIcon="dot-circle-o"
              onPress={() => {
                setOrderAmountIf('1');
              }}
              uncheckedIcon="circle-o"
            />
            <CheckBox
              containerStyle={styles.radioBackground}
              title="No, driver must collect"
              checkedColor={Theme.color.accentColor}
              checked={orderAmountIf == '2' ? true : false}
              checkedIcon="dot-circle-o"
              onPress={() => {
                setOrderAmountIf('2');
              }}
              uncheckedIcon="circle-o"
            />
          </View>
        )}
        {!orderId_Edit && orderAmountIf == '1' && showTip == true && (
          <View style={styles.radio}>
            <CheckBox
              containerStyle={styles.radioBackground}
              title="Yes"
              checkedColor={Theme.color.accentColor}
              checked={tipAmountIf == '1' ? true : false}
              checkedIcon="dot-circle-o"
              onPress={() => {
                setTipAmountIf('1');
              }}
              uncheckedIcon="circle-o"
            />
            <CheckBox
              containerStyle={styles.radioBackground}
              title="No"
              checkedColor={Theme.color.accentColor}
              checked={tipAmountIf == '2' ? true : false}
              checkedIcon="dot-circle-o"
              onPress={() => {
                setTipAmountIf('2');
              }}
              uncheckedIcon="circle-o"
            />
          </View>
        )}
        {!orderId_Edit && orderAmountIf == '2' && (
          <View style={{marginBottom: 10}}>
            <Input
              titleType="money"
              style={{marginBottom: 0}}
              title={delivery_total_amount.substring(0, 1) || '$'}
              placeholder="Order total incl. delivery fee"
              value={orderAmount}
              onEndEditing={() => {
                if (orderAmount != '') {
                  const delivery_t_amount = delivery_total_amount.substring(1);
                  if (parseFloat(orderAmount - delivery_t_amount) < 0) {
                    showAlertNotification();
                  }
                }
              }}
              keyboardType="email-address"
              onChange={e => setOrderAmount(e)}
            />
            {debitCardEnable == false && (
              <View>
                <View
                  style={
                    isTerminalEnabled
                      ? styles.viewTerminalEnabled
                      : styles.viewTerminal
                  }>
                  <View style={{alignItems: 'center', marginLeft: 10}}>
                    {isTerminalEnabled ? (
                      <Image
                        source={require('~/assets/images/terminal.png')}
                        style={styles.image_terminal_enable}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={require('~/assets/images/terminal.png')}
                        style={styles.image_terminal}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <View style={{flexDirection: 'column', flex: 10}}>
                    <AppText
                      style={
                        isTerminalEnabled
                          ? {
                              fontSize: 13,
                              fontWeight: 'bold',
                              width: '100%',
                              paddingLeft: 20,
                              color: '#2fd34f',
                            }
                          : {
                              fontSize: 13,
                              fontWeight: 'bold',
                              width: '100%',
                              paddingLeft: 20,
                              color: '#787878',
                            }
                      }>
                      Terminal Required?
                    </AppText>
                    {terminal_surcharge_amount != '' && (
                      <AppText
                        style={{
                          fontSize: 11,
                          width: '100%',
                          paddingLeft: 20,
                          color: '#484848',
                        }}>
                        +{terminal_surcharge_amount} delivery surcharge
                      </AppText>
                    )}
                  </View>
                  <View>
                    <Switch
                      style={{marginRight: 20}}
                      trackColor={{false: '#373536', true: '#2fd34f'}}
                      thumbColor={isTerminalEnabled ? '#f4f3f4' : '#f4f3f4'}
                      ios_backgroundColor={{false: '#373536', true: '#2fd34f'}}
                      onValueChange={toggleSwitch}
                      value={isTerminalEnabled}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
        {!orderId_Edit &&
          orderAmountIf == '1' &&
          showTip == true &&
          tipAmountIf == '1' && (
            <View>
              <Input
                titleType="money"
                style={{marginBottom: 10}}
                title={
                  delivery_total_amount != ''
                    ? delivery_total_amount.substring(0, 1)
                    : '$'
                }
                placeholder="Tip amount"
                value={tipAmount}
                keyboardType="email-address"
                onChange={e => setTipAmount(e)}
              />
            </View>
          )}
        <Button
          type="accent"
          style={{marginTop: 10, marginBottom: 20}}
          fullWidth
          onClick={() => {
            const delivery_t_amount = delivery_total_amount.substring(1);
            if (orderAmountIf == '2') {
              if (parseFloat(orderAmount - delivery_t_amount) < 0) {
                showAlertNotification();
              } else {
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
                          {isTerminalEnabled
                            ? 'PAY THE DRIVER ' + delivery_total_amount
                            : 'DRIVER WILL PAY YOU ' +
                              delivery_total_amount.substring(0, 1) +
                              (orderAmount - delivery_t_amount).toFixed(2)}
                        </AppText>
                        <AppText
                          style={{
                            fontSize: 15,
                            color: 'white',
                            textAlign: 'center',
                            marginTop: 10,
                          }}>
                          {isTerminalEnabled
                            ? 'The driver will collect ' +
                              delivery_total_amount.substring(0, 1) +
                              orderAmount +
                              ' from the customer using your payment terminal. When the driver arrives pay them ' +
                              delivery_total_amount +
                              '. This includes a ' +
                              terminal_surcharge_amount +
                              ' surcharge.'
                            : 'The driver will pay you ' +
                              delivery_total_amount.substring(0, 1) +
                              (orderAmount - delivery_t_amount).toFixed(2) +
                              ' when they pick up the order. Then, the driver will collect ' +
                              delivery_total_amount.substring(0, 1) +
                              orderAmount +
                              " from the customer. The driver's delivery fee is " +
                              delivery_total_amount}
                        </AppText>
                        <Button
                          type="accent-green"
                          style={{marginBottom: 10, marginTop: 20}}
                          fullWidth
                          onClick={() => {
                            dispatch(clearNotification());
                            requestContinue();
                          }}>
                          CONFIRM
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
              }
            } else {
              if (tipAmountIf == '') {
                setShowTip(true);
              } else if (tipAmountIf == '1') {
                if (tipAmount == '') {
                  dispatch(
                    showNotification({
                      type: 'error',
                      message: 'Please input the tip amount!',
                    }),
                  );
                } else {
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
                            PAY THE DRIVER{' '}
                            {delivery_total_amount.substring(0, 1) +
                              (
                                parseFloat(tipAmount) +
                                parseFloat(delivery_t_amount)
                              ).toFixed(2)}
                          </AppText>
                          <AppText
                            style={{
                              fontSize: 15,
                              color: 'white',
                              textAlign: 'center',
                              marginTop: 10,
                            }}>
                            The driver will collect a delivery fee of{' '}
                            {delivery_total_amount.substring(0, 1) +
                              delivery_t_amount}
                            , plus a{' '}
                            {delivery_total_amount.substring(0, 1) + tipAmount}{' '}
                            tip from your when they arrive.
                          </AppText>
                          <Button
                            type="accent-green"
                            style={{marginBottom: 10, marginTop: 20}}
                            fullWidth
                            onClick={() => {
                              dispatch(clearNotification());
                              requestContinue();
                            }}>
                            CONTINUE
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
                }
              } else if (tipAmountIf == '2') {
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
                          PAY THE DRIVER{' '}
                          {delivery_total_amount.substring(0, 1) +
                            delivery_t_amount}
                        </AppText>
                        <AppText
                          style={{
                            fontSize: 15,
                            color: 'white',
                            textAlign: 'center',
                            marginTop: 10,
                          }}>
                          The driver will collect a delivery fee of{' '}
                          {delivery_total_amount.substring(0, 1) +
                            delivery_t_amount}
                          , from your when they arrive.
                        </AppText>
                        <Button
                          type="accent-green"
                          style={{marginBottom: 10, marginTop: 20}}
                          fullWidth
                          onClick={() => {
                            dispatch(clearNotification());
                            requestContinue();
                          }}>
                          CONTINUE
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
              }
              //requestContinue();
            }
          }}>
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
    fontSize: 14,
    marginBottom: 3,
    fontWeight: '300',
    color: '#000000',
  },

  guide: {
    fontSize: 9,
    marginBottom: 3,
    fontWeight: '100',
    color: 'red',
  },

  radio: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
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

  viewTerminal: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewTerminalEnabled: {
    flexDirection: 'row',
    backgroundColor: '#e5f9e7',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image_terminal: {
    width: 45,
    height: 45,
    opacity: 0.5,
  },

  image_terminal_enable: {
    width: 45,
    height: 45,
  },

  addressWrapper: {
    flex: 1,
  },
});

RequestDeliveryOutside1Screen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Details',
    },
  });
