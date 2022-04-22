import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { NavigationService } from '~/core/services';
import { Screen, AppText, Button } from '~/components';
import { Theme } from '~/styles';
import { playSound, getTimeLeft } from '~/core/utility';
import { Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import messaging from '@react-native-firebase/messaging';
import { fetchAPI } from '~/core/utility';
import {setPastOrders, setUnreadMsgCnt, setNewOrdersCnt,setPreOrdersCnt,showNotification, updateStatus} from '~/store/actions';
import PushNotification,{Importance} from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import RNFetchBlob from 'rn-fetch-blob';
import {BluetoothEscposPrinter} from "react-native-bluetooth-escpos-printer";
import {
  InterfaceType,
  StarConnectionSettings,
  StarXpandCommand,
  StarPrinter
} from 'react-native-star-io10';
export const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const fs = RNFetchBlob.fs; 
  const printAsText = useSelector((state) => state.account.printAsText);
  const isAutoEnabled = useSelector((state) => state.account.autoPrinterEnable);
  const [isLoading, setLoading] = useState(false);
  const token = useSelector((state) => state.account.token);
  const [timerForSound ,setCurrentTime] = useState('');
  const pastOrders =  useSelector((state) => state.order.pastOrders);
  const unreadMsgCount =  useSelector((state) => state.order.unreadMsgCnt);
  const [newOrders, setNewOrders] = useState(false);

  const selectedPrinterIdentifier = useSelector((state) => state.account.selectedPrinterAddress);
  // const [newOrdersCnt, setNewOrdersCnt] = useState('');
  const newOrdersCnt =  useSelector((state) => state.order.newOrderCnt);
  // const [preOrdersCnt, setPreOrdersCnt] = useState('');
  const preOrdersCnt =  useSelector((state) => state.order.preOrderCnt);

  useEffect(() => {
    if(isAutoEnabled == true && newOrders != false && selectedPrinterIdentifier != null){
      if( printAsText == true ) {
        RNFetchBlob.config({fileCache: true}).fetch("GET", newOrders.txt_url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component                       
          return resp.text();    
        })
        .then(base64Data => {
          // here's base64 encoded image
            try {                             
              BluetoothEscposPrinter.printText(base64Data,
                  { encoding:'GBK',
                  codepage:0,
                  widthtimes:0,
                  heigthtimes:0,
                  fonttype:1
                });
            } catch (e) {
                alert(e.message || "ERROR")
            }
        });
      } else {
        let imagePath = null;
        RNFetchBlob.config({fileCache: true}).fetch("GET", newOrders.image_url)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile("base64");
        })
        .then(async (base64Data) => {
            // here's base64 encoded image
          var settings = new StarConnectionSettings();
          settings.interfaceType = InterfaceType.Bluetooth;
          settings.identifier = selectedPrinterIdentifier;
          var printer = new StarPrinter(settings);
          try {
            var builder = new StarXpandCommand.StarXpandCommandBuilder();
            builder.addDocument(new StarXpandCommand.DocumentBuilder()
            .addPrinter(new StarXpandCommand.PrinterBuilder()
                .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
                .actionPrintImage(new StarXpandCommand.Printer.ImageParameter(base64Data, 570))
                .actionCut(StarXpandCommand.Printer.CutType.Partial)
                )
            );    
            var commands = await builder.getCommands();              
            await printer.open();
            await printer.print(commands);    
            console.log(`Success`);           
          }
          catch(error) {
              console.log(`Error: ${String(error)}`);
          }
          finally {
              await printer.close();
              await printer.dispose();
          }
          return fs.unlink(imagePath);
        });      
      }
    }
  }, [newOrders])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {      
      const milliseconds = remoteMessage.sentTime
      const dateObject = new Date(milliseconds);
      if(remoteMessage.data.app_message_type == "new-message") {   
          if(Platform.OS === 'ios') { 
            playSound('message');             
            PushNotificationIOS.addNotificationRequest({
              id: "default",
              title: "New Message",
              subtitle: dateObject.toLocaleTimeString()  +  ' New message received',
              body : remoteMessage.notification.body,        
              sound : "message.mp3",
              isSilent : true,
            });            
          } else {
            playSound('message');
            PushNotification.localNotification({
            channelId: "default",
            autoCancel: true,
            bigText:
              'New message received!',
            subText: dateObject.toLocaleTimeString()  +  ' New message received',
            title: 'New messages',
            message: remoteMessage.notification.body,  
            vibrate: true,
            vibration: 300,
            playSound: false,
            soundName: 'message.mp3',
            });
          }
      } else if(remoteMessage.data.app_message_type == "new-order") {
          if(Platform.OS === 'ios') {
            playSound('order');
            PushNotificationIOS.addNotificationRequest({
              id: "default",
              title: "New Order",
              subtitle: dateObject.toLocaleTimeString() + ' New order received',
              body :  remoteMessage.notification.body,  
              sound : "alert.mp3",
              isSilent : true,
            });              
          } else {
            playSound('order');
            PushNotification.localNotification({
            channelId: "default",
            autoCancel: true,
            bigText:
              'New Order received!',
            subText: dateObject.toLocaleTimeString() + ' New order received',
            title: 'New order received!',
            message: remoteMessage.notification.body,  
            vibrate: true,
            vibration: 300,
            playSound: false,
            soundName: 'alert.mp3',
          }) 
        }
      }
    });
    return unsubscribe;
  }, []);

  useEffect(()=> {
    if(newOrdersCnt > 0)
    {
      console.log("orders count @@@@@@@@@@@@", newOrdersCnt);
      playSound('order');
    }
    if(unreadMsgCount > 0)
    {
      playSound('message');
    }
  },[newOrdersCnt,unreadMsgCount, timerForSound]);

  const shouldUpdateOrders = async () => {
    const formData = new FormData();
    formData.append('app', "seller");
    formData.append('status', "new");
    await fetchAPI('/orders', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        console.log('hereismytestresponse', res.data.orders);
        res.data.orders.map((order) => { 
          console.log('jerjerjer');
          console.log('submit_date', order.submit_date, getTimeLeft(order.submit_date));
          if (getTimeLeft(order.submit_date) >= 15 && order.status_name === 'New' && order.is_pre_order == false) {
            console.log('get time left');
            const formData = new FormData();
            formData.append('order_id', order.order_id);
            formData.append('app', "seller");
            formData.append('reason_type', "too-busy")
            fetchAPI('/order/reject', {
              method: 'POST',
              headers: {
                authorization: `Bearer ${token}`,
              },
              body: formData,
            })
              .then((r) => {
                dispatch(updateStatus("Rejected"));
              })
              .catch((err) =>{
                dispatch(showNotification({ type: 'error', message: err.message }));
              })
              .finally(() => {});
          }
        });
      })
      .catch((err) => { }
      )
  }

  useEffect(() => {
    shouldUpdateOrders();
    fetchAPI(`/refresh?app=seller&last_time_checked=`, {
      method: 'Get',
      headers: {
        authorization: `Bearer ${token}`,
      }
    })
    .then((res) => {
      console.log("@@refresh -------@@@@@@@@######################################@@@@@@", res.data);    
      dispatch(setNewOrdersCnt(res.data.new_orders_total));
      dispatch(setPreOrdersCnt(res.data.pre_orders_total));
    })
    .catch((err) =>
    {}/// dispatch(showNotification({ type: 'error', message: err.message })),
    )
    .finally(() => setLoading(false));

    BackgroundTimer.stopBackgroundTimer(); 
    var last_time_checked = '';
    BackgroundTimer.runBackgroundTimer(()=>{ 
      
      setCurrentTime(last_time_checked);      
      if (token) {  

        shouldUpdateOrders();
        fetchAPI(`/refresh?app=seller&last_time_checked=${last_time_checked}`, {
          method: 'Get',
          headers: {
            authorization: `Bearer ${token}`,
          }
        })
        .then(async (res) => {
          console.log("@@refresh -------@@@@@@@@@@@@@@", res.data);
          
          if(res.data.updated_orders_total > 0)
          {
            const formData = new FormData();
            formData.append('app', "seller");
            formData.append('last_order_date', last_time_checked);
            await fetchAPI('/orders/last_activity', {
              method: 'POST',
              headers: {
                authorization: `Bearer ${token}`,
              },
              body: formData,
            })
            .then(async (res) => {      
             if(res.data.orders.length > 0) {
               res.data.orders.map((item, index)=> {
                setNewOrders(item);                 
              });    
             }        
            })
            .catch((err) =>
              {}////dispatch(showNotification({ type: 'error', message: err.message })),
             )      
          }
          last_time_checked = res.data.last_time_checked;
          dispatch(setUnreadMsgCnt(res.data.messages_unopened_total));
          dispatch(setNewOrdersCnt(res.data.new_orders_total));
          dispatch(setPreOrdersCnt(res.data.pre_orders_total));
          
        })
        .catch((err) =>
        {}/// dispatch(showNotification({ type: 'error', message: err.message })),
        )
        .finally(() => setLoading(false));     
      }      
    },10000);
    return () => {BackgroundTimer.stopBackgroundTimer();};
  },[]);

    return (
      <Screen
        align="center"
        backgroundImage={require('~/assets/images/home-bg.jpg')}
        isLoading={isLoading}>
        <View style={styles.container}>
          <Image
            source={require('~/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
             
          <Button
            type="accent"
            style={{ marginBottom: 10, }}
            fullWidth
            onClick={() => {
              NavigationService.navigate('RequestDelivery');            
            }}>
            REQUEST DELIVERY
          </Button>

          <Button
            type="splash-btn"
            style={{ marginBottom: 10, }}
            unreadText={newOrdersCnt > 0 ? newOrdersCnt : null }
            fullWidth
            onClick={() => {
              NavigationService.navigate('PastOrders',{activeTab: 0});            
            }}>
            CHOW LOCAL ORDERS
          </Button>
          
          {preOrdersCnt > 0 &&  <Button
            type="splash-btn"
            style={{ marginBottom: 10, }}
            fullWidth
            unreadText={preOrdersCnt > 0 ? preOrdersCnt : null}
            onClick={() => {
              NavigationService.navigate('PreOrders');            
            }}>
            PRE-ORDERS
          </Button>}
          <Button
            type="splash-btn"
            style={{ marginBottom: 10, }}
            fullWidth
            onClick={() => {
              NavigationService.navigate('PastOrders',{activeTab: 1});     
            }}>
            MY DELIVERY HISTORY
          </Button>
          <Button
            type="splash-btn"
            unreadText={unreadMsgCount > 0 ? unreadMsgCount : null}
            style={{ marginBottom: 10, }}
            fullWidth
            onClick={() => {
              NavigationService.navigate('PastOrders',{activeTab: 2});
            }}>
            MESSAGES
          </Button>          
          <Button
            type="splash-btn"
            style={{ marginBottom: 10, }}
            fullWidth
            onClick={() => {
              NavigationService.navigate('StoreList');
            }}>
            RESTAURANT STATUS
          </Button>
          <Button
            type="splash-btn"
            style={{ marginBottom: 10, }}
            fullWidth
            onClick={() => {
              NavigationService.navigate('Settings');
            }}>
            SETTINGS
          </Button>
        </View>
     
      </Screen>
    );
  
};

HomeScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,

    display: 'flex',
    minHeight: '100%',
  },

  logo: {
    width: '60%',
    height: '30%',
    resizeMode: 'cover',
    margin: 'auto',
  },

  accentColor: {
    color: Theme.color.accentColor,
  },

  heading: {
    color: '#FFF',
    fontSize: 40,
    letterSpacing: 2,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  subheading: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },

  unreadDot: {  
    justifyContent:'center',
    alignItems:"center", 
    fontSize: 11,
    color: "#fff",    
    fontWeight: "bold",    
    flex:1,
  },
});
