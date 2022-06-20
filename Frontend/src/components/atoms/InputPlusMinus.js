import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  Text,
} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import {isInt} from '../../helper';
import RequiredText from './RequiredText';

const heightForm = 45;

const InputPlusMinus = React.forwardRef((props, ref) => {
  const {
    title,
    required,
    isError,
    bgColor,
    onChange,
    value,
    minValue,
    maxValue,
    spaceBetween,
  } = props;
  const [formData, setFormData] = useState(0);

  useEffect(() => {
    setFormData(value);
  }, [value]);

  const handleChangeQty = type => {
    let qty = parseInt(formData);
    if (type == 'remove') {
      qty = qty > 0 ? qty - 1 : 0;
    } else {
      qty = qty == 0 ? 1 : qty + 1;
    }
    roleChangeQty(qty);
  };

  const roleChangeQty = val => {
    console.log(val);
    console.log(minValue);
    console.log('=================');
    let qty = val;
    if (minValue || maxValue || minValue == 0) {
      if ((minValue || minValue == 0) && val < minValue) {
        qty = formData;
      } else if (maxValue && val > maxValue) {
        qty = formData;
      }
    }
    if (isInt(qty)) {
      setFormData(qty);
      if (onChange) {
        onChange(qty);
      }
    }
  };

  return (
    <View>
      <Text style={{fontWeight: 'bold', paddingVertical: 5}}>
        {title ?? 'No Title'}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: `${spaceBetween ? 'space-between' : 'flex-start'}`,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.containerMinus}
          onPress={() => handleChangeQty('remove')}>
          <Text
            style={{
              color: colors.danger,
              fontSize: 28,
              fontWeight: 'bold',
            }}>
            -
          </Text>
          {/* <MatComIcon name="minus" color={colors.danger} /> */}
        </TouchableOpacity>
        <TextInput
          keyboardType="numeric"
          style={{
            width: 100,
            height: heightForm,
            backgroundColor: colors.lightGrey,
            marginVertical: 5,
            textAlign: 'center',
          }}
          value={`${formData}`}
          onChangeText={val => roleChangeQty(val)}
        />
        <TouchableOpacity
          style={styles.containerPlus}
          onPress={() => handleChangeQty('add')}>
          <Text
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            +
          </Text>
          {/* <MatComIcon name="plus" color="white" /> */}
        </TouchableOpacity>
      </View>

      <RequiredText show={isError} title={title} />
    </View>
  );
});

export default React.memo(InputPlusMinus);

const styles = StyleSheet.create({
  containerMinus: {
    height: heightForm,
    width: 45,
    // justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  containerPlus: {
    height: heightForm,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
