import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const RenderToastView = ({toastOptions}) => {
  const [type, setType] = useState('info');
  const [color, setColor] = useState('#ff9800');
  const [icon, setIcon] = useState('info');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (toastOptions.type && toastOptions.type == 'error') {
      setColor('#c40001');
      setIcon('stop');
      setType('error');
    } else if (toastOptions.type && toastOptions.type == 'success') {
      setColor('#00b14d');
      setIcon('check');
      setType('success');
    }
    if (toastOptions.message) {
      setMessage(toastOptions.message);
    }
  }, [toastOptions]);

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: `${color}`,
          paddingHorizontal: 10,
          justifyContent: 'center',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          minWidth: '15%',
        }}>
        <Icon
          style={{alignSelf: 'center'}}
          name={`${icon}`}
          color={'white'}
          size={40}
        />
      </View>
      <View
        style={{
          backgroundColor: `${color}`,
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: 'white',
          minWidth: '60%',
        }}>
        <Text
          style={{
            color: `${color}`,
            paddingVertical: 5,
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          {type}
        </Text>
        <Text style={{color: 'black', paddingBottom: 15}}>{message}</Text>
      </View>
      <View
        style={{
          borderColor: `${color}`,
          justifyContent: 'center',
          borderWidth: 3,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
    </View>
  );
};

export default RenderToastView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 5,
    marginHorizontal: 50,
    marginVertical: 5,
    elevation: 10,
  },
});
