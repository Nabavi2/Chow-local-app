import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  Screen,
  OrderItem,
  MessageTerritoryItem,
  RequestItem,
  AppText,
  Button,
  Tabs,
  LoadingGIF,
} from '~/components';
import {MainNavigationOptions, Theme, GlobalStyles} from '~/styles';
import LinearGradient from 'react-native-linear-gradient';
import {Platform} from 'react-native';
import {fetchAPI, isEmptyString, getTimeAgo, getTimeLeft} from '~/core/utility';
import {NavigationService} from '~/core/services';
import {
  showNotification,
  setMessageTerritories,
  setTerritory,
  clearNotification,
  setPastOrders,
  enterMessageRoom,
  setUnreadMsgCnt,
  setNewOrdersCnt,
  setPreOrdersCnt,
  updateStatus,
} from '~/store/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OrderWhiteSVG from '~/assets/images/orderwhite.svg';
import OrderBlackeSVG from '~/assets/images/orderblack.svg';
import ChatSVG from '~/assets/images/chat.svg';
import ChatBlackSVG from '~/assets/images/chatblack.svg';
import DeliverySVG from '~/assets/images/delivery-icon.svg';
import DeliveryWhiteSVG from '~/assets/images/delivery-icon-white.svg';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundTimer from 'react-native-background-timer';
import messaging from '@react-native-firebase/messaging';
import {playSound} from '~/core/utility';
import {DeviceInfo, getDeviceId, getModel} from 'react-native-device-info';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import RNFetchBlob from 'rn-fetch-blob';
import MoneySVG from '~/assets/images/money.svg';
import {
  InterfaceType,
  StarConnectionSettings,
  StarXpandCommand,
  StarPrinter,
} from 'react-native-star-io10';

