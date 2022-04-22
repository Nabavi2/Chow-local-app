import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import parseAddress from 'parse-address-string';

import { Loading } from '..';
import { AppText } from '~/components';
process.nextTick = setImmediate;
export const StoredAddressDelivery = ({ address }) => {
  const [parsedAddress, setParsedAddress] = useState();

  useEffect(() => {
    address ?
      parseAddress(address, (err, addressObj) => {
        err = err;
        setParsedAddress(addressObj);
      }): parseAddress(address, (err, addressObj) => {
        err = err;
        setParsedAddress(addressObj);
      });
  }, [address]);

  return parsedAddress ? (
    <View style={styles.pastAddress}>
      <AppText style={styles.addressString} numberOfLines={1}>
        {`${parsedAddress.street_address1 ? parsedAddress.street_address1+',' :''} `}
      </AppText>
      <AppText style={styles.zipCodeString} numberOfLines={1}>
        {parsedAddress.city}, {parsedAddress.state}
      </AppText>
    </View>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  addressString: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  zipCodeString: {
    flex: 1,
    fontSize: 16,
  },

  pastAddress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
