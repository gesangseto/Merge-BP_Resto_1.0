import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {colors} from '../../constants';
import Button from './Button';

const CoupleButton = React.forwardRef((props, ref) => {
  const {onPressSave, onPressCancel} = props;
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
        margin: 10,
      }}>
      <Button
        onPress={() => handleCancel()}
        title="Batal"
        color={colors.danger}
        textColor={'white'}></Button>
      <Button
        onPress={() => handleSave()}
        title="Simpan"
        color={colors.success}
        textColor={'white'}></Button>
    </View>
  );
});

export default React.memo(CoupleButton);
