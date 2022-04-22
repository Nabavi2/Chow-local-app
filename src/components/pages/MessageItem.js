import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity} from 'react-native';

import { AppText } from '~/components';


export const MessageItem = ({ 
    by,
    message,
    created,
    is_new,
    opened,
    user_image,
    my_image
 }) => (
    <View style={styles.container}>
        <View style={by != "user" ? {flexDirection: 'row', justifyContent: 'flex-end'} : {flexDirection: 'row'}}>
            <AppText style={styles.created}>
                {created}
            </AppText>
        </View>
        {
        by != "user" ?
        <View style={styles.content}>
        
            <View style={styles.messageContainer }>
                <AppText style={styles.message}>{message}</AppText>
            </View>
            <View style={styles.imageContainer}>                
                <Image
                    source={{ 
                        uri: 
                            user_image ||
                            'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                        }}
                    style={styles.image}
                />
            </View>
        </View>
        :
        <View style={styles.content_left}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ 
                        uri: 
                            my_image ||
                            'https://via.placeholder.com/450?text=Image%20is%20not%20available',
                        }}
                    style={styles.image}
                />
            </View>
            <View style={styles.messageContainer}>
                <AppText style={styles.message}>{message}</AppText>
            </View>
        </View>
        }
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 20,
      paddingRight: 20
    },
    created: {
        fontSize: 8,
        marginBottom: 10,
        opacity: 0.8,
        paddingHorizontal: 60
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    content_left: {
        flexDirection: 'row'
    },
    messageContainer: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#EFEFEF',
        maxWidth: Dimensions.get('window').width - 90,
        marginLeft: 10,
        marginRight: 10,
    },
    message: {
        color: 'grey'
    },
    imageContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        borderColor: '#DDD',
        borderWidth: 0,
        borderRadius: 90,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    }
  });