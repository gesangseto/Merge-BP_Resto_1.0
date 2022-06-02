import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import moment from 'moment';
import {Button, InputPlusMinus, InputText} from '../atoms';
import {BLEPrinter, USBPrinter} from 'react-native-thermal-receipt-printer';

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

  const _connectPrinter = printer => {
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      error => console.warn(error),
    );
  };

  const printTextTest = () => {
    var txt = `<B>Test</B>\n <B>Test2</B>`;
    currentPrinter && BLEPrinter.printText(txt);
  };

  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<C>sample bill</C>');
  };

  return (
    <View>
      {printers.map(printer => (
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            borderRadius: 10,
            height: 50,
            margin: 10,
          }}
          key={printer.inner_mac_address}
          onPress={() => _connectPrinter(printer)}>
          <Text>
            {`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => printTextTest()}>
        <Text>Print Text</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => printBillTest()}>
        <Text>Print Bill Text</Text>
      </TouchableOpacity>
    </View>
  );
});

export default React.memo(PrintBill);
