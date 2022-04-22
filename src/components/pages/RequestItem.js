import React, {useEffect, useState,} from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemeColors } from 'react-navigation';

import { AppText } from '~/components';
import { Theme } from '../../styles/theme';
import parseAddress from 'parse-address-string';
import LinearGradient from 'react-native-linear-gradient';
export const RequestItem = ({ 
    order,
    time_ago
 }) => {
     const [address, setPickupAddress] = useState(false);
     parseAddress(order.drop_off_address, (err, addressObj) => {
        err = err;
        setPickupAddress(addressObj.street_address1);
      })
     return (order != false ?     
    <View style={{backgroundColor: "#EFEFEF", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
         <View style={styles.imageContainer}>
                <Image
                    source={{ 
                            uri: 
                                order.territory.app_image ||
                                'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                            }}
                    style={styles.image}
                />
            </View>
        <View style={{flexDirection: "row",flex: 1}}>     
            <View style={{marginLeft: 15}}>
                <View style={{flexDirection: "row"}}>
                    <AppText style={{fontWeight: 'bold',paddingRight:10, color:'black'}} numberOfLines={1}>Order {order.type == "outside" ? order.order_nr : "#"+order.order_id}  <AppText style={{paddingRight:10, color:'black'}} numberOfLines={1}>
                        {address}</AppText></AppText>
                </View>
                <View style={{marginTop: 0}}>
                    <AppText style={{fontSize: 12, color: '#000', height: 20}} numberOfLine={1}>{time_ago}   <AppText style={{fontSize: 14, fontWeight: '400', textAlign: 'right', color: order.status_color}}>{order.status_name}<AppText style={{fontSize: 12, color: '#000', height: 20}}>{order.status_slug == "delivered" && " ("+order.delivery_time+")"}</AppText></AppText></AppText>
                </View>
            </View>
        </View>
        {order.status_slug == "delivered" &&
      <LinearGradient
        colors={['#FFFFFF77',  '#ffffff77']}
          style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,      
              height: 70,
          }}/>}
        {/* <View style={{flex:5}}>
            <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left', color:'black'}}>{"#"+order.order_id}</AppText></View>
            <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: Theme.color.accentColor, fontWeight: '400', textAlign: 'left'}}>{order.order_total_amount_formatted} </AppText>
        </View>            */}
        {/* <View style={{flex:2}}>
            <View style={{flex: 1}}><AppText style={{fontSize: 14, fontWeight: '400', textAlign: 'left', color:'black'}}>{order.status_name}</AppText></View>            
        </View>   */}
        {/* <View style={{flex:3}}>
            <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left'}}></AppText></View> */}
            {/* <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: '#31D457', fontWeight: '400', textAlign: 'right'}}> {order.status_name} </AppText> */}
        {/* </View>               */}
    </View>   :<></>    
 )};

  const styles = StyleSheet.create({
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
        borderWidth: 1,
        borderRadius: 40,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40,
    }
  });