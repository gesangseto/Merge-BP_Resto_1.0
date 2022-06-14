import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors} from '../../constants';
import Button from './Button';

const CoupleButton = React.forwardRef((props, ref) => {
  const {onPressSave, onPressCancel, titleSave, titleCancel, fullSize} = props;
  useEffect(() => {}, []);

  const handleSave = () => {
    if (onPressSave) {
      onPressSave();
    }
  };

  const handleCancel = () => {
    if (onPressCancel) {
      onPressCancel();
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        // margin: 10,
      }}>
      {fullSize ? (
        <>
          <TouchableOpacity
            style={{...styles.buttonContainerLeft, backgroundColor: 'red'}}
            onPress={() => handleCancel()}>
            <Text style={styles.textBtn}>{titleCancel ?? 'Batal'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.buttonContainerRight, backgroundColor: 'green'}}
            onPress={() => handleSave()}>
            <Text style={styles.textBtn}>{titleSave ?? 'Simpan'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Button
            onPress={() => handleCancel()}
            title={titleCancel ?? 'Batal'}
            color={colors.danger}
            textColor={'white'}></Button>
          <Button
            onPress={() => handleSave()}
            title={titleSave ?? 'Simpan'}
            color={colors.success}
            textColor={'white'}></Button>
        </>
      )}
    </View>
  );
});

export default React.memo(CoupleButton);

const styles = StyleSheet.create({
  textBtn: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainerRight: {
    backgroundColor: 'green',
    flex: 1,
    height: 50,
    marginTop: 30,
    borderBottomRightRadius: 15,
    justifyContent: 'center',
  },
  buttonContainerLeft: {
    backgroundColor: 'green',
    flex: 1,
    height: 50,
    marginTop: 30,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
  },
});
