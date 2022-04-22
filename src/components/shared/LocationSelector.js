import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Config } from '~/core/config';
import { AppText } from './AppText';
import { Theme, Controls } from '~/styles';

export const LocationSelector = ({
  value,
  onChange,
  actionHandler,
  selectCurrentLocation,
  style,
  mapRef,
  country
}) => (
  <View style={[styles.wrapper, styles.text, style]}>
    {/* <TouchableOpacity
      style={[styles.title, styles.titleIconWrapper]}
      activeOpacity={0.8}
      onPress={selectCurrentLocation}>
      <Image
        style={styles.titleImage}
        source={require('~/assets/images/map-icon.png')}
        resizeMode="contain"
      />
    </TouchableOpacity> */}
      <View style={styles.titleTextWrapper}>
       <AppText style={styles.titleText}>Street</AppText>
    </View>
    <GooglePlacesAutocomplete
      ref={mapRef}
      placeholder="Enter your address"
      textInputProps={{ placeholderTextColor: "#c8c8c8" }}
      returnKeyType={'search'}
      fetchDetails={true}
      keyboardShouldPersistTaps="always"
      listViewDisplayed={false}     
      query={ {
        key: Config.googleAPIKey,
        language: 'en',
        types: "address",
      //   components: 'country:' + country,
      // } : {
      //   key: Config.googleAPIKey,
      //   types: "address",
       }}
      GooglePlacesSearchQuery={{
        rankby: 'distance',
      }}
      getDefaultValue={() => value || ''}
      currentLocation={false}
      styles={{
        textInputContainer: {
          backgroundColor: '#dedede',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          height: 50,
          alignItems:'center',  
        },
        listView:{
          marginLeft:-88,
          backgroundColor: '#dedede',
        },
        textInput: {
          backgroundColor: '#dedede',
          color: '#000',
          fontSize: 14,
          alignItems:'center',
          marginTop:0,
          height: 30,
        },
      }}
      onPress={(data, details = null) => {
        onChange(details);        
      }}
    />    
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e7e7e7',
    width: '100%',
  },

  input: {
    flexGrow: 1,
    fontSize: Controls.input.fontSize,
  },

  text: {
    // height: Controls.input.height,
    color: Controls.input.color,
  },

  title: {
    display: 'flex',
    justifyContent: 'center',
  },

  titleIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: Controls.input.height,
    height: Controls.input.height,
  },

  titleText: {
    fontWeight: 'bold',
    fontSize: Controls.input.fontSize,
  },

  titleImage: {
    width: Controls.input.imageWidth,
    height: Controls.input.imageHeight,
  },

  titleTextWrapper: {
    width: 95,
    paddingHorizontal: 10,
    paddingTop:15
  },


  actionWrapper: {
    width: Controls.input.height,
    height: Controls.input.height,
    backgroundColor: Theme.color.accentColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
