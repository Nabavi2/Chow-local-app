import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemeColors } from 'react-navigation';

import { AppText } from '~/components';
import { Theme } from '../../styles/theme';


export const OrderItem = ({ 
    order,
    time_ago
 }) => (
     order != false ?    
     order.is_new && order.is_new == true || order.status_name == 'New' ?
     <View style={{backgroundColor: Theme.color.accentColor, flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
     <View style={{flexDirection: "row",flex: 4}}>
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
 
         <View style={{marginLeft: 15}}>
             <View style={{flexDirection: "row"}}>
                 <AppText style={{fontWeight: 'bold',paddingRight:10, color:'white'}} numberOfLines={1}>{"#"+order.order_id}</AppText>
             </View>
             <View style={{marginTop: 3}}>
                 <AppText style={{fontSize: 12, color: 'white', height: 16}} numberOfLine={1}> {time_ago} </AppText>
             </View>
         </View>
     </View>               
     <View style={{flex:4}}>
         <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left',color:'white'}}>{order.status_name}</AppText></View>
         <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: 'white', fontWeight: '400', textAlign: 'left'}}> {order.total_amount_formatted} </AppText>
     </View>  
     {/* <View style={{flex:3}}>
         <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left'}}></AppText></View> */}
         {/* <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: '#31D457', fontWeight: '400', textAlign: 'right'}}> {order.status_name} </AppText> */}
     {/* </View>               */}
 </View> :
    <View style={{backgroundColor: "#EFEFEF", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
        <View style={{flexDirection: "row",flex: 4}}>
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

            <View style={{marginLeft: 15}}>
                <View style={{flexDirection: "row"}}>
                    <AppText style={{fontWeight: 'bold',paddingRight:10, color:'black'}} numberOfLines={1}>{"#"+order.order_id}</AppText>
                </View>
                <View style={{marginTop: 3}}>
                    <AppText style={{fontSize: 12, color: '#777', height: 16}} numberOfLine={1}> {time_ago} </AppText>
                </View>
            </View>
        </View>               
        <View style={{flex:4}}>
            <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left', color:'black'}}>{order.status_name}</AppText></View>
            <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: Theme.color.accentColor, fontWeight: '400', textAlign: 'left'}}> {order.total_amount_formatted} </AppText>
        </View>  
        {/* <View style={{flex:3}}>
            <View style={{flex: 1}}><AppText style={{fontSize: 13, fontWeight: '400', textAlign: 'left'}}></AppText></View> */}
            {/* <View style={{flex: 1}}></View><AppText style={{fontSize: 13, color: '#31D457', fontWeight: '400', textAlign: 'right'}}> {order.status_name} </AppText> */}
        {/* </View>               */}
    </View>   :<></>
    
  );

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