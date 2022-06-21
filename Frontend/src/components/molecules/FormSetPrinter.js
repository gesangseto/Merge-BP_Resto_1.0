import {Portal} from '@gorhom/portal';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import ThermalPrinterModule from 'react-native-thermal-printer';
import {colors} from '../../constants';

const heightForm = 45;

const FormSetPrinter = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen, title, message} = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [itemData, setItemData] = useState(item);
  const [listPrinter, setListPrinter] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    refreshBluetooth();
  }, []);

  const refreshBluetooth = async () => {
    try {
      let device = await ThermalPrinterModule.getBluetoothDeviceList();
      if (device.length === 0) {
        setIsError(true);
        return;
      }
      setListPrinter([...device]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setVisibleModal(true);
    } else {
      setVisibleModal(false);
    }
  }, [isOpen]);

  const handleSelectPrinter = async item => {
    if (onSave) {
      onSave(item);
    }
  };
  return (
    <Portal>
      <Modal
        isVisible={visibleModal}
        onBackButtonPress={() => {
          setVisibleModal(false);
          onCancel ? onCancel() : null;
        }}
        onBackdropPress={() => {
          setVisibleModal(false);
          onCancel ? onCancel() : null;
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <View style={{paddingVertical: 15, alignSelf: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
              Select Bluetooth Printer
            </Text>
            {isError && (
              <Text style={{textAlign: 'center', color: 'red', padding: 5}}>
                Bluetooth devices won't connect, it's likely because bluetooth
                does not turn on, or aren't in pairing mode, or the devices are
                out of range
              </Text>
            )}
          </View>
          <View style={{paddingVertical: 15, alignSelf: 'center'}}>
            {listPrinter.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.boxDevice}
                  onPress={() => handleSelectPrinter(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text> {item.macAddress}</Text>
                    <Text>{item.deviceName}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* <View style={{height: 80}}>
            <CoupleButton
              titleSave="Ya"
              titleCancel="Tidak"
              onPressSave={() => (onSave ? onSave() : null)}
              onPressCancel={() => (onCancel ? onCancel() : null)}
            />
          </View> */}
        </View>
      </Modal>
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
