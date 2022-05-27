import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../constants';
import {curencyFormating} from '../../helper';

const ButtonHeaderModal = React.forwardRef((props, ref) => {
  const {
    buttonTittle,
    buttonColor,
    totalText,
    onClickSubmit,
    useButton = true,
  } = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        backgroundColor: colors.lightGrey,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'flex-end',
          alignItems: 'flex-end',
          paddingRight: 20,
        }}>
        <Text>Grand Total</Text>
        <Text style={{fontWeight: 'bold'}}>
          RP. {curencyFormating(totalText ? totalText : 0)}
        </Text>
      </View>
      {useButton ? (
        <TouchableOpacity
          onPress={() => (onClickSubmit ? onClickSubmit() : null)}
          style={{
            width: 150,
            backgroundColor: buttonColor ? buttonColor : colors.success,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            {buttonTittle ? buttonTittle : 'ORDER'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

export default React.memo(ButtonHeaderModal);
