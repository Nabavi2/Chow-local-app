import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

import { NavigationService } from '~/core/services';
import { Screen, Button, AppText } from '~/components';
import { GlobalStyles, MainNavigationOptions, Theme } from '~/styles';

export const SelectorPageScreen = ({ navigation }) => {
  const header = useMemo(() => navigation.getParam('header'), []);
  const options = useMemo(() => navigation.getParam('options'), []);
  const action = useMemo(() => navigation.getParam('action'), []);
  const noOptionsText = useMemo(() => navigation.getParam('noOptionsText'));
  const selected = useMemo(() => navigation.getParam('selected'), [navigation]);

  return (
    <Screen hasList>
      <View style={styles.container}>
        {header && <AppText style={styles.header}>{header}</AppText>}
        {options && options.length > 0 ? (
          <FlatList
            style={styles.list}
            alwaysBounceVertical={false}
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                item && (
                  <Button
                    type={
                      selected
                        ? item.value === selected
                          ? 'bordered-black'
                          : 'bordered-grey'
                        : 'bordered-black'
                    }
                    style={GlobalStyles.formControl}
                    onClick={() => {
                      action(item.value);
                      NavigationService.goBack();
                    }}>
                    {item.label}
                  </Button>
                )
              );
            }}
          />
        ) : (
          <Text allowFontScaling={false} style={styles.textStyle}>{noOptionsText}</Text>
        )}
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

  header: {
    marginVertical: 15,
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  textStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

SelectorPageScreen.navigationOptions = ({ navigation }) =>
  MainNavigationOptions({
    navigation,
    options: {
      headerTitle: navigation.getParam('title'),
    },
  });
