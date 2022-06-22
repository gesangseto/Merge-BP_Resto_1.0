import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import ThermalPrinterModule from 'react-native-thermal-printer';
import {colors} from '../../constants';
import {ButtonFooterModal, SelectOption} from '../atoms';

const heightForm = 45;
const FormSetPrinter = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen, isLoading} = props;
  const [formData, setFormData] = useState({});
  const [listPrinter, setListPrinter] = useState([]);
  const [listWidthPrinter, setListWidthPrinter] = useState([
    {id: '80', name: '80 MM'},
    {id: '58', name: '58 MM'},
  ]);

  const [isError, setIsError] = useState({printer: false, width: false});
  const modalizeSetPrinter = useRef(null);

  const refreshBluetooth = async () => {
    try {
      let device = await ThermalPrinterModule.getBluetoothDeviceList();
      if (device.length === 0) {
        setIsError({
          ...isError,
          printer: `Bluetooth devices won't connect, it's likely because bluetooth does not turn on,\nor aren't in pairing mode, or the devices are out of range`,
        });
        return;
      }
      setIsError(false);
      device.map(opt => ({label: opt.macAddress, value: opt.deviceName}));
      device = device.map(function (it, index) {
        return {printerbtaddress: it.macAddress, printerbtname: it.deviceName};
      });
      setListPrinter([...device]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshBluetooth();
      modalizeSetPrinter.current?.open();
    } else {
      modalizeSetPrinter.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData({...item});
  }, [item]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleSelectPrinter = id => {
    let _data = formData;
    for (const it of listPrinter) {
      if (id[0] === it.printerbtaddress) {
        _data.printerbtaddress = it.printerbtaddress;
        _data.printerbtname = it.printerbtname;
      }
    }
    if (id.length === 0) {
      setFormData({});
    } else {
      setFormData({..._data});
    }
  };

  useEffect(() => {
    validation();
  }, [formData]);

  const validation = () => {
    let _err = {printer: false, width: false};
    if (!formData.printerbtaddress || !formData.printerbtwidth) {
      _err.printer = !formData.printerbtaddress ? true : false;
      _err.width = !formData.printerbtwidth ? true : false;
      setIsError({..._err});
      return false;
    } else {
      setIsError({..._err});
      return true;
    }
  };

  const handleSubmit = () => {
    if (!validation()) {
      return;
    }
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeSetPrinter}
        onClosed={() => handleCancel()}
        modalHeight={325}
        FooterComponent={
          <ButtonFooterModal
            useTotal={false}
            isLoading={isLoading}
            // buttonColor={itemData.isavailable ? colors.danger : colors.success}
            buttonTittle={'Save'}
            onClickSubmit={() => handleSubmit()}
          />
        }>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontWeight: 'bold',
              paddingTop: 20,
            }}>
            {formData.kitchenname}
          </Text>
          <SelectOption
            title={'Printer'}
            isError={isError.printer}
            showSearchBox={false}
            options={listPrinter}
            value={formData.printerbtaddress}
            valueId={'printerbtaddress'}
            valueName={'printerbtname'}
            onSelect={id => handleSelectPrinter(id)}
          />
          <SelectOption
            title={'Width'}
            isError={isError.width}
            showSearchBox={false}
            options={listWidthPrinter}
            value={formData.printerbtwidth}
            onSelect={id =>
              setFormData({
                ...formData,
                printerbtwidth: id[0],
              })
            }
          />
        </View>
      </Modalize>
      {/* <Modal
        isVisible={visibleModal}
        onBackButtonPress={() => {
          setVisibleModal(false);
          onCancel ? onCancel() : null;
        }}
        onBackdropPress={() => {
          setVisibleModal(false);
          onCancel ? onCancel() : null;
        }}>
        
      </Modal> */}
    </Portal>
  );
});

export default React.memo(FormSetPrinter);

const styles = StyleSheet.create({
  boxDevice: {
    backgroundColor: colors.lightGrey,
    width: 300,
    height: 40,
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  textError: {
    fontSize: 10,
    paddingLeft: 25,
    marginTop: -5,
    color: colors.danger,
  },
  textNote: {
    height: heightForm * 3,
    textAlignVertical: 'top',
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    marginLeft: 25,
    marginVertical: 5,
    marginHorizontal: 25,
  },
  boxContainer: {
    elevation: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
  },
  imageContainer: {backgroundColor: 'white', width: 75, marginLeft: 5},
  containerPlusMinus: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerMinus: {
    height: heightForm,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 25,
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
