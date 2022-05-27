import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';

const InputTextPressable = React.forwardRef((props, ref) => {
  const {title, required, bgColor, icon, value} = props;
  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Text style={{fontWeight: 'bold', paddingVertical: 5}}>{title}</Text>
        {required && (
          <Text style={{color: colors.danger, paddingVertical: 5}}>*</Text>
        )}
      </View>
      <View style={styles.searchSection}>
        {icon ? (
          <MatComIcon
            style={styles.searchIcon}
            name={icon}
            size={30}
            color="#000"
          />
        ) : null}
        <TouchableOpacity
          style={{
            backgroundColor: bgColor ? bgColor : colors.lightGrey,
            borderRadius: 10,
            height: 45,
            width: icon ? 340 : 390,
            padding: 10,
          }}
          {...props}>
          <Text>{value}</Text>
        </TouchableOpacity>
      </View>
      {required && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <MatComIcon
            name="alert-circle-outline"
            size={15}
            color={colors.red}
            style={{paddingVertical: 3}}
          />
          <Text style={{padding: 5, fontSize: 10, color: colors.red}}>
            {title} is required
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});

export default React.memo(InputTextPressable);
