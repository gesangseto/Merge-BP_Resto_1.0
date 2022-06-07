import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import {Toaster} from '../../helper';
import {getPrint} from '../../models';

const heightForm = 45;

const PrintBill = React.forwardRef((props, ref) => {
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  //   interface INetPrinter {
  //     device_name: string;
  //     host: string;
  //     port: number;
  //   }

  const name = {
    device_name: 'RPP02N',
    inner_mac_address: '86:67:7A:08:06:77',
  };
  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const printBillTest = async () => {
    let _txt = await getPrint();
    if (!_txt) {
      return;
    }
    let printer = JSON.parse(await AsyncStorage.getItem('printer'));
    try {
      await BLEPrinter.connectPrinter(printer.inner_mac_address);
      BLEPrinter.printText(_txt);
      await BLEPrinter.closeConn(printer.inner_mac_address);
    } catch (error) {
      Toaster({message: error, type: 'error'});
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          borderRadius: 15,
          height: 40,
          width: 150,
          justifyContent: 'center',
          alignSelf: 'center',
          margin: 20,
        }}
        onPress={() => printBillTest()}>
        <Text style={{color: 'white', alignSelf: 'center'}}>
          Test Print Bill
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default React.memo(PrintBill);
