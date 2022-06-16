import React, {useEffect} from 'react';
import {Text, TextInput, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';

const InputText = React.forwardRef((props, ref) => {
  const {title, required, isError, bgColor, styleInput} = props;

  useEffect(() => {}, []);

  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Text style={{fontWeight: 'bold', paddingVertical: 5}}>{title}</Text>
        {required && (
          <Text style={{color: colors.danger, paddingVertical: 5}}> *</Text>
        )}
      </View>
      <TextInput
        style={{
          backgroundColor: bgColor ? bgColor : colors.lightGrey,
          borderRadius: 10,
          height: 45,
          padding: 10,
          ...styleInput,
        }}
        {...props}
      />
      {isError && (
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

export default React.memo(InputText);
