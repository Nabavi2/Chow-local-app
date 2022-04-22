import React, { useEffect, useMemo,useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Image, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import parseAddress from 'parse-address-string';
import { Screen, CartItem, AppText, Button, DashedLine} from '~/components';
import { Theme, MainNavigationOptions,GlobalStyles } from '~/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAPI, renderHTML, getTimeAgo, getTimeAway, getTimeLeft } from '~/core/utility';
import { NavigationService } from '~/core/services';
import { showNotification,clearNotification, updateStatus, isUpdateStatus } from '~/store/actions';
import MoneySVG from '~/assets/images/money.svg';
import CheckedSVG from '~/assets/images/checked-solid.svg';
import DeliverySVG from '~/assets/images/delivery-truck.svg';
import PickupSVG from '~/assets/images/package.svg';

import {BluetoothManager, BluetoothEscposPrinter} from "react-native-bluetooth-escpos-printer";
import {
  InterfaceType,
  StarConnectionSettings,
  StarXpandCommand,
  StarPrinter
} from 'react-native-star-io10';

import { setPastOrders } from '../../store/actions';
import { TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
export const OrderDetailsScreen = ({ navigation }) => {
  const fs = RNFetchBlob.fs; 
  const printAsText = useSelector((state) => state.account.printAsText);
  const selectedPrinterIdentifier = useSelector((state) => state.account.selectedPrinterAddress);
  const [base64Image, setBase64Image] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState();
  const status_slug = useSelector((state) => state.order.status_slug);
  const pastOrders = useSelector((state) => state.order.pastOrders);  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);
  const is_update_status = useSelector((state) => state.order.updated);
  const accepted_data = useMemo(() => navigation.getParam('data'), []);
  const preorder = useMemo(() => navigation.getParam('preorder'), []);
  const orderId = useMemo(() => navigation.getParam('orderId'), []);
  const submitDelivery = useMemo(() => navigation.getParam('requestDelivery'), []);
  const delivery_request_id = useMemo(() => navigation.getParam('delivery_request_id'), []);
  const orderIndex = useMemo(() => navigation.getParam('index') != undefined ? navigation.getParam('index') : null, []);
  const [oneMinPassed, setOneMinPassed] =  useState(false);
  const [cancelFlag, setCancelFlag] = useState(false);
  const [pickup_address, setParsedPickupAddress] = useState(false);
  const [leftAccept, setLeftAccept] = useState(false);
  const [driverArriveIn, setDriverArriveIn] = useState(false);
  
useEffect(()=>{
  navigation.setParams({
    action: openMenu,
    actionTitle: (
      <Icon size={40} color='black' name="menu" />
    ),
  });
},[]);

useEffect(() => {
  let timer;
  console.log('asfdasdfasdf', orderDetail);
  if(orderDetail && (-parseInt(getTimeLeft(orderDetail.prep_time_date))) > 0 && (orderDetail.status_name == 'Processing' || ((orderDetail.delivery_type == 'pickup' || orderDetail.delivery_request_by == 'territory') && orderDetail.status_name == 'Accepted'))){
    
    setDriverArriveIn((-parseInt(getTimeLeft(orderDetail.prep_time_date))));
    timer = setInterval(() => {
      if (orderDetail.delivery_type == 'deliver') {
        setDriverArriveIn((-parseInt(getTimeLeft(orderDetail.prep_time_date))));
      } else {
        if ((-parseInt(getTimeLeft(orderDetail.prep_time_date))) > 0) {
          setDriverArriveIn((-parseInt(getTimeLeft(orderDetail.prep_time_date))));
        } else {
          setDriverArriveIn(0);
        }
      }
    },15000);
  } else if(orderDetail && orderDetail.status_name == 'Processing') {
    console.log('asdfasdfasdfasdfasdfasdfasdfasfasdf');
      setDriverArriveIn(0);
  } else {
    console.log('bbbbbasdfasdfasdfasdfasdfasdfasdfasfasdf');
    setDriverArriveIn(0);
  }
  return () => {clearInterval(timer)};   
},[orderDetail]);

useEffect(() => {
  let timer;
  if(orderDetail && 15 - getTimeLeft(orderDetail.submit_date) > 0 && orderDetail.status_name == 'New'){
    setLeftAccept(15 - getTimeLeft(orderDetail.submit_date));
    timer = setInterval(()=>{
      if(15- getTimeLeft(orderDetail.submit_date) > 0){
        setLeftAccept(15 - getTimeLeft(orderDetail.submit_date));
      } else {
        setLeftAccept(0);
      }
    },15000);
  } else if(orderDetail && orderDetail.status_name == 'New' && orderDetail.is_pre_order == false) {
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', orderDetail.order_id);
    formData.append('app', "seller");
    formData.append('reason_type', "too-busy")
    fetchAPI('/order/reject', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        console.log("RERRRRFund SENTTTTTTTTTTTTTTTTTTTTTTTTT", res.data);      
        dispatch(updateStatus("Rejected"));
      })
      .catch((err) =>{
        dispatch(showNotification({ type: 'error', message: err.message }));
      })
      .finally(() => setLoading(false));
      setLeftAccept(0);
  } else {
    setLeftAccept(0);
  }
  return () => {clearInterval(timer)};   
},[orderDetail]);

useEffect(() => {
  if(accepted_data){
      dispatch(
        showNotification({
          type: 'fullScreen',
          autoHide: false,
          options: { align: 'right' },
          message: (
            <>     
            <View style={styles.avatarContainer}>
              <Image
                source={{ 
                  uri: 
                      accepted_data.app_driver_avatar ||
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
                  fontWeight: 'bold'
                }}>{accepted_data.app_driver_name}
              </AppText>
              <AppText
                style={{
                  fontSize: 12,
                  color: 'white',                          
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                {accepted_data.app_driver_name} has accepted your delivery request
              </AppText>
              <AppText
                style={{
                  fontSize: 16,
                  color: '#37d455',                          
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                {accepted_data.show_collect_from_driver == true ? "DRIVER WILL PAY YOU " + accepted_data.collect_from_driver : accepted_data.show_pay_to_driver == true && "PAY TO DRIVER " + accepted_data.pay_to_driver}
              </AppText>
              <Button
                type="white"
                style={{ marginBottom: 10, marginTop: 20 }}
                fullWidth
                onClick={() => {
                  Linking.canOpenURL(`tel:${accepted_data.app_driver_phone}`).then((supported) => {
                    if (supported) {
                        Linking.openURL(`tel:${accepted_data.app_driver_phone}`);
                    } else {
                        dispatch(
                        showNotification({
                            type: 'error',
                            message: `Don't know how to open URI: ${accepted_data.app_driver_phone}`,
                        }),
                        );
                    }
                    });
                }}>
                <AppText style={{fontSize: 16,fontWeight: 'bold',textTransform: 'uppercase',}}>CALL {accepted_data.app_driver_first_name}</AppText>
              </Button>
              <Button
                type="white"
                style={{ marginBottom: 10, }}
                fullWidth
                onClick={() => {
                  dispatch(setTerritory(JSON.parse(accepted_data.app_territory)));
                  NavigationService.navigate('MessageRoom',{
                      token: token,
                      user: accepted_data.app_driver_id,
                      user_image:  accepted_data.app_driver_avatar,
                      user_name:  accepted_data.app_driver_name,
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
      ) 
    }
},[accepted_data]);

useEffect(() => {
  if(submitDelivery == true)
  {
    dispatch(
      showNotification({
        type: 'fullScreen',
        autoHide: false,
        options: { align: 'right' },
        message: (
          <>               
            <Image
                source={require('~/assets/images/delivered.png')}
                style={styles.image_request}
                resizeMode="cover"
            />               
              <AppText
              style={{
                fontSize: 16,
                color: 'white',                          
                textAlign: 'center',
                marginTop: 10,
              }}>REQUESTING
            </AppText>
            <AppText
              style={{
                fontSize: 12,
                color: 'white',                          
                textAlign: 'center',
                marginTop: 10,
              }}>
              Your delivery request has been submitted. Please wait for a delivery person to accept this request.
            </AppText>
            {/* <Button
              type="white"
              style={{ marginBottom: 10, marginTop: 20 }}
              fullWidth
              onClick={() => {
                dispatch(clearNotification());
                requestCancel();
              }}>
              CANCEL REQUEST
            </Button> */}
            <Button
              type="white"
              fullWidth
              style={{ marginBottom: 10, marginTop: 20 }}
              onClick={() => {                         
                dispatch(clearNotification());
              }}>
              Exit
            </Button>                    
          </>
        ),
      }),
    )   
  }
},[submitDelivery]);

const openMenu = useCallback(() => {  
  NavigationService.navigate('OrderOptions',{orderId: navigation.getParam('orderId')});
},[]);

  useEffect(() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('app', "seller");
    fetchAPI('/order/details', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    .then((res) => {
      console.log("########################",res.data);
      setOrderDetail(res.data);
      setLoading(true);
      
      let imagePath = null;
      RNFetchBlob.config({fileCache: true}).fetch("GET", printAsText == true ? res.data.txt_url : res.data.image_url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        if(printAsText == true) {
           return resp.text();          
        } 
        else {
          imagePath = resp.path();
          return resp.readFile("base64");
        }        
      })
      .then(base64Data => {
        // here's base64 encoded image
        setBase64Image(base64Data);
        //console.log(base64Data);
        setLoading(false);
        // remove the file from storage
        return fs.unlink(imagePath);
      });

      parseAddress(res.data.pickup_address, (err, addressObj) => {
        err = err;
        setParsedPickupAddress(addressObj);
      })
      if(res.data.request_delivery ==  true && cancelFlag == false)
      {        
        setOneMinPassed(true);
      }
      navigation.setParams({orderStatus:res.data.status_name});
      if(res.data.is_pre_order == false) { /// only past Orders item's status have to change from new to changed status
        var temp =  pastOrders;
        if(orderIndex != null){
          temp[orderIndex].is_new = false;
          if(navigation.getParam('orderStatus') != undefined && status_slug['status_slug'] != undefined) {
            temp[orderIndex].status_name = status_slug["status_slug"];
          }
        }
        dispatch(setPastOrders(false));
        dispatch(setPastOrders(temp));
      }
      
    })
    .catch((err) =>
      dispatch(showNotification({ type: 'error', message: err.message })),
    )
    .finally(() => setLoading(false));
      
  }, [dispatch,orderId,status_slug,is_update_status, orderIndex]);

  const paymentReceived = useCallback(() => {
    setLoading(true);

    const formData = new FormData();
    formData.append('order_id', orderId);
    formData.append('app', "seller");

    fetchAPI('/order/payment_received', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {        
        dispatch(isUpdateStatus(!is_update_status));     
      })
      .catch((err) =>{
        console.log('-------------------------------------------------------------updated result:error');
        dispatch(showNotification({ type: 'error', message: err.message }));
      })
      .finally(() => setLoading(false));
  }, [dispatch, token]);
  
  const requestCancel = useCallback(() => {   
    setLoading(true);
    const formData = new FormData();
    formData.append('app', "seller");
    if(delivery_request_id){
      formData.append('delivery_request_id', delivery_request_id);
    } else {
      formData.append('order_id',orderId);
    }
    
    fetchAPI('/delivery_request/cancel', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    .then((res) => {
      console.log("##############One min passed flag ################",oneMinPassed);
      setCancelFlag(true);
      dispatch(isUpdateStatus(!is_update_status));
      dispatch(showNotification({ type: 'success', message: res.message }));
      setOneMinPassed(false);
    })
    .catch((err) =>{
      dispatch(showNotification({ type: 'error', message: err.message }));
    })
    .finally(() => setLoading(false));
  }, [dispatch, token]);

 
  const requestDelivery = useCallback((territory_id) => {  
    NavigationService.navigate("RequestDeliveryDetail", {orderId: orderId});
  },[token,orderDetail,orderId]);
  
  
  const orderAcceptByPickup = useCallback((orderId, deliveryType) => {  
    NavigationService.navigate("RequestDeliveryDetail", {orderId: orderId, territory: 'territory', deliveryType: 'pickup', accept: true });
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('order_id', orderId);
//     formData.append('app', "seller");
//     formData.append("delivery_request_by", "territory")
//     fetchAPI('/order/accept', {
//       method: 'POST',
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     })
//       .then((res) => {
// //        dispatch(isUpdateStatus(!is_update_status));    
        
//       })
//       .catch((err) =>{
//         dispatch(showNotification({ type: 'error', message: err.message }));
//       })
//       .finally(() => setLoading(false));
  },[dispatch]); 

  return (
    <Screen hasList keyboardAware isLoading={isLoading}>
      {orderDetail && (        
        <View style={styles.container}>

           {orderDetail.is_pre_order == false && <AppText style={styles.orderstatus}>ORDER STATUS:<AppText style={styles.orderstatusBold}> {orderDetail.status_name}</AppText></AppText>}

           {orderDetail.is_pre_order == true && <View style={{backgroundColor: "#5de1e6", marginHorizontal:20, justifyContent:"center", marginBottom: 10,height:60}}>
             <AppText style={{fontWeight: 'bold',paddingLeft:10, color:'white', fontSize: 18,}} numberOfLines={1}>PRE-ORDER    {getTimeAway(orderDetail.pre_order_date)}</AppText>
           </View>}

           <View style={{backgroundColor: "#EFEFEF", flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10}}>
            <View style={{flexDirection: "row",flex: 1,padding:10}}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ 
                                uri: 
                                orderDetail.territory.app_image ||
                                    'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                                }}
                        style={styles.image}
                    />
                </View>
                <View style={{marginLeft: 15,flex:2}}>
                    <View >
                        <AppText style={{fontWeight: 'bold',paddingRight:0,marginTop:3}} numberOfLines={1}>{orderDetail.user.name}</AppText>
                    </View>
                    <View style={{marginTop: 3}}>
                        <AppText style={{fontSize: 12, color: '#777', height: 16}} numberOfLine={1}>{orderDetail.is_pre_order == false ? getTimeAgo(orderDetail.submit_date) : getTimeAway(orderDetail.pre_order_date)} </AppText>
                    </View>
                </View>      
                {orderDetail.is_paid == true && 
                  <View style={{marginLeft: 15,flex:2, flexDirection:'row',alignItems:'center'}}>
                      <View >
                          <CheckedSVG width={25} height={25}></CheckedSVG>
                      </View>
                      <View >
                          <AppText style={{fontSize: 25, color: '#00ff00',fontWeight:'bold'}} numberOfLine={1}> PAID </AppText>
                      </View>
                  </View>
                }
            </View>
        </View>

        {orderDetail.user.is_guest == false && ( orderDetail.users_first_order == true ? <View style={{backgroundColor: "#fbf1dd",padding:10, flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10,height:50}}>
            {/* <MedalSVG style={{flex:2, marginLeft:0}} height={30} width={30} /> */}
            <Image
                source={require('~/assets/images/first-Order.png')}
                style={styles.image_sale}        
                resizeMode="cover"
                    />
            <AppText style={{flex:10,fontWeight: 'bold',paddingLeft:10,marginTop:5,color:'#e5a217'}} numberOfLines={1}>This is their 1st order!</AppText>
          </View> : <View style={{backgroundColor: "#fbf1dd",padding:10, flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10,height:50}}>
            {/* <MedalSVG style={{flex:2, marginLeft:0}} height={30} width={30} /> */}
            <Image
                source={require('~/assets/images/first-Order.png')}
                style={styles.image_sale}        
                resizeMode="cover"
                    />
            <AppText style={{flex:10,fontWeight: 'bold',paddingLeft:10,marginTop:5,color:'#e5a217'}} numberOfLines={1}>This user has placed {orderDetail.total_orders} orders</AppText>
          </View>)}

        {orderDetail.pay_type == 2 && orderDetail.is_paid != true && <View style={{backgroundColor: "#dff8e5",padding:10, flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10,height:50,flex:10}}>
          <MoneySVG style={{flex:2, marginLeft:0}} height={30} width={30} />                 
          <AppText style={{flex:10,fontWeight: 'bold',paddingLeft:10,marginTop:5,color:'#6faa6a'}} numberOfLines={1}>Please Collect Payment of {orderDetail.currency_icon}{(+orderDetail.total_amount).toFixed(2)}</AppText>                            
        </View>} 

        {orderDetail.request_delivery == true && orderDetail.is_pre_order == false &&
          <View style={orderDetail.request_delivery_is_accepted == true ? 
            {backgroundColor: "#dff8e5",padding:10, flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10,height:50}
           : {backgroundColor: "#fcd9dd",padding:10, flexDirection: "row", marginHorizontal:20, justifyContent:"space-between",marginBottom: 10,height:50}}>
            {/* <MedalSVG style={{flex:2, marginLeft:0}} height={30} width={30} /> */}
            <Image
                source={require('~/assets/images/delivered.png')}
                style={styles.image_sale}
                resizeMode="cover"
            />            
            <AppText style={orderDetail.request_delivery_is_accepted == true ? {flex:10,fontWeight: 'bold',paddingLeft:10,marginTop:5,color:'#6faa6a'} : {flex:10,fontWeight: 'bold',paddingLeft:10,marginTop:5,color:'#eb011b'}}
            numberOfLines={1}>
               {orderDetail.request_delivery_is_accepted == true ? 
                orderDetail.show_pay_to_driver == true ? "Pay the driver "+orderDetail.pay_to_driver : orderDetail.show_collect_from_driver == true ? "The driver will pay you " + orderDetail.collect_from_driver :  "Delivery Request Accepted"
                : "Delivery Requested"}
            </AppText>
            {oneMinPassed == true && orderDetail.request_delivery_is_accepted == false ?  <TouchableOpacity  onPress={() => { requestCancel();}} style={{backgroundColor: "#eb011b",height:50, marginTop:-10, marginRight:-10, width:70}}>
              <AppText style={{fontWeight: 'bold',paddingLeft:10,marginTop:15,color:'#ffffff'}} numberOfLines={1}>Cancel</AppText>
            </TouchableOpacity> : <></>}
          </View>}

          {(orderDetail.status_name == 'New' && (preorder != "preorder" || orderDetail.is_pre_order == false)) && <View style={{flexDirection: 'row',marginHorizontal:20}}>
            {orderDetail.delivery_type == 'deliver' ?  <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, justifyContent:"center", borderRadius:20, flex:2}}>
              <View style={{alignItems:'center', marginTop: 5}}>
                <DeliverySVG width={40} height={40}></DeliverySVG>
              </View>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black'}}>DELIVERY</AppText>
            </View> :
            <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, justifyContent:"center", borderRadius:20, flex:2}}>
            <View style={{alignItems:'center', marginTop: 5}}>
              <PickupSVG width={40} height={40}></PickupSVG>
            </View>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black'}}>PICKUP</AppText>
            </View>
            }
            <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, marginLeft: 10, justifyContent:"center", borderRadius:20, flex:3}}>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:25, color: 'black', fontWeight: 'bold'}}>{leftAccept} min</AppText>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black', marginTop: 5}}>LEFT TO ACCEPT</AppText>
            </View>
            </View>
          }
           {orderDetail.is_pre_order == false && ((orderDetail.delivery_type == 'deliver' && orderDetail.status_name == 'Processing') || (orderDetail.delivery_type == 'pickup' && orderDetail.status_name == 'Accepted')  || (orderDetail.status_name == 'Accepted' && orderDetail.delivery_request_by == 'territory')) && <View style={{flexDirection: 'row',marginHorizontal:20}}>
            {orderDetail.delivery_type == 'deliver' ? <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, justifyContent:"center", borderRadius:20, flex:2}}>
              <View style={{alignItems:'center', marginTop: 5}}>
                <DeliverySVG width={40} height={40}></DeliverySVG>
              </View>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black'}}>DELIVERY</AppText>
            </View> : 
            <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, justifyContent:"center", borderRadius:20, flex:2}}>
            <View style={{alignItems:'center', marginTop: 5}}>
              <PickupSVG width={40} height={40}></PickupSVG>
            </View>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black'}}>PICKUP</AppText>
            </View>
          }
            <View style={{backgroundColor: "#eee", flexDirection: "column", width:'50%',height:100, marginLeft: 10, justifyContent:"center", borderRadius:20, flex:3}}>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:11, color: 'black', marginBottom: 5}}>{orderDetail.delivery_type == 'pickup' ? "CUSTOMER ARRIVES IN" : orderDetail.delivery_request_by == "territory" ? "FOOD IS READY IN" : "DRIVER ARRIVES IN"}</AppText>
              <AppText style={{textAlign:'center', justifyContent:"center", fontSize:25, color: 'black', fontWeight: 'bold'}}>{driverArriveIn} min</AppText>
            </View>
          </View>
          }
          
          {orderDetail.status_name == 'New' && orderDetail.is_pre_order == false &&  <View style={{flexDirection: "row",marginHorizontal:15}}>             
              <Button
                type="accent-green"
                style={{flex:1,marginHorizontal:5,...GlobalStyles.formControl}}
                onClick={() => {
                  if(orderDetail.delivery_type == 'pickup'){
                    orderAcceptByPickup(orderDetail.order_id, orderDetail.delivery_type);
                  } else {
                    NavigationService.navigate("OrderAccept", { orderId: orderId });
                  }
                }}>
                ACCEPT THIS ORDER
            </Button> 
            
          </View>}
          {orderDetail.status_name == 'New' && orderDetail.is_pre_order == false &&  <View style={{flexDirection: "row",marginHorizontal:15}}>             
            <Button
                type="borderlessorder"
                style={{flex:1,marginHorizontal:5, color:'red', ...GlobalStyles.formControl}}
                onClick={() => {              
                  NavigationService.navigate("OrderReject",{order_id : orderDetail.order_id});
                }}>
                REJECT & REFUND THIS ORDER
            </Button>
          </View>}
          <DashedLine styleContainer={{ marginTop: 20, marginBottom:10, borderRadius: 1, }}/>
        {orderDetail.pay_type == 2 && orderDetail.is_paid != true && orderDetail.status_name == "Accepted" && 
        <View style={{flexDirection: "row",marginHorizontal:15}}>
          <Button
            type="bordered-dark"
            style={{flex:1,marginHorizontal:5,...GlobalStyles.formControl}}
            onClick={() => {              
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
                          fontSize: 15,
                          color: 'white',                          
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        VERIFY PAYMENT
                      </AppText>
                      <AppText
                        style={{
                          fontSize: 11,
                          color: 'white',                          
                          textAlign: 'center',
                          marginTop: 10,
                        }}>
                        Please confirm payment of {orderDetail.currency_icon}{(+orderDetail.total_amount).toFixed(2)} has been received
                      </AppText>
                      <Button
                        type="white"
                        style={{ marginBottom: 10, marginTop: 20 }}
                        fullWidth
                        onClick={() => {
                          dispatch(clearNotification());
                          paymentReceived();
                        }}>
                        CONFIRM PAYMENT
                      </Button>
                      <Button
                        type="white"
                        fullWidth
                        onClick={() => {                         
                          dispatch(clearNotification());
                        }}>
                        Cancel
                      </Button>                    
                    </>
                  ),
                }),
              )   
            }}>
            PAYMENT RECEIVED
        </Button> 
        </View>}
        {orderDetail.is_pre_order == false && orderDetail.request_delivery != true && orderDetail.status_name  != "Picked Up" && orderDetail.delivery_type != 'pickup'  &&  orderDetail.status_name == "Accepted" &&  orderDetail.delivery_request_by != "territory" && 
        <View style={{flexDirection: "row",marginHorizontal:15}}>
          <Button
            type="accent-green"
            style={{flex:1,marginHorizontal:5,...GlobalStyles.formControl}}
            onClick={() => {              
              requestDelivery(orderDetail.territory.tid);
            }}>
            REQUEST DELIVERY
        </Button> 
        </View>}

        {orderDetail.is_pre_order == false && orderDetail.status_name  != "Picked Up" && orderDetail.delivery_type != 'pickup'  &&  orderDetail.status_name == "Processing" &&  
        <View style={{flexDirection: "row",marginHorizontal:15}}>
          <Button
            type="bordered-dark"
            style={{flex:1,marginHorizontal:5,...GlobalStyles.formControl}}
            onClick={() => {              
              openMenu();
            }}>
            CONTACT CUSTOMER
        </Button> 
        </View>}

        {orderDetail.is_pre_order == false && <View style={{flexDirection: "row",marginHorizontal:15}}>

          {
            (orderDetail.delivery_type == 'pickup' || orderDetail.delivery_request_by == "territory") && orderDetail.status_name != "New" && 
              <Button
                type="bordered-dark"
                style={{flex:3,marginHorizontal:5,...GlobalStyles.formControl}}
                onClick={() => {
                  if(orderDetail.request_delivery_is_accepted ==  true)
                  {
                    dispatch(showNotification({type: 'error', message: "Once you have requested delivery, you can't update the order status anymore. Our driver will take it from here", buttonText: "Go Back"}));
                  } else {
                    NavigationService.navigate('UpdateStatus', {
                      orderId: orderId,
                      type: orderDetail.delivery_type,
                      delivery_request_by: orderDetail.delivery_request_by
                    });
                  }
                }}>
                UPDATE STATUS
              </Button>
          }


         {(selectedPrinterIdentifier != null && base64Image != "") &&  orderDetail.status_name != "New" && orderDetail.status_name != "Rejected"  &&
          <Button
            type="bordered-dark"
            style={{flex:2,marginHorizontal:5,...GlobalStyles.formControl}}
            onClick={async () => {
              if( printAsText == true ) {
                RNFetchBlob.config({fileCache: true}).fetch("GET", orderDetail.txt_url)
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
                var settings = new StarConnectionSettings();
                settings.interfaceType = InterfaceType.Bluetooth;
                settings.identifier = selectedPrinterIdentifier;
                var printer = new StarPrinter(settings);
                try {
                  var builder = new StarXpandCommand.StarXpandCommandBuilder();
                  builder.addDocument(new StarXpandCommand.DocumentBuilder()
                  .addPrinter(new StarXpandCommand.PrinterBuilder()
                      .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
                      .actionPrintImage(new StarXpandCommand.Printer.ImageParameter(base64Image, 570))
                      .actionCut(StarXpandCommand.Printer.CutType.Partial)
                      )
                  );    
                  var commands = await builder.getCommands();              
                  await printer.open();
                  await printer.print(commands);    
                      
                }
                catch(error) {
                    console.log(`Error: ${String(error)}`);
                }
                finally {
                    await printer.close();
                    await printer.dispose();
                }
              }
            }}>
            PRINT
          </Button> 
        }
        </View>}

        {orderDetail.is_pre_order == true &&  <View style={{flexDirection: "row",marginHorizontal:15}}>
          <Button
            type="bordered-dark"
            style={{flex:1,marginHorizontal:5,...GlobalStyles.formControl}}
            onClick={() => {              
              NavigationService.navigate("ETADetails", {pre_orderDetail: orderDetail});
            }}>
            ETA DETAILS
          </Button> 
        </View>}

          <View style={styles.orderInfo}>
            <View style={{flexDirection:'row'}}>
              <View style={{flex:1}}>
                <AppText style={styles.field}>
                  Payment
                </AppText>
                <AppText style={styles.value_address}>
                  {orderDetail.pay_type_name}
                </AppText>
              </View>
              {orderDetail.promo_code_amount > 0 && 
              <View style={{flex:1}}>
                <AppText style={styles.field}>Promo</AppText>
                  {orderDetail.auto_discount_amount == orderDetail.promo_code_amount ? <View>
                    <AppText style={styles.value_promoCode}>
                    AUTO DISCOUNT
                    </AppText>
                    <AppText style={styles.value_Auto_promoCode}>
                   {orderDetail.auto_discount_description}
                    </AppText>
                  </View>
                  :
                  <AppText style={styles.value_promoCode}>
                  {orderDetail.promo_code_name}                  
                </AppText>}
              </View>}
            </View>
                  
            <View style={styles.part}>
              {orderDetail.delivery_type == 'pickup' ? 
              <View style={styles.part}>
              <AppText style={styles.field}>Delivery Type</AppText>
              <AppText style={styles.value_pickup}>
                Pick up
              </AppText>
            </View> :
              <View>
                <View style={styles.part}>
                  <AppText style={styles.field}>Pickup Address</AppText>
                    <AppText style={styles.value_address}>
                    {pickup_address.street_address1}
                  </AppText>
                </View>
                <View style={styles.part}>
                  <AppText style={styles.field}>Delivery Address</AppText>
                  <AppText style={styles.value_address}>
                  {orderDetail.address.address}{orderDetail.address_type != "" && ', '+orderDetail.address_type} {orderDetail.address_apartment_nr != "" && ', '+orderDetail.address_apartment_nr} 
                  </AppText>
                </View>
              </View> }
              {/* <AppText style={styles.field}>Delivery Address</AppText>
              <AppText style={styles.value_address}>
              {orderDetail.address.address}{orderDetail.address_type != "" && ', '+orderDetail.address_type} {orderDetail.address_apartment_nr != "" && ', '+orderDetail.address_apartment_nr} 
              </AppText> */}
            </View>
            {orderDetail.delivery_instructions != "" && orderDetail.delivery_type != 'pickup' &&
            <View style={styles.part}>
              <AppText style={styles.field}>Address Note</AppText>
              <AppText style={styles.value} numberOfLines={3}>
                {renderHTML(orderDetail.delivery_instructions)}
              </AppText>
            </View>}
            {orderDetail.notes != "" &&
            <View style={styles.part}>
              <AppText style={styles.field}>Order Note</AppText>
              <AppText style={styles.value} numberOfLines={3}>{orderDetail.notes}</AppText>
            </View>}
          </View>
          <FlatList
            style={styles.list}
            alwaysBounceVertical={false}
            data={orderDetail.products}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <CartItem orderDetail={orderDetail} product={item} />}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <View style={styles.summary}>
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Food & Beverage Subtotal</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.currency_icon} {(+orderDetail.amount).toFixed(2)}
                    </AppText>
                  </View>
                  {orderDetail.promo_code_amount > 0 && 
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Discount {orderDetail.auto_discount_amount == orderDetail.promo_code_amount && orderDetail.auto_discount_type == 'percentage' && "("+ parseInt(orderDetail.auto_discount_discount)+'%)'}</AppText>
                    <AppText style={styles.summaryValue}>
                    - {orderDetail.currency_icon} {(+orderDetail.promo_code_amount).toFixed(2)}
                    </AppText>
                  </View>}    
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Delivery</AppText>
                    <AppText style={styles.summaryValue}>
                      {orderDetail.currency_icon} {(+orderDetail.delivery_amount).toFixed(2)}
                    </AppText>
                  </View>
                  <DashedLine styleContainer={{ marginTop: 5, marginBottom:10, borderRadius: 1, }}/>
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Sub-total</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.delivery_type === 'deliver'
                        ? `${
                            orderDetail.currency_icon
                          } ${(+orderDetail.total_amount_with_delivery - orderDetail.tax_amount_with_delivery).toFixed(
                            2,
                          )}`
                        : orderDetail.promo_code_amount > 0 ? `${
                            orderDetail.currency_icon
                          } ${(+orderDetail.amount - orderDetail.promo_code_amount ).toFixed(
                            2,
                          )}` :`${
                            orderDetail.currency_icon
                          } ${(+orderDetail.amount).toFixed(
                            2,
                          )}`}
                    </AppText>
                  </View>               
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Tax</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.currency_icon} {(+orderDetail.tax_amount).toFixed(2)}
                    </AppText>
                  </View>
                  <DashedLine styleContainer={{ marginTop: 5, marginBottom:10, borderRadius: 1, }}/>
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey_bold}>Order Total</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.currency_icon} {orderDetail.delivery_type === 'deliver' ? (+orderDetail.total_amount_with_delivery).toFixed(2) :  (+orderDetail.total_amount_without_delivery).toFixed(2)}
                    </AppText>
                  </View>    
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey}>Tip{orderDetail.tip_type != 'fixed' && '('+orderDetail.tip_percentage + '%)'}</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.currency_icon} {(+orderDetail.tip_amount).toFixed(2)}
                    </AppText>
                  </View>             
                  
                  <View style={styles.summaryRow}>
                    <AppText style={styles.summaryKey_bold}>Total</AppText>
                    <AppText style={styles.summaryValue}>
                    {orderDetail.currency_icon} {(+orderDetail.total_amount).toFixed(2)}
                    </AppText>
                  </View>                  
                </View>       
              </View>
            )}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,

    flex: 1,
  },

  list: {
    marginTop: 10,
  },

  action: {
    marginBottom: 40,
    marginHorizontal: 40,
  },

  sellerTitle: {
    alignItems: 'center',
  },

  orderTitle: {
    marginTop: 20,
    alignItems: 'center',
  },

  orderNumber: {
    fontSize: 25,
  },

  image_sale: {
    width:30,
    height:30
  },

  image_request: {
    width:100,
    height:100,
    borderRadius:50
  },

  avatarContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 0.5,
    borderRadius: 50,
  },

  status: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  field: {
    fontSize: 14,
    marginBottom: 0,
    color: 'black',
    fontWeight: 'bold'
  },

  orderstatus: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
    marginHorizontal:20,
  },

  orderstatusBold: {
    fontSize: 16,
    marginBottom: 0,
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  value_address: {
    fontSize: 15,
    color: "#484848"
  },

  value_promoCode: {
    fontSize: 15,
    color: "#ec1a25",
    textTransform: 'uppercase'
  },

  value_Auto_promoCode: {
    fontSize: 15,
    color: "#484848",
  },

  value_pickup: {
    fontSize: 15,
    color: "#484848",
  },

  value: {
    fontSize: 15,
    color: "#484848"
  },

  orderInfo: {   
    paddingTop: 20,
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
 
  },
  part: {
    marginBottom:5,
    marginTop:10
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: Theme.color.borderColor,
  },

  summary: {
    paddingVertical: 10,
  },

  summaryRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  summaryKey: {
    fontSize: 16,
  },

  summaryKey_bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Theme.color.borderColor,
  },
  summaryTotal: {
    marginVertical: 15,
    fontSize: 24,
    textAlign: 'center',
  },
 created: {
    fontSize: 8,
    marginBottom: 10,
    opacity: 0.8,
    paddingHorizontal: 60
},
content_left: {
    flexDirection: 'row'
},
messageContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#EFEFEF',
    maxWidth: '80%',
    marginLeft: 10,
    marginRight: 10,
},
message: {
    textAlign: 'right',
    color: '#808080'
},

imageContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    borderColor: '#DDD',
    borderWidth: 3,
    borderRadius: 40,
},


image: {
    width: 40,
    height: 40,
    borderRadius: 40,
}
});

OrderDetailsScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: `#${navigation.getParam('orderId') ? navigation.getParam('orderId') : ""}`,
      headerTintColors: 'black',
    },
    headerTitleStyle: {
      color: 'black',
    },
  });
