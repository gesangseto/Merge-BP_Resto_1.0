import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const IconWithBadge = props => {
  const {text, iconName, iconSize, iconColor} = props;
  const [badgeText, setBadgeText] = useState(0);
  useEffect(() => {
    setBadgeText(text);
  }, [props]);
  return (
    <View style={{height: 30, justifyContent: 'center'}}>
      <MatComIcon
        name={iconName ?? 'cart-variant'}
        size={iconSize ?? 22}
        color={iconColor ?? 'grey'}
      />
      {text ? (
        <View style={styles.badgeStyle}>
          <Text style={styles.BadgeTxt}>{badgeText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeStyle: {
    position: 'absolute',
    right: -5,
    top: -5,
  },
  BadgeTxt: {color: 'red', fontWeight: 'bold'},
});
