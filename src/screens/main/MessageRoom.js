import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, Animated, KeyboardAvoidingView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';

import { Screen, Input, Button, MessageItem } from '~/components';
import { GlobalStyles, MessageRoomNavigationOptions, Theme } from '~/styles';

import { fetchAPI } from '~/core/utility';
import { showNotification, setMessageTerritories,  enterMessageRoom } from '~/store/actions';
import { NavigationService } from '~/core/services';
import { DashedLine, AppText} from '../../components';
import { Constants } from '~/core/constant';


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
export const MessageRoomScreen = ({ navigation }) => {
  const territory = useSelector((state) => state.explorer.territory);
  const customer_id = useMemo(() => navigation.getParam('user'), []);
  const messageIndex = useMemo(() => navigation.getParam('index'), []);
  const customer_image = useMemo(() => navigation.getParam('user_image'), []);
  const userinfo =  useSelector((state) => state.account.userInfo);
  const [territoryImage, setTerritoryImage] = useState('');
  const [lastMessageID, setLastMessageID] = useState('');
  const enterMessageRoomValue =  useSelector((state) => state.notification.enterMessageRoom);
  const [messagePage, setMessagePage] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isPrev, setIsPrev] = useState(false);
  const [is_started, setIsStart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const messageTerritories = useSelector((state) => state.order.messageTerritories);
  const dispatch = useDispatch();
  const bottomMargin = Platform.OS === 'ios' ? 30 : 0;
  const scrollRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [img, setImg] = useState(null);
  const token = useSelector((state) => state.account.token);
  const guestToken = useSelector((state) => state.account.guestToken);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
  
  const profile = useCallback(() => {
    NavigationService.navigate('Products');
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      updateNewMessage();
    }, 5000 );
    return () => clearInterval(interval);
  });
  const getMoreMessages = () => {
    setLoadingMessage(true);
    setLoading(true);
    setMessagePage(messagePage + 1);
    fetchAPI(`/messages?territory=${territory.tid}&user=${customer_id}&size=10&page=${messagePage + 1}&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token ? token : guestToken}`,
      },
    })
      .then((res) => {
        setLoading(false);
        setLoadingMessage(false);
        setMessageList(res.data.messages.reverse().concat(messageList));
        setIsPrev(res.data.has_next_page);
      })
      .catch((err) =>
        dispatch(showNotification({ type: 'error', message: err.message })),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    fetchAPI(`/messages?territory=${territory.tid}&user=${customer_id}&size=10&page=0&app=seller`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        var temp =  messageTerritories;
        if(messageIndex != undefined){
          temp[messageIndex].is_new = false;
        }
        dispatch(setMessageTerritories(false));
        dispatch(setMessageTerritories(temp));
        dispatch(enterMessageRoom(!enterMessageRoomValue));
        if(res.data.messages.length > 0)
        {
          setLastMessageID(res.data.last_message_id);
        }
        setMessageList(res.data.messages.reverse());
        console.log("hello this is me___---------",res.data);
        // if(res.data.user_image){
        //   //setUserImage(res.data.user_image);
        // }
          setTerritoryImage(res.data.territory_image);
          setIsPrev(res.data.has_next_page);        
          setIsStart(res.data.is_started);
          if(scrollRef.current != undefined){
            setTimeout(()=>{setLoading(false); scrollRef.current.scrollToEnd({animated: true})}, 100);
          }
      })
      .catch((err) =>
        dispatch(showNotification({ type: 'error', message: err.message })),
      )
      .finally(() => setLoading(false));
  },[]);
  
  const updateNewMessage = useCallback(() => {
    console.log("lastMessagse ID ",lastMessageID);
    if(lastMessageID > 0){
      fetchAPI(`/messages/last_activity?territory=${territory.tid}&user=${customer_id}&last_message_id=${lastMessageID}&app=seller`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          console.log("messages update",res.data);       
          if(res.data.messages.length > 0){
            setMessageList((existing) => [...existing, ...res.data.messages.reverse()]);        
            setLastMessageID(res.data.last_message_id);

          }
          if(scrollRef.current != undefined){
            setTimeout(()=>{setLoading(false); scrollRef.current.scrollToEnd({animated: true})}, 100);
          }
          
        })
        .catch((err) =>
          dispatch(showNotification({ type: 'error', message: err.message })),
        )
        .finally(() => setLoading(false));
    }
  },[lastMessageID]);

  useEffect(() => {
    navigation.setParams({
      /*
      action: profile,
      actionTitle: 'Profile',
      actionColor: 'white',
      actionBackground: '#31D457',
      */

      territoryTitle: territory.name,
      territoryImage: territory.app_image,
      territoryAddress: territory.warehouse_address_city + " " + territory.warehouse_address_province
    });

  }, [profile]);

  return (
   
    <Screen isLoading={isLoading}  keyboardAware={true} messageInputKeyboardAware={true}
    stickyBottom = { 
        (
        <View style={Platform.OS === 'ios' ? styles.input_message_ios: styles.input_message}>        
          <Input
            type="textarea"
            placeholder="Type message here"
            value={newMessage}
            onChange={setNewMessage}
            style={Platform.OS === 'ios' ? styles.footer_ios: styles.footer}
          />
          <TouchableOpacity
            disabled={disableBtn}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,marginTop:0}}
            onPress={() => {
              if(!newMessage) {
                return;
              }
              setDisableBtn(true);
              setLoading(true);
              const formData = new FormData();

              formData.append('territory',territory.tid);
              formData.append('app', 'seller');
              formData.append('user', customer_id);
              formData.append('message', newMessage);
              if(userinfo)
              formData.append('first_name', userinfo.firstName);
              if(userinfo)
              formData.append('last_name', userinfo.lastName);
              if(userinfo)
              formData.append('email', userinfo.email);

              // fetchAPI(`/territory/contact`, {
              
              fetchAPI(`/message/create`, {
                  method: 'POST',
                  headers: {
                    authorization: `Bearer ${token ? token : guestToken}`,
                  },
                  body: formData,
                })     
                .then((res) => {
                  setNewMessage('');
                  const msg = [{"by": "territory", "date_created": res.data.message_date, "date_opened": "","is_new": false, "message": res.data.message, "mid" : res.data.message_id, "opened": false, "tid": territory.tid}];
                  setMessageList(messageList.concat(msg));
                  if(scrollRef.current != undefined){
                    setTimeout(()=>{ scrollRef.current.scrollToEnd({animated: true})}, 500);
                    setDisableBtn(false);
                  }
                  dispatch(enterMessageRoom(newMessage));
                })
                .catch((err) =>
                  dispatch(showNotification({ type: 'error', message: err.message })),
                )
                .finally(() => setLoading(false));
            }}>
            <Icon size={25} color={'#000'} name="send" style={{ transform: [{ rotate: '-30deg'}]}} />
          </TouchableOpacity>
        </View>
      )}
    >
      <View>
        {messageList && messageList.length > 0 && (
            <ScrollView
              ref={scrollRef}
              style={{maxHeight: windowHeight - Theme.header.height - 100 + bottomMargin}}
              onScroll={(event)=>{
                if(event.nativeEvent.contentOffset.y == 0 && !loadingMessage && isPrev) {
                  getMoreMessages();
                }
              }}
            >
            {
              messageList.map((item, index)=> (
                <MessageItem
                  key= {index}
                  by={item.by}
                  message={item.message}
                  created={item.date_created}
                  is_new={item.is_new}
                  opened={item.opened}
                  user_image={territory.app_image}
                  my_image={customer_image}
                  onAvatar = {()=>{ setModalVisible(true); fadeIn(); }}
                />
              ))
            }
            </ScrollView>
        )}
        {/* {
          //messageList.find( ({ is_new }) => is_new == false ) && (
          messageList.length > 0 && (userinfo.user_active == false || userImage == Constants.userDefaultAvatar || userImage == '' ) && (
        <View style={styles.container}>
            <DashedLine/>
            <AppText style={{padding: 10, fontWeight: '400'}}>While you are waiting for a reply</AppText>
            <View style={{flexDirection: 'row', paddingBottom: 10}}>
            {(userImage == Constants.userDefaultAvatar || userImage == '') && (
            <TouchableOpacity
              style={{ flex: 1, marginLeft: 10 ,alignItems: 'flex-start', justifyContent: 'center' }}
              onPress={() => {
                setModalVisible(true);
                fadeIn();
            }}>
            <View style={{backgroundColor: "#bbb", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10}}><AppText style={{color: "#fff",fontSize:12}}>UPLOAD A PROFILE PIC</AppText></View>
            </TouchableOpacity>)
            }
            {userinfo.user_active == false &&
            <TouchableOpacity
            style={{ flex: 1, marginLeft:10 , alignItems: 'flex-start', justifyContent: 'center' }}
            onPress={() => {
              NavigationService.navigate('Account/Profile',{message: true});
            }}>
            <View style={{backgroundColor: "#bbb", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10}}><AppText style={{color: "#fff",fontSize:12}}>SET UP A PASSWORD</AppText></View>
          </TouchableOpacity>}
            </View>
            <DashedLine/>
            
        </View>
        )
        } */}
      </View>      
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal
  },

  button : {
    marginTop : 10
  },

  footer : {
    width: '85%',
    backgroundColor: '#fff',
    height: 70,    
    marginTop: 10,
    marginHorizontal: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },

  footer_ios : {
    width: '85%',
    backgroundColor: '#fff',
    height: 70,
    marginBottom:0,
    marginTop: 10,
    marginHorizontal: 5,
    borderRadius:15    
  },

  input_message: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    height:70
  },

  input_message_ios: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    height:70,
    marginBottom:0
  },

  myCartButton: {
    marginHorizontal: 10,
    backgroundColor: "#FFF",
    borderWidth: 0,
    borderRadius: 10,
    height: 60
  },

  buttonText: {
    color: "#06f",
    fontWeight: "bold"
  },

  fadingContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.2,
  },
});

MessageRoomScreen.navigationOptions = ({ navigation }) =>
  MessageRoomNavigationOptions({
    navigation,
    options: {
      headerTitle: '',
    },
  });
