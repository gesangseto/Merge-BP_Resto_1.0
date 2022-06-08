import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Toaster} from '../../helper';
import {getPrint} from '../../models';
import ThermalPrinterModule from 'react-native-thermal-printer';

const heightForm = 45;

const PrintBill = React.forwardRef((props, ref) => {
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  //   interface INetPrinter {
  //     device_name: string;
  //     host: string;
  //     port: number;
  //   }

  // const name = {
  //   device_name: 'RPP02N',
  //   inner_mac_address: '86:67:7A:08:06:77',
  // };
  useEffect(() => {}, []);

  const printBillTest = async () => {
    let _txt = await getPrint({billno: 'BI220608001'});
    if (!_txt) {
      return;
    }
    // let printer = JSON.parse(await AsyncStorage.getItem('printer'));
    try {
      await ThermalPrinterModule.printBluetooth({
        // ip: '192.168.100.246',
        // port: 9100,
        payload: _txt,
        // printerWidthMM: 50,
        timeout: 5000, // in milliseconds (version >= 2.2.0)
      });
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
