import React,{useState} from 'react';
import { View, StyleSheet, Image } from 'react-native';
import parseAddress from 'parse-address-string';
import { AppText } from '~/components';
import { Theme } from '../../styles/theme';

export const SellerItem = ({ 
    seller,
    subscription = false,
 }) => {
    return (
        console.log("sssssssssssssssssssss",seller),
     seller != false ? subscription == false ? 
        <View style={seller.active == true && seller.force_closed == false && seller.force_closed_till == null ? {backgroundColor: "#def7df", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10} : {backgroundColor: "#fdbfbf", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
            <View style={{flexDirection: "row",flex: 4}}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ 
                                uri: 
                                    seller.app_image ||
                                    'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                                }}
                        style={styles.image}
                    />
                </View>    
                <View style={{marginLeft: 15}}>
                    <View style={{flexDirection: "row"}}>
                        <AppText style={{fontWeight: 'bold',paddingRight:10, color:'black'}} numberOfLines={1}>{seller.name}</AppText>
                    </View>
                    <View style={{marginTop: 3}}>
                        <AppText style={{fontSize: 12, color: 'black', height: 16}} numberOfLine={1}>{seller.address}</AppText>
                    </View>
                </View>
            </View>               
            <View style={{flex:1}}>
                <View style={{flex: 1, justifyContent:'center'}}><AppText style={seller.active == true && seller.force_closed == false && seller.force_closed_till == null ? {fontSize: 13, fontWeight: '400', color:'#38d455'} : {fontSize: 13, fontWeight: '400', color:'#ed0e26'}}>{seller.active == true && seller.force_closed == false ? 'OPEN' : 'CLOSED'}</AppText></View>           
            </View>     
    </View> : 
    <View style={seller.subscription_is_active == true ? {backgroundColor: "#def7df", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10} : {backgroundColor: "#fdbfbf", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
        <View style={{flexDirection: "row",flex: 4}}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ 
                            uri: 
                                seller.app_image ||
                                'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                            }}
                    style={styles.image}
                />
            </View>    
            <View style={{marginLeft: 15}}>
                <View style={{flexDirection: "row"}}>
                    <AppText style={{fontWeight: 'bold',paddingRight:10, color:'black'}} numberOfLines={1}>{seller.name}</AppText>
                </View>
                <View style={{marginTop: 3}}>
                    <AppText style={{fontSize: 12, color: 'black', height: 16}} numberOfLine={1}>{seller.address}</AppText>
                </View>
            </View>
        </View>
        <View style={{flex:1}}>
            <View style={{flex: 1, justifyContent:'center'}}><AppText style={seller.subscription_is_active == true ? {fontSize: 12, fontWeight: '400', color:'#38d455'} : {fontSize: 12, fontWeight: '400', color:'#ed0e26'}}>{seller.subscription_is_active == true ? 'ACTIVE' : 'INACTIVE'}</AppText></View>           
        </View>
    </View>
  : <></>
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