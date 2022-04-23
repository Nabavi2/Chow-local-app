import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import { NavigationService } from '~/core/services';
import { Screen, Button, Input, AppText } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';

import { fetchAPI, formatCCExpiry } from '~/core/utility';
import { showNotification } from '~/store/actions';

export const UpdateCreditCardScreen = ({ navigation }) => {
  const territory_id = useMemo(() => navigation.getParam('territory_id'), []);
  const payButton_text = useMemo(() => navigation.getParam('payButton_text'), []);
  const setStatus = useMemo(() => navigation.getParam('action'), []);
  const [card, setCard] = useState({});
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.account.token);

  const _pay = useCallback(() => {
    
    setLoading(true);
    const expDate = card.expDate && card.expDate.split('/');
    const formData = new FormData();
    formData.append('territory', territory_id);
    formData.append('card_name', card.name);
    formData.append('card_number', card.number);
    formData.append('card_exp_month', expDate && expDate[0].trim());
    formData.append('card_exp_year', expDate && expDate[1].trim());
    formData.append('card_cvv', card.cvc);
    formData.append('card_postal_code', card.postalCode);
    formData.append('app', 'seller');

    fetchAPI('/territory_subscription/card_submit', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(async (res) => {
        const formData = new FormData();
        formData.append("territory", territory_id); 
        formData.append("app", "seller");
        await fetchAPI(`/territory_subscription/restart`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        .then((res) => {
          setStatus("Active");
          dispatch(showNotification({ type: 'success', message: res.message }));
          NavigationService.goBack();
        })
        .catch((err) =>
          dispatch(showNotification({ type: 'error', message: err.message }))
        )
        .finally(() => setLoading(false));
      })
      .catch((err) =>{
        dispatch(showNotification({ type: 'error', message: err.message}));
      })
      .finally(() => setLoading(false));
  }, [ card, token]);


  useEffect(() => {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload();
    }
  }, []);
  
  const payButtonText = "Pay - " + payButton_text;

  return (
    <Screen isLoading={isLoading} hasList
    showHeaderOverLayOnScroll keyboardAware={true}
    >
      <View style={styles.container}>
        <Input
          style={GlobalStyles.formControl}
          title="Card Number"
          type="creditCard"
          placeholder="XXXX XXXX XXXX XXXX"
          keyboardType="number-pad"
          value={card.number}
          onChange={(e) => setCard({ ...card, number: e })}
          actionIcon="credit-card-scan"
          actionHandler={() => {
            CardIOModule.scanCard()
              .then((card) => {
                // the scanned card
                setCard({
                  name: card.cardholderName,
                  number: card.cardNumber.toString(),
                  expDate: formatCCExpiry(
                    `${card.expiryMonth.toString()}/${card.expiryYear.toString()}`,
                  ),
                  cvc: card.cvv,
                  postalCode: card.postalCode,
                });
              })
              .catch(() => {
                // the user cancelled
              });
          }}
        />
        <Input
          style={GlobalStyles.formControl}
          type="creditCard"
          title="Name on Card"
          placeholder="Name on Card"
          value={card.name}
          onChange={(e) => setCard({ ...card, name: e })}
        />
        <Input
          style={GlobalStyles.formControl}
          title="Expiry Date"
          type="creditCard"
          placeholder="XX / XXXX"
          value={card.expDate}
          keyboardType="number-pad"
          onChange={(e) => setCard({ ...card, expDate: formatCCExpiry(e) })}
        />
        <Input
          style={GlobalStyles.formControl}
          title="CVC Number"
          type="creditCard"
          placeholder="XXX"
          value={card.cvc}
          keyboardType="number-pad"
          onChange={(e) => setCard({ ...card, cvc: e })}
        />
        <Input
          style={GlobalStyles.formControl}
          title="ZIP/Postal Code"
          type="creditCard"
          placeholder="XXXX"
          value={card.postalCode}
          onChange={(e) => setCard({ ...card, postalCode: e })}
        />        
        <Button style={GlobalStyles.formControl} type="accent-green" onClick={_pay}>
          {payButtonText}
        </Button>        
        <View style={GlobalStyles.formControl}>
          <Image
            style={styles.image}
            source={require('~/assets/images/payment.png')}
            resizeMode="contain"
          />
        </View>      
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Theme.layout.screenPaddingHorizontal,
    paddingTop: Theme.layout.screenPaddingTop,
    paddingBottom: Theme.layout.screenPaddingBottom,
 
  },

  name: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  number: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 10,
    color: Theme.color.accentColor,
  },

  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardNumber: {
    marginTop: 5,
    color: Theme.color.accentColor,
  },

  image: {
    width: 200,
    height: 30,
    marginTop: 10,
    alignSelf: 'center',
  },

  stripeDescription: {
    marginTop: 10,
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
  },
});

UpdateCreditCardScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: 'Credit Card',
    },
  });
