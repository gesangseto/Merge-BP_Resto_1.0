import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {HueSaturationValuePicker} from 'react-native-reanimated-color-picker';
import {colors} from '../../constants';
import Button from './Button';
import Modal from 'react-native-modal';
import ButtonFooterModal from './ButtonFooterModal';
const wheelStyle = {width: '80%'};
const sliderStyle = {height: 45, width: '90%'};

const PickerColor = forwardRef((props, ref) => {
  const {title, required, value, isOpen, onClose, onSubmit, onColorSelected} =
    props;
  const [colorData, setColorData] = useState('');
  const modalizeRef = useRef(null);

  const handleSubmit = () => {
    // console.log(colorData);
    modalizeRef.current?.close();
    if (onSubmit) {
      onSubmit(colorData);
    } else if (onColorSelected) {
      onColorSelected(colorData);
    }
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const colorChanged = ({h, s, v}) => {
    let hex = hslToHex(h, s * 100, v * 100);
    setColorData(hex);
  };

  useEffect(() => {
    setColorData(value);
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isOpen]);

  return (
    <Modalize
      ref={modalizeRef}
      modalHeight={525}
      onClosed={() => (onClose ? onClose() : null)}
      FooterComponent={
        <ButtonFooterModal
          buttonTittle={'Simpan'}
          useTotal={false}
          onClickSubmit={() => handleSubmit()}
        />
      }>
      <View
        style={{
          // backgroundColor: 'red',
          height: 475,
          borderRadius: 15,
          alignItems: 'center',
        }}>
        <View
          style={{
            marginTop: 15,
            padding: 10,
            width: 150,
            marginHorizontal: 15,
            borderRadius: 5,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: colorData,
          }}>
          <Text style={{textAlign: 'center'}}>{colorData}</Text>
        </View>

        <HueSaturationValuePicker
          wheelStyle={wheelStyle}
          sliderStyle={sliderStyle}
          onColorChangeComplete={colorChanged}
          onColorChange={colorChanged}
          initialHue={0}
          initialSaturation={0}
          initialValue={0.7}
        />
      </View>
    </Modalize>
  );
});

export default React.memo(PickerColor);
