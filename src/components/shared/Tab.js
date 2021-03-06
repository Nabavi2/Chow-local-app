import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Theme} from '~/styles';

export const Tab = ({tabs, setPage}) => {
  const [contentSizeChanged, setContentSizeChanged] = useState(false);
  const [contentsize, setContentsize] = useState(0);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 500;
    if (contentSize.height != contentsize) {
      setContentsize(contentSize.height);
      setContentSizeChanged(true);
    }
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)) {
          if (contentSizeChanged) {
            setPage();
            setContentSizeChanged(false);
          }
        }
      }}
      scrollEventThrottle={100}>
      {tabs.length > 1 && <View style={styles.tab}></View>}
      <View style={styles.tabContent}>
        {typeof tabs[activeTabIndex] != null && tabs[activeTabIndex].content}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  tabButton: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#BBB',
    borderRadius: 5,
  },
  tabButtonText: {
    color: '#E1E1E1',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  tabButtonActive: {
    backgroundColor: Theme.color.accentColor,
  },
  tabButtonTextActive: {
    color: '#FFF',
  },
  tabContent: {
    paddingTop: 10,
    flex: 1,
    minHeight: '100%',
  },
});
