import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import { Theme } from '~/styles';

import { AppText } from '~/components';
import { CANCEL } from '@redux-saga/core';


export const MessageTerritoryItem = ({ 
    message,
    created,
    user_image,
    territory_title,
    unread,
    is_new
 }) => (
    is_new == true ?
    <View style={{backgroundColor: Theme.color.accentColor, flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
        <View style={{flexDirection: "row",flex:7}}>
            <View style={styles.imageContainer, {flex:1.3}}>
                <Image
                    source={{ 
                            uri: 
                                user_image ||
                                'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                            }}
                    style={styles.image}
                />
            </View>

            <View style={{marginLeft: 15,flex:9, justifyContent: 'center'}}>
                <View style={{flexDirection: "row"}}>
                    <AppText numberOfLines={1} style={{fontWeight: 'bold', color: 'white'}}> {territory_title} </AppText>
                    { unread > 0 &&<AppText style={{borderRadius: 3,textAlign:"center", fontSize: 10, color: "#fff", backgroundColor: "#000", height: 15, minWidth: 13, paddingLeft:2, paddingRight: 2, fontWeight: "bold", borderRadius: 25, alignItems:"center"}}>{unread}</AppText> }
                </View>
                <View>
                    <AppText style={{fontSize: 12, color: 'white', height: 18}} numberOfLines={1}> {message} </AppText>
                </View>
            </View>
        </View>
               
        <View style={{flex:2}}>
            <AppText style={{fontSize: 13, color: 'white', fontWeight: '400', textAlign:'right'}}> {created} </AppText>
        </View>             
    </View> :  <View style={{backgroundColor: "#EFEFEF", flexDirection: "row", padding: 10, justifyContent:"space-between",marginBottom: 10}}>
        <View style={{flexDirection: "row",flex:7}}>
            <View style={styles.imageContainer, {flex:1.3}}>
                <Image
                    source={{ 
                            uri: 
                                user_image ||
                                'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                            }}
                    style={styles.image}
                />
            </View>

            <View style={{marginLeft: 15,flex:9, justifyContent: 'center'}}>
                <View style={{flexDirection: "row"}}>
                    <AppText numberOfLines={1} style={{fontWeight: 'bold', color: 'black'}}> {territory_title} </AppText>
                    { unread > 0 &&<AppText style={{borderRadius: 3,textAlign:"center", fontSize: 10, color: "#fff", backgroundColor: "#f00", height: 15, minWidth: 13, paddingLeft:2, paddingRight: 2, fontWeight: "bold", borderRadius: 25, alignItems:"center"}}>{unread}</AppText> }
                </View>
                <View>
                    <AppText style={{fontSize: 12, color: 'grey', height: 18}} numberOfLines={1}> {message} </AppText>
                </View>
            </View>
        </View>
               
        <View style={{flex:2}}>
            <AppText style={{fontSize: 13, color: 'grey', fontWeight: '400', textAlign:'right'}}> {created} </AppText>
        </View>             
    </View> 

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
        borderWidth: 0,
        borderRadius: 40,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40,
    }
  });