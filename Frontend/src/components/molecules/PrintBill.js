import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {Modalize} from 'react-native-modalize';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import ThermalPrinterModule from 'react-native-thermal-printer';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import {Toaster} from '../../helper';
import {getKitchen, getPrint} from '../../models';
import {ButtonFooterModal} from '../atoms';

const heightForm = 45;

const PrintBill = React.forwardRef((props, ref) => {
  const {isOpen, title, item = Object, onClose} = props;
  const modalPrintBill = useRef(null);
  const [listKitchen, setListKitchen] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item.hasOwnProperty('sono')) {
      getKitchenData({sono: item.sono});
    } else if (item.hasOwnProperty('billno')) {
      getKitchenData({billno: item.billno});
    }
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
    //  else {
    //   closeModal();
    // }
  }, [isOpen]);

  const getKitchenData = async item => {
    let _data = await getKitchen(item);
    let _new_data = [];
    for (const it of _data) {
      let _it = it;
      _it.selected = true;
      _new_data.push(_it);
    }
    setListKitchen([..._new_data]);
  };

  const openModal = () => {
    modalPrintBill.current?.open();
  };
  const closeModal = () => {
    if (onClose) {
      onClose();
    }
    modalPrintBill.current?.close();
  };

  const print = async property => {
    let param = {
      billno: property.billno ? property.billno : null,
      sono: property.sono ? property.sono : null,
      kitchenno: property.kitchenno ? property.kitchenno : null,
      update_print_count: property.update ? property.update : false,
    };
    param = Object.fromEntries(
      Object.entries(param).filter(([_, v]) => v != null),
    );
    let _config = await getPrint(param);
    if (!_config) {
      return;
    }
    let _print = await sendCommandToPrinter({config: _config});
    if (_print)
      Toaster({
        message: `Success print ${param.billno ?? ''} ${param.sono ?? ''} ${
          param.kitchenno ?? ''
        }`,
        type: 'success',
      });
    await new Promise(resolve =>
      setTimeout(resolve, _config.payload.length * 10),
    );
    return;
  };

  const sendCommandToPrinter = async ({config = Object, loop = true}) => {
    try {
      await ThermalPrinterModule.printBluetooth(config);
      return true;
    } catch (error) {
      // if (error.message === 'Bluetooth Device Not Found' && loop) {
      if (loop) {
        delete config.macAddress;
        let reprint = await sendCommandToPrinter({config: config, loop: false});
        return reprint;
      } else {
        Toaster({message: error.message, type: 'error'});
        return false;
      }
    }
  };

  const printBill = async () => {
    setIsLoading(true);
    let i = 1;
    for (const it of listKitchen) {
      if (it.selected) {
        await print({...item, ...it, update: listKitchen.length == i});
      }
      i += 1;
    }
    setIsLoading(false);
    closeModal();
  };

  const handleClickCheck = (item, index) => {
    let _new_data = listKitchen;
    _new_data[index].selected = !_new_data[index].selected;
    setListKitchen([..._new_data]);
  };

  return (
    <Portal>
      <Modalize
        ref={modalPrintBill}
        modalHeight={300}
        onClosed={() => {
          if (onClose) {
            onClose();
          }
        }}
        FooterComponent={
          <ButtonFooterModal
            isLoading={isLoading}
            buttonTittle="Print"
            buttonColor={colors.success}
            onClickSubmit={() => printBill()}
            useTotal={false}
          />
        }>
        <TableView>
          <Section header="Print Menu by Kitchen">
            {listKitchen.map((it, index) => {
              return (
                <Cell
                  key={index}
                  cellStyle="Subtitle"
                  title={it.kitchenname ?? 'Not Set'}
                  detail={it.kitchenno ?? 'Not Set'}
                  onPress={() => handleClickCheck(it, index)}
                  cellAccessoryView={
                    <MatComIcon
                      name={
                        it.selected
                          ? 'checkbox-outline'
                          : 'checkbox-blank-outline'
                      }
                      size={20}
                      color={'blue'}
                    />
                  }
                />
              );
            })}
          </Section>
        </TableView>
      </Modalize>
    </Portal>
    // </View>
  );
});

export default React.memo(PrintBill);
