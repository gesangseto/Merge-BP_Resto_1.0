import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {PickerColor} from '../../components';
import FormSetPrinter from '../../components/molecules/FormSetPrinter';
import {colors} from '../../constants';
import {
  getHostStatus,
  getKitchen,
  updateHostStatus,
  updateKitchen,
} from '../../models';

export default function ConfigurationScreen(props) {
  const [hostStatus, setHostStatus] = useState([]);
  const [listKitchen, setListKitchen] = useState([]);
  const [openColor, setOpenColor] = useState(false);
  const [openModalPrinter, setOpenModalPrinter] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedKitchen, setSelectedKitchen] = useState({});

  useEffect(() => {
    (async function () {
      await get_hostStatus();
      await get_listKitchen();
    })();
  }, []);

  const get_hostStatus = async () => {
    let _data = await getHostStatus();
    if (!_data) return;

    setHostStatus([..._data]);
  };

  const get_listKitchen = async () => {
    let _data = await getKitchen();
    if (!_data) return;
    setListKitchen([..._data]);
  };

  const updateColorStatus = async val => {
    setOpenColor(false);
    let _data = selectedItem;
    _data.hoststatuscolor = val;
    let _update = await updateHostStatus(_data);
    if (!_update) {
      return;
    }
    get_hostStatus();
    setSelectedItem({});
  };

  const handleSelectPrinter = async item => {
    let body = {
      ...selectedKitchen,
      printerbtname: item.deviceName,
      printerbtaddress: item.macAddress,
    };
    await updateKitchen(body);
    get_listKitchen();
    setOpenModalPrinter(false);
  };
  return (
    <ScrollView style={styles.stage}>
      <View
        style={{
          backgroundColor: '#37474F',
          height: 150,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#ffc107',
            width: 80,
            height: 80,
            borderRadius: 10,
          }}
        />
      </View>
      <PickerColor
        value={selectedItem.hoststatuscolor}
        isOpen={openColor}
        onSubmit={val => updateColorStatus(val)}
        onClose={() => setOpenColor(false)}
      />
      <TableView>
        <Section header="Host Color Configuration">
          {hostStatus.map((item, index) => {
            return (
              <Cell
                key={index}
                cellStyle="Subtitle"
                cellAccessoryView={
                  <View
                    style={{
                      backgroundColor: item.hoststatuscolor,
                      width: 40,
                      height: 30,
                      borderRadius: 25,
                    }}></View>
                }
                title={item.hoststatusdesc}
                detail={item.hoststatuscode + ' ' + item.hoststatuscolor}
                onPress={() => {
                  setSelectedItem({...item});
                  setOpenColor(true);
                }}
              />
            );
          })}
        </Section>
        <Section header="Kitchen Printer Configuration">
          {listKitchen.map((item, index) => {
            return (
              <Cell
                key={index}
                cellStyle="Subtitle"
                cellAccessoryView={
                  <Text>{item.printerbtname ?? 'Not Set'}</Text>
                }
                title={item.kitchenname}
                detail={item.printerbtaddress}
                onPress={() => {
                  setSelectedKitchen({...item});
                  setOpenModalPrinter(true);
                }}
              />
            );
          })}
        </Section>
      </TableView>
      {openModalPrinter && (
        <FormSetPrinter
          isOpen={openModalPrinter}
          onCancel={() => setOpenModalPrinter(false)}
          onSave={item => handleSelectPrinter(item)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
});
