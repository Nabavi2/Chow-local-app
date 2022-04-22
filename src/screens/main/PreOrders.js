import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Screen, PreOrderItem,  AppText, Button, Tabs, LoadingGIF} from '~/components';
import { MainNavigationOptions, Theme, GlobalStyles } from '~/styles';
import LinearGradient from 'react-native-linear-gradient';
import { fetchAPI, getTimeAway } from '~/core/utility';
import { NavigationService } from '~/core/services';
import { showNotification,clearNotification,} from '~/store/actions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const PreOrdersScreen = ({navigation}) => {
  const explorer = useSelector((state) => state.explorer);
  const [isLoading, setLoading] = useState(false);
  const [preOrders, setPreOrders] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);
  const [page_order, setPage_order] = useState(0);
  const [totalPages_order, setTotalPages_order] = useState(0);
  
  const openMenu = useCallback(() => {
    navigation.navigate('MyAccount');
  }, []);

  useEffect(()=>{
    let timer;
      timer = setInterval(()=>{
        if (token) {
          console.log("00000pre_ordertimer");
          const formData = new FormData();
          formData.append('app', "seller");
          formData.append('page', 0);
          formData.append('size', (page_order+1)*13);
          fetchAPI('/pre_orders', {
            method: 'POST',
            headers: {
              authorization: `Bearer ${token}`,
            },
            body: formData,
          })      
          .then((res) => {
            console.log("00000000000000");
            setPreOrders(false);
            setPreOrders(res.data.orders.filter((item) => item.status_name != "Error")); 
          })
          .catch((err) =>{}
          )
        }
      },13000);
    return () => {clearInterval(timer)}; 
  },[dispatch,page_order]);

  useEffect(() => {
    if(token){
      const formData = new FormData();
      formData.append('app', "seller");
      formData.append('page', page_order);
      formData.append('size', "13");
      fetchAPI('/pre_orders', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      .then(async (res) => {
        setTotalPages_order(res.data.total_pages);
        //console.log("page order why ????????",res.data.orders.filter((item) => item.status_name != ""));
        if(page_order > 0){
          setPreOrders([...preOrders,...res.data.orders.filter((item) => item.status_name != "Error"),]);
        } else {
          setPreOrders(res.data.orders.filter((item) => item.status_name != "Error"));
        }
        if(res.data.orders.filter((item) => item.status_name != "Error").length < 10) {          
          if (page_order < res.data.total_pages-1) {                
            setPage_order(page_order + 1);            
          }
        }    
      })
      .catch((err) =>
        dispatch(showNotification({ type: 'error', message: err.message })),
    )    
  }
  }, [dispatch,page_order,token]); 

  useEffect(() => {
    navigation.setParams({
      action: openMenu,
      actionTitle: (
        <Icon size={40} color='black' name="menu" />
      ),
    });
  }, []);

const loadMore = useCallback((page,totalPages, activeIndex) => {
  console.log("___------------------",page, totalPages);
  if (page < totalPages-1) {         
    setPage_order(page + 1);   
  }
 });

 const tabData = useMemo(() => {
    let tabData = [];    
    tabData.push({
      content: (
        <View>
           {preOrders && preOrders.length > 0 ? (
            preOrders.map((item, index)=> (
                <TouchableOpacity
                    onPress={() => {
                      NavigationService.navigate('OrderDetails', {
                        orderId: item.order_id,
                        preorder: 'preorder',
                        index: index
                      });
                    }}>
                <PreOrderItem
                order={item} time_ago={String(getTimeAway(item.pre_order_date))}></PreOrderItem>
                </TouchableOpacity>
             ))            
            ): 
            preOrders === false ? (
              <>
                <LoadingGIF />
              </>
          ) :
          <>
          <AppText style={styles.heading}>YOU HAVE NO PAST ORDERS</AppText>
          <AppText style={styles.subheading}>Once a buyer complete an order you'll see it here.</AppText>
          </>
      }
      </View>
      ),
    });
    return tabData;
  }, [preOrders]);
  
  return (
    <Screen hasList isLoading={isLoading}>     
      <View style={styles.container}>
      <AppText style={styles.heading_order}>PRE-ORDERS</AppText>
      <Tabs tabs={tabData} activeTab={0} setPage={()=> {loadMore(page_order, totalPages_order, 0)}}/>
      </View>      
      <LinearGradient
        colors={['#FFFFFF00',  '#ffffffff']}
          style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -10,      
              height: 70,
          }}/>
        
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Theme.layout.screenPaddingTop,
    paddingHorizontal: 20,
    marginBottom: 50
  },

  logoWrapper: {
    marginTop:15,
    height:0,
    position: 'absolute',
    top: 0,
    width: '20%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logoWrapper_android: {
    marginTop:30,
    height:0,
    position: 'absolute',
    top: 0,
    width: '20%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:10,
  },
  logo: {
    width: '100%',
    height: 40,
  },

  heading_order : {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 20,    
  },

  tabView:{
    flexDirection:'row'
  },

  bottomTab: {
    flexDirection:'row',
    paddingHorizontal:10,
    paddingVertical:15,
  },
   
  myCartButton: {
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: Theme.color.backgroundColor,
    height:0
  }, 

  heading : {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10
  },

  subheading : {
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    width: '70%'
  },

  button: {
    marginBottom: 10
  },

  menuButtonTitle:{
    flex:8,
    fontSize:12,
    fontWeight: 'bold',
    textAlign:'left',
    marginLeft:5,
    paddingVertical:5,
    color:'#333'
  },

  menuButtonTitle_clicked: {
    flex:8,
    fontSize:12,
    fontWeight: 'bold',
    textAlign:'left',
    paddingVertical:5,
    marginLeft:5,
    color:'#EEE'
  },
  
});

PreOrdersScreen.navigationOptions = ({ navigation }) =>
MainNavigationOptions({
  navigation,
  options: {
    headerTitle: '',
  },
});