export const PastOrdersScreen = ({navigation}) => {
  const fs = RNFetchBlob.fs;
  const printAsText = useSelector(state => state.account.printAsText);
  const isAutoEnabled = useSelector(state => state.account.autoPrinterEnable);
  const [isLoading, setLoading] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  const pastOrders = useSelector(state => state.order.pastOrders);
  const dispatch = useDispatch();
  const token = useSelector(state => state.account.token);
  const unread = useSelector(state => state.order.unreadMsgCnt);
  const enterMessageRoomValue = useSelector(
    state => state.notification.enterMessageRoom,
  );
  const territoryList = useSelector(state => state.order.messageTerritories);
  const tabNumberFromHome = useMemo(() => navigation.getParam('activeTab'), []);
  const [activeTab, setActiveTab] = useState(0);
  const [page_order, setPage_order] = useState(0);
  const [page_msg, setPage_msg] = useState(0);
  const [page_request, setPage_request] = useState(0);
  const [totalPages_order, setTotalPages_order] = useState(0);
  const [totalPages_msg, setTotalPages_msg] = useState(0);
  const [totalPages_request, setTotalPages_request] = useState(0);
  const [updated_deliveries_total, setUpdated_Deliveries_Total] = useState(0);
  const [updated_orders_total, setUpdated_Orders_Total] = useState(0);
  const [newOrders, setNewOrders] = useState(false);
  const [requests, setRecentRequest] = useState(false);
  const [timerForSound, setCurrentTime] = useState('');
  const type = useMemo(() => navigation.getParam('type'), []);
  const pre_orders_Cnt = useSelector(state => state.order.preOrderCnt);
  const new_Order_Cnt = useSelector(state => state.order.newOrderCnt);
  const selectedPrinterIdentifier = useSelector(
    state => state.account.selectedPrinterAddress,
  );
  const listCnt = parseInt(Dimensions.get('window').height / 50);
  const test = getModel();
  const iOSBottom =
    Platform.OS === 'ios' &&
    (test === 'iPhone 11' ||
    test === 'iPhone 11 Pro' ||
    test === 'iPhone 12 Pro' ||
    test === 'iPhone 12'
      ? true
      : false);

  var Sound = require('react-native-sound');

  const openMenu = useCallback(() => {
    activeTab != 2 ? setRefresh(!isRefresh) : navigation.navigate('MyAccount');
  }, [activeTab]);

  useEffect(() => {
    if (type == 'new-message') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [type]);

  useEffect(() => {
    setActiveTab(tabNumberFromHome);
  }, [tabNumberFromHome]);

  //If new orders comes it print automatically if set and add to pastorders list
  useEffect(() => {
    console.log('image_url', newOrders.image_url, newOrders, isAutoEnabled);
    if (
      isAutoEnabled == true &&
      newOrders != false &&
      selectedPrinterIdentifier != null
    ) {
      if (printAsText == true) {
        RNFetchBlob.config({fileCache: true})
          .fetch('GET', newOrders.txt_url)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            return resp.text();
          })
          .then(base64Data => {
            // here's base64 encoded image
            try {
              BluetoothEscposPrinter.printText(base64Data, {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1,
              });
            } catch (e) {
              alert(e.message || 'ERROR');
            }
          });
      } else {
        let imagePath = null;
        RNFetchBlob.config({fileCache: true})
          .fetch('GET', newOrders.image_url)
          // the image is now dowloaded to device's storage
          .then(resp => {
            // the image path you can use it directly with Image component
            imagePath = resp.path();
            return resp.readFile('base64');
          })
          .then(async base64Data => {
            // here's base64 encoded image
            var settings = new StarConnectionSettings();
            settings.interfaceType = InterfaceType.Bluetooth;
            settings.identifier = selectedPrinterIdentifier;
            var printer = new StarPrinter(settings);
            try {
              var builder = new StarXpandCommand.StarXpandCommandBuilder();
              builder.addDocument(
                new StarXpandCommand.DocumentBuilder().addPrinter(
                  new StarXpandCommand.PrinterBuilder()
                    .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
                    .actionPrintImage(
                      new StarXpandCommand.Printer.ImageParameter(
                        base64Data,
                        570,
                      ),
                    )
                    .actionCut(StarXpandCommand.Printer.CutType.Partial),
                ),
              );
              var commands = await builder.getCommands();
              await printer.open();
              await printer.print(commands);
              console.log(`Success`);
            } catch (error) {
              console.log(`Error: ${String(error)}`);
            } finally {
              await printer.close();
              await printer.dispose();
            }
            return fs.unlink(imagePath);
          });
      }
    }

    if (pastOrders) {
      var flag = 0;
      pastOrders.map((item, index) => {
        if (newOrders) {
          if (item.order_id == newOrders.order_id) {
            flag = 1;
          }
        }
      });
      if (flag != 1) {
        dispatch(setPastOrders([newOrders, ...pastOrders]));
      }
    }
  }, [newOrders]);

  useEffect(() => {
    Sound.setCategory('Playback');
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async remoteMessage => {
        //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      },
    );

    return unsubscribe;
  });

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      if (remoteMessage.data.app_message_type == 'new-message') {
        NavigationService.reset('Home');
        NavigationService.navigate('PastOrders', {type: 'new-message'});
      } else if (remoteMessage.data.app_message_type == 'new-order') {
        NavigationService.reset('Home');
        NavigationService.navigate('PastOrders', {type: 'new-order'});
      } else if (
        remoteMessage.data.app_message_type == 'delivery-request-accepted'
      ) {
        NavigationService.reset('Home');
        NavigationService.navigate('PastOrders');
        NavigationService.navigate('OrderDetails', {
          data: remoteMessage.data,
          orderId: remoteMessage.data.app_order_id,
        });
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          if (remoteMessage.data.app_message_type == 'new-message') {
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {type: 'new-message'});
            //setInitialRoute("PastOrders", {type:'new-message'}); // e.g. "Settings"
          } else if (remoteMessage.data.app_message_type == 'new-order') {
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {type: 'new-order'});
            //setInitialRoute("PastOrders", {type:'new-order'});
          } else if (
            remoteMessage.data.app_message_type == 'delivery-request-accepted'
          ) {
            NavigationService.reset('Home');
            NavigationService.navigate('PastOrders', {activeTab: 0});
            NavigationService.navigate('OrderDetails', {
              data: remoteMessage.data,
              orderId: remoteMessage.data.app_order_id,
            });
          }
        }
      });

    Sound.setCategory('Playback');
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.data.app_message_type == 'delivery-request-accepted') {
        NavigationService.reset('Home');
        NavigationService.navigate('PastOrders', {activeTab: 0});
        if (remoteMessage.data.app_order_id != '0') {
          NavigationService.navigate('OrderDetails', {
            data: remoteMessage.data,
            orderId: remoteMessage.data.app_order_id,
          });
        } else {
          dispatch(
            showNotification({
              type: 'fullScreen',
              autoHide: false,
              options: {align: 'right'},
              message: (
                <>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{
                        uri:
                          remoteMessage.data.app_driver_avatar ||
                          'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                      }}
                      // source={require('~/assets/images/delivered.png')}
                      style={styles.image_request}
                      resizeMode="cover"
                    />
                  </View>
                  <AppText
                    style={{
                      fontSize: 16,
                      color: 'white',
                      textAlign: 'center',
                      marginTop: 10,
                      fontWeight: 'bold',
                    }}>
                    {remoteMessage.data.app_driver_name}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 12,
                      color: 'white',
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {remoteMessage.data.app_driver_name} has accepted your
                    delivery request # {remoteMessage.data.app_order_nr}
                  </AppText>
                  <Button
                    type="white"
                    style={{marginBottom: 10, marginTop: 20}}
                    fullWidth
                    onClick={() => {
                      Linking.canOpenURL(
                        `tel:${remoteMessage.data.app_driver_phone}`,
                      ).then(supported => {
                        if (supported) {
                          Linking.openURL(
                            `tel:${remoteMessage.data.app_driver_phone}`,
                          );
                        } else {
                          dispatch(
                            showNotification({
                              type: 'error',
                              message: `Don't know how to open URI: ${remoteMessage.data.app_driver_phone}`,
                            }),
                          );
                        }
                      });
                    }}>
                    <AppText
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}>
                      CALL {remoteMessage.data.app_driver_phone}
                    </AppText>
                  </Button>
                  <Button
                    type="white"
                    style={{marginBottom: 10}}
                    fullWidth
                    onClick={() => {
                      dispatch(
                        setTerritory(
                          JSON.parse(remoteMessage.data.app_territory),
                        ),
                      );
                      NavigationService.navigate('MessageRoom', {
                        token: token,
                        user: remoteMessage.data.app_driver_id,
                        user_image: remoteMessage.data.app_driver_avatar,
                        user_name: remoteMessage.data.app_driver_name,
                      });
                      dispatch(clearNotification());
                    }}>
                    SEND A MESSAGE
                  </Button>
                  <Button
                    type="bordered-light"
                    fullWidth
                    onClick={() => {
                      dispatch(clearNotification());
                    }}>
                    EXIT
                  </Button>
                </>
              ),
            }),
          );
        }
      }
      const milliseconds = remoteMessage.sentTime;
      const dateObject = new Date(milliseconds);
      if (
        remoteMessage.data.app_message_type == 'new-message' &&
        activeTab == 0
      ) {
        if (Platform.OS === 'ios') {
          playSound('message');
          PushNotificationIOS.addNotificationRequest({
            id: 'default',
            title: 'New Message',
            subtitle: 'New message received',
            body: remoteMessage.notification.body,
            sound: 'message.mp3',
            isSilent: true,
          });
        } else {
          playSound('message');
          PushNotification.localNotification({
            channelId: 'default',
            autoCancel: true,
            bigText: 'New message received!',
            subText: dateObject.toLocaleTimeString() + ' New message received',
            title: 'New messages',
            message: remoteMessage.notification.body,
            vibrate: true,
            vibration: 300,
            playSound: false,
            soundName: 'message.mp3',
          });
        }
      } else if (
        remoteMessage.data.app_message_type == 'new-order' &&
        activeTab == 1
      ) {
        if (Platform.OS === 'ios') {
          playSound('order');
          PushNotificationIOS.addNotificationRequest({
            id: 'default',
            title: 'New Order',
            subtitle: ' New order received',
            body: remoteMessage.notification.body,
            sound: 'alert.mp3',
            isSilent: true,
          });
        } else {
          playSound('order');
          PushNotification.localNotification({
            channelId: 'default',
            autoCancel: true,
            bigText: 'New Order received!',
            subText: dateObject.toLocaleTimeString() + ' New order received',
            title: 'New order received!',
            message: remoteMessage.notification.body,
            vibrate: true,
            vibration: 300,
            playSound: false,
            soundName: 'alert.mp3',
          });
        }
      }
    });
    // return unsubscribe;
  }, []);

  useEffect(() => {
    if (new_Order_Cnt > 0) {
      playSound('order');
    }
    if (unread > 0) {
      playSound('message');
    }
  }, [timerForSound, new_Order_Cnt, unread]);

  const shouldUpdateOrders = async () => {
    const formData = new FormData();
    formData.append('app', 'seller');
    formData.append('status', 'new');
    await fetchAPI('/orders', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        console.log('hereismytestresponse11', res.data.orders);
        res.data.orders.map(order => {
          console.log(
            'submit_date',
            order.submit_date,
            getTimeLeft(order.submit_date),
          );
          if (
            getTimeLeft(order.submit_date) >= 15 &&
            order.status_name === 'New' &&
            order.is_pre_order == false
          ) {
            console.log('get time left11');
            const formData = new FormData();
            formData.append('order_id', order.order_id);
            formData.append('app', 'seller');
            formData.append('reason_type', 'too-busy');
            fetchAPI('/order/reject', {
              method: 'POST',
              headers: {
                authorization: `Bearer ${token}`,
              },
              body: formData,
            })
              .then(r => {
                dispatch(updateStatus('Rejected'));
              })
              .catch(err => {
                dispatch(
                  showNotification({type: 'error', message: err.message}),
                );
              })
              .finally(() => {});
          }
        });
      })
      .catch(err => {});
  };

  useEffect(() => {
    shouldUpdateOrders();
    fetchAPI(`/refresh?app=seller&last_time_checked=`, {
      method: 'Get',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        dispatch(setNewOrdersCnt(res.data.new_orders_total));
        dispatch(setPreOrdersCnt(res.data.pre_orders_total));
      })
      .catch(
        err => {}, /// dispatch(showNotification({ type: 'error', message: err.message })),
      )
      .finally(() => setLoading(false));

    BackgroundTimer.stopBackgroundTimer();
    var last_time_checked = '';
    Sound.setCategory('Playback');

    BackgroundTimer.runBackgroundTimer(() => {
      shouldUpdateOrders();
      setCurrentTime(last_time_checked);
      setUpdated_Deliveries_Total(0);
      setUpdated_Orders_Total(0);
      if (token) {
        fetchAPI(`/refresh?app=seller&last_time_checked=${last_time_checked}`, {
          method: 'Get',
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
          .then(async res => {
            dispatch(setUnreadMsgCnt(res.data.messages_unopened_total));
            if (res.data.updated_messages_unopened_total > 0) {
              dispatch(enterMessageRoom(true));
              dispatch(enterMessageRoom(false));
            }

            setUpdated_Deliveries_Total(res.data.updated_deliveries_total);
            setUpdated_Orders_Total(res.data.updated_orders_total);

            dispatch(setNewOrdersCnt(res.data.new_orders_total));

            if (res.data.updated_orders_total > 0) {
              const formData = new FormData();
              formData.append('app', 'seller');
              formData.append('last_order_date', last_time_checked);
              await fetchAPI('/orders/last_activity', {
                method: 'POST',
                headers: {
                  authorization: `Bearer ${token}`,
                },
                body: formData,
              })
                .then(res => {
                  if (res.data.orders.length > 0) {
                    res.data.orders.map((item, index) => {
                      setNewOrders(item);
                    });
                  }
                })
                .catch(
                  err => {}, ////dispatch(showNotification({ type: 'error', message: err.message })),
                );
            }
            last_time_checked = res.data.last_time_checked;
            dispatch(setPreOrdersCnt(res.data.pre_orders_total));
          })
          .catch(
            err => {}, /// dispatch(showNotification({ type: 'error', message: err.message })),
          )
          .finally(() => setLoading(false));
      }
    }, 10000);
    // return () => {BackgroundTimer.stopBackgroundTimer();};
  }, [isRefresh]);

  // Delivery Requests update in real Time
  useEffect(() => {
    if (activeTab == 1 && updated_deliveries_total > 0) {
      if (token) {
        fetchAPI(
          `/deliveries?app=seller&page=0&size=${(page_request + 1) * listCnt}`,
          {
            method: 'GET',
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )
          .then(res => {
            setRecentRequest(false);
            setRecentRequest(
              res.data.deliveries.filter(item => item.status_name != 'Pending'),
            );
          })
          .catch(err => {});
      }
    }
  }, [page_request, activeTab, updated_deliveries_total]);

  useEffect(() => {
    let timer;
    if (activeTab == 1) {
      timer = setInterval(() => {
        if (token) {
          fetchAPI(
            `/deliveries?app=seller&page=0&size=${
              (page_request + 1) * listCnt
            }`,
            {
              method: 'GET',
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          )
            .then(res => {
              setRecentRequest(false);
              setRecentRequest(
                res.data.deliveries.filter(
                  item => item.status_name != 'Pending',
                ),
              );
            })
            .catch(err => {});
        }
      }, 60000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [page_request, activeTab]);

  useEffect(() => {
    let timer;
    if (activeTab == 0) {
      timer = setInterval(() => {
        if (token) {
          const formData = new FormData();
          formData.append('app', 'seller');
          formData.append('page', 0);
          formData.append('size', (page_order + 1) * listCnt);
          fetchAPI('/orders', {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          })
            .then(res => {
              dispatch(setPastOrders(false));
              dispatch(
                setPastOrders(
                  res.data.orders.filter(item => item.status_name != 'Error'),
                ),
              );
            })
            .catch(err => {});
        }
      }, 59000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [dispatch, page_order, activeTab]);

  useEffect(() => {
    if (activeTab == 0 && updated_orders_total > 0) {
      if (token) {
        const formData = new FormData();
        formData.append('app', 'seller');
        formData.append('page', 0);
        formData.append('size', (page_order + 1) * listCnt);
        fetchAPI('/orders', {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then(res => {
            dispatch(setPastOrders(false));
            dispatch(
              setPastOrders(
                res.data.orders.filter(item => item.status_name != 'Error'),
              ),
            );
          })
          .catch(err => {});
      }
    }
  }, [dispatch, page_order, activeTab, updated_orders_total]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener('register', token => {});
      PushNotificationIOS.requestPermissions().then(perms =>
        console.log(perms),
      );
    }
    if (token) {
      const formData = new FormData();
      formData.append('app', 'seller');
      formData.append('page', page_order);
      formData.append('size', listCnt);
      fetchAPI('/orders', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then(async res => {
          console.log('111@@@@!!!111');
          setTotalPages_order(res.data.total_pages);
          //console.log("page order why ????????",res.data.orders.filter((item) => item.status_name != ""));
          if (page_order > 0) {
            dispatch(
              setPastOrders([
                ...pastOrders,
                ...res.data.orders.filter(item => item.status_name != 'Error'),
              ]),
            );
          } else {
            dispatch(
              setPastOrders(
                res.data.orders.filter(item => item.status_name != 'Error'),
              ),
            );
          }
          if (
            res.data.orders.filter(item => item.status_name != 'Error').length <
            10
          ) {
            if (page_order < res.data.total_pages - 1) {
              if (activeTab == 0) {
                console.log('here!!!!!!!!!!!!!!!!!!!');
                setPage_order(page_order + 1);
              }
            }
          }
        })
        .catch(err =>
          dispatch(showNotification({type: 'error', message: err.message})),
        )
        .finally(() => setLoading(false));
    }
  }, [dispatch, page_order, token]);

  useEffect(() => {
    var total_badge = 0;
    if (pastOrders) {
      pastOrders.map((item, index) => {
        if (item.is_new && item.is_new == true) {
          total_badge = total_badge + 1;
        }
      });
      if (Platform.OS === 'ios') {
        if (unread != '' && unread != undefined) {
          total_badge = total_badge + parseInt(unread);
          PushNotificationIOS.setApplicationIconBadgeNumber(total_badge);
        } else {
          PushNotificationIOS.setApplicationIconBadgeNumber(total_badge);
        }
      }
    }
  }, [unread, pastOrders]);

  useEffect(() => {
    if (token) {
      console.log('I cam calling too!!!');
      fetchAPI(`/messages/list?size=${listCnt}&page=${page_msg}&app=seller`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          dispatch(setMessageTerritories(res.data.chats));
          setTotalPages_msg(res.data.total_pages);
          if (page_msg > 0) {
            dispatch(
              setMessageTerritories([...territoryList, ...res.data.chats]),
            );
          } else {
            dispatch(setMessageTerritories(res.data.chats));
          }
        })
        .catch(err =>
          dispatch(showNotification({type: 'error', message: err.message})),
        );
    }
  }, [dispatch, page_msg, enterMessageRoomValue, isRefresh]);

  //Get Request Deliveries
  useEffect(() => {
    if (token) {
      fetchAPI(`/deliveries?app=seller&page=${page_request}&size=${listCnt}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          setTotalPages_request(res.data.total_pages);
          if (page_request > 0) {
            setRecentRequest([
              ...requests,
              ...res.data.deliveries.filter(
                item => item.status_name != 'Pending',
              ),
            ]);
          } else {
            setRecentRequest(
              res.data.deliveries.filter(item => item.status_name != 'Pending'),
            );
          }
        })
        .catch(err =>
          dispatch(showNotification({type: 'error', message: err.message})),
        );
    }
  }, [page_request, isRefresh]);

  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle:
        activeTab != 2 ? (
          <Icon size={25} color="black" name="sync" />
        ) : (
          <Icon size={30} color="black" name="menu" />
        ),
    });
  }, [activeTab]);

  const showAcceptedMessage = useCallback(item => {
    dispatch(
      showNotification({
        type: 'fullScreen',
        autoHide: false,
        options: {align: 'right'},
        message: (
          <>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri:
                    item.driver_avatar ||
                    'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                }}
                // source={require('~/assets/images/delivered.png')}
                style={styles.image_request}
                resizeMode="cover"
              />
            </View>
            <AppText
              style={{
                fontSize: 16,
                color: 'white',
                textAlign: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}>
              {item.driver_name}
            </AppText>
            {item.status_slug == 'accepted' && (
              <AppText
                style={{
                  fontSize: 12,
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                {item.driver_first_name} has accepted your delivery request
              </AppText>
            )}
            <Button
              type="white"
              style={{marginBottom: 10, marginTop: 20}}
              fullWidth
              onClick={() => {
                Linking.canOpenURL(`tel:${item.driver_phone}`).then(
                  supported => {
                    if (supported) {
                      Linking.openURL(`tel:${item.driver_phone}`);
                    } else {
                      dispatch(
                        showNotification({
                          type: 'error',
                          message: `Don't know how to open URI: ${item.driver_phone}`,
                        }),
                      );
                    }
                  },
                );
              }}>
              <AppText
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}>
                CALL {item.driver_phone}
              </AppText>
            </Button>
            <Button
              type="white"
              style={{marginBottom: 10}}
              fullWidth
              onClick={() => {
                dispatch(setTerritory(item.territory));
                NavigationService.navigate('MessageRoom', {
                  token: token,
                  user: item.driver_uuid,
                  user_image: item.driver_avatar,
                  user_name: item.driver_first_name,
                });
                dispatch(clearNotification());
              }}>
              SEND A MESSAGE
            </Button>
            <Button
              type="bordered-light"
              fullWidth
              onClick={() => {
                dispatch(clearNotification());
              }}>
              EXIT
            </Button>
          </>
        ),
      }),
    );
  });

  const loadMore = useCallback((page, totalPages, activeIndex) => {
    console.log('___------------------', page, totalPages);
    if (page < totalPages - 1) {
      if (activeIndex == 0) {
        setPage_order(page + 1);
      } else if (activeIndex == 1) {
        setPage_request(page + 1);
      } else if (activeIndex == 2) {
        setPage_msg(page + 1);
      }
    }
  });

  const onOrderItemClicked = (item, index) => {
    setLoading(true);
    fetchAPI(`/territory?territory=${item.territory.tid}&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (
          res.data.territory.subscription_is_active == false &&
          res.data.territory.has_subscription == true &&
          res.data.territory.subscription_current_month_is_paid == false
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
                    NO SUBSCRIPTION
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 15,
                      color: 'white',
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    Your Chow Local subscription for {res.data.territory.name}{' '}
                    is currently inactive.
                  </AppText>
                  <Button
                    type="accent-green"
                    style={{marginBottom: 10, marginTop: 20}}
                    fullWidth
                    onClick={() => {
                      dispatch(clearNotification());
                      NavigationService.navigate('SubscriptionActive', {
                        territory_image: res.data.territory.app_image,
                        territory_name: res.data.territory.name,
                        subscription_fee_formatted_full:
                          res.data.territory.subscription_fee_formatted_full,
                        is_active:
                          res.data.territory.subscription_is_active == true
                            ? 'Active'
                            : 'Inactive',
                        territory_id: item.territory.tid,
                        subscription_has_card:
                          res.data.territory.subscription_has_card,
                        subscription_current_month_is_paid:
                          res.data.territory.subscription_current_month_is_paid,
                        subscription_card: res.data.territory.subscription_card,
                        subscription_url: res.data.territory.subscription_url,
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
          );
        } else {
          NavigationService.navigate('OrderDetails', {
            orderId: item.order_id,
            index: index,
          });
        }
      })
      .catch(err =>
        dispatch(showNotification({type: 'error', message: err.message})),
      )
      .finally(() => setLoading(false));
  };

  const tabData = useMemo(() => {
    let tabData = [];
    tabData.push({
      content: (
        <View>
          {pastOrders && pastOrders.length > 0 ? (
            pastOrders.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  onOrderItemClicked(item, index);
                }}>
                <OrderItem
                  order={item}
                  time_ago={String(getTimeAgo(item.submit_date))}></OrderItem>
              </TouchableOpacity>
            ))
          ) : pastOrders === false ? (
            <>
              <LoadingGIF />
            </>
          ) : (
            <>
              <AppText style={styles.heading}>YOU HAVE NO PAST ORDERS</AppText>
              <AppText style={styles.subheading}>
                Once a buyer complete an order you'll see it here.
              </AppText>
            </>
          )}
        </View>
      ),
    });

    tabData.push({
      content: (
        <View>
          {requests && requests.length > 0 ? (
            requests.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  //if(item.status_slug == 'accepted'){
                  showAcceptedMessage(item);
                  // }
                }}>
                <RequestItem
                  order={item}
                  time_ago={String(
                    getTimeAgo(item.date_created),
                  )}></RequestItem>
              </TouchableOpacity>
            ))
          ) : requests === false ? (
            <>
              <LoadingGIF />
            </>
          ) : (
            <>
              <AppText style={styles.subheaddingRequest}>
                Got an order outside of Chow Local that {'\n'} needs to be
                delivered?
              </AppText>
            </>
          )}
        </View>
      ),
    });

    tabData.push({
      content: (
        <View>
          {territoryList && territoryList.length > 0 ? (
            territoryList.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  dispatch(enterMessageRoom(false));
                  dispatch(setTerritory(item.territory));
                  NavigationService.navigate('MessageRoom', {
                    token: token,
                    user: item.uuid,
                    user_image: item.user_image,
                    user_name: item.user_name,
                    index: index,
                  });
                }}>
                <MessageTerritoryItem
                  key={index}
                  message={item.last_message}
                  created={item.last_message_date}
                  user_image={item.user_image}
                  territory_title={
                    isEmptyString(item.chat_name)
                      ? item.user_phone
                      : item.chat_name
                  }
                  unread={item.total_unread_messages}
                  is_new={item.is_new}
                />
              </TouchableOpacity>
            ))
          ) : territoryList === false ? (
            <>
              <LoadingGIF />
            </>
          ) : (
            <>
              <AppText style={styles.heading}>YOU HAVE NO MESSAGES.</AppText>
            </>
          )}
        </View>
      ),
    });

    return tabData;
  }, [pastOrders, territoryList, requests]);

  const MyCart = () => {
    return (
      <View style={{flexDirection: 'column', backgroundColor: 'white'}}>
        <View style={styles.tabView}>
          {activeTab == 0 ? (
            <TouchableOpacity
              style={
                iOSBottom == true ? styles.myCartButtoniOS : styles.myCartButton
              }
              onPress={() => setActiveTab(0)}>
              <View style={styles.bottomTab}>
                <OrderBlackeSVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle}>Orders</AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                iOSBottom == true
                  ? styles.myCartButtoniOS_clicked
                  : styles.myCartButton_clicked
              }
              onPress={() => setActiveTab(0)}>
              <View style={styles.bottomTab}>
                <OrderWhiteSVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle_clicked}>Orders</AppText>
              </View>
            </TouchableOpacity>
          )}
          {activeTab == 1 ? (
            <TouchableOpacity
              style={
                iOSBottom == true ? styles.myCartButtoniOS : styles.myCartButton
              }
              onPress={() => setActiveTab(1)}>
              <View style={styles.bottomTab}>
                <DeliverySVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle}>Requests</AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                iOSBottom == true
                  ? styles.myCartButtoniOS_clicked
                  : styles.myCartButton_clicked
              }
              onPress={() => setActiveTab(1)}>
              <View style={styles.bottomTab}>
                <DeliveryWhiteSVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle_clicked}>
                  Requests
                </AppText>
              </View>
            </TouchableOpacity>
          )}
          {activeTab == 2 ? (
            <TouchableOpacity
              style={
                iOSBottom == true ? styles.myCartButtoniOS : styles.myCartButton
              }
              onPress={() => setActiveTab(2)}>
              <View style={styles.bottomTab}>
                <ChatBlackSVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle}>
                  Inbox{' '}
                  {unread > 0 && (
                    <AppText style={styles.unreadDot}> {unread} </AppText>
                  )}
                </AppText>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={
                iOSBottom == true
                  ? styles.myCartButtoniOS_clicked
                  : styles.myCartButton_clicked
              }
              onPress={() => setActiveTab(2)}>
              <View style={styles.bottomTab}>
                <ChatSVG
                  style={{flex: 2, marginLeft: 2, marginTop: 2}}
                  height={25}
                  width={25}
                />
                <AppText style={styles.menuButtonTitle_clicked}>
                  Inbox{' '}
                  {unread > 0 && (
                    <AppText style={styles.unreadDot}> {unread} </AppText>
                  )}
                </AppText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Screen hasList isLoading={isLoading} stickyBottom={<MyCart />}>
      <View style={styles.container}>
        {activeTab == 0 ? (
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.heading_order}>ORDERS </AppText>
            {pre_orders_Cnt != false && (
              <TouchableOpacity
                onPress={() => NavigationService.navigate('PreOrders')}>
                <AppText style={styles.heading_pre_order}>
                  {pre_orders_Cnt}{' '}
                  {pre_orders_Cnt == 1 ? 'Pre-order' : 'Pre-orders'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        ) : activeTab == 1 ? (
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.heading_order}>MY DELIVERY HISTORY</AppText>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <AppText style={styles.heading_order}>MESSAGES</AppText>
          </View>
        )}
        {activeTab == 1 && (
          <View>
            <View style={styles.req_delivery_Btn}>
              <Button
                type="accent"
                style={{flex: 1, marginBottom: 20}}
                onClick={() => {
                  NavigationService.navigate('RequestDelivery');
                }}>
                REQUEST DELIVERY
              </Button>
            </View>
          </View>
        )}

        <Tabs
          tabs={tabData}
          activeTab={activeTab}
          setPage={() => {
            activeTab == 0
              ? loadMore(page_order, totalPages_order, activeTab)
              : activeTab == 1
              ? loadMore(page_request, totalPages_request, activeTab)
              : loadMore(page_msg, totalPages_msg, activeTab);
          }}
        />
      </View>

      <LinearGradient
        colors={['#FFFFFF00', '#ffffffff']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.layout.screenPaddingTop,
    // paddingBottom: Theme.layout.screenPaddingBottom,
    paddingHorizontal: 20,
    marginBottom: 50,
  },

  logoWrapper: {
    marginTop: 15,
    height: 0,
    position: 'absolute',
    top: 0,
    width: '20%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoWrapper_android: {
    marginTop: 30,
    height: 0,
    position: 'absolute',
    top: 0,
    width: '20%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: 40,
  },

  req_delivery_Btn: {
    height: 60,
    marginTop: 0,
    backgroundColor: 'white',
  },

  heading_order: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 20,
    marginBottom: 10,
    marginTop: 0,
    flex: 1,
  },

  heading_pre_order: {
    flex: 1,
    color: Theme.color.accentColor,
    fontWeight: 'bold',
    textAlign: 'right',
    fontSize: 17,
    marginBottom: 0,
    marginTop: 3,
  },

  tabView: {
    flexDirection: 'row',
  },

  bottomTab: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  myCartButton: {
    marginHorizontal: 0,
    marginTop: 0,
    flex: 3,
    backgroundColor: 'white',
    height: 65,
    marginBottom: -5,
  },

  myCartButtoniOS: {
    marginHorizontal: 0,
    marginTop: 0,
    flex: 3,
    backgroundColor: 'white',
    height: 60,
    marginBottom: -40,
  },

  myCartButtoniOS_clicked: {
    marginHorizontal: 0,
    marginTop: 0,
    flex: 3,
    backgroundColor: 'white',
    height: 60,
    marginBottom: -40,
  },

  myCartButton_clicked: {
    marginHorizontal: 0,
    marginTop: 0,
    flex: 3,
    backgroundColor: 'white',
    height: 65,
    marginBottom: -5,
  },

  heading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
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

  menuButtonTitle: {
    flex: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 5,
    paddingVertical: 5,
    color: 'black',
  },

  menuButtonTitle_clicked: {
    flex: 8,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 5,
    marginLeft: 5,
    color: 'black',
  },

  unreadDot: {
    borderRadius: 3,
    textAlign: 'center',
    fontSize: 13,
    color: '#fff',
    backgroundColor: '#f00',
    fontWeight: 'bold',
  },

  subheaddingRequest: {
    fontSize: 15,
    textAlign: 'center',
    color: '#484848',
  },

  image_request: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 0.5,
    borderRadius: 50,
  },
  list: {},
});

PastOrdersScreen.navigationOptions = ({navigation}) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
