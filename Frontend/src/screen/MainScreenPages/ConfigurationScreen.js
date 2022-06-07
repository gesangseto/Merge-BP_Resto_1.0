import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {CoupleButton, PickerColor, SetPrinter} from '../../components';
import {getHostStatus, updateHostStatus} from '../../models';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigurationScreen(props) {
  const [hostStatus, setHostStatus] = useState([]);
  const [openColor, setOpenColor] = useState(false);
  const [openModalPrinter, setOpenModalPrinter] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [printer, setPrinter] = useState({});

  useEffect(() => {
    (async function () {
      await get_hostStatus();
      let _printer = JSON.parse(await AsyncStorage.getItem('printer'));
      if (_printer) setPrinter({..._printer});
    })();
  }, []);

  const get_hostStatus = async () => {
    let _data = await getHostStatus();
    setHostStatus([..._data]);
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
    setOpenModalPrinter(false);
    await AsyncStorage.setItem('printer', JSON.stringify(item));
    setPrinter(item);
  };

  return (
    <ScrollView contentContainerStyle={styles.stage}>
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
        <Section header="Printer Bluetooth Configuration">
          <Cell
            cellStyle="Subtitle"
            title={printer.device_name ?? 'Not Set'}
            detail={printer.inner_mac_address}
            onPress={() => setOpenModalPrinter(true)}
          />
        </Section>
      </TableView>
      {openModalPrinter && (
        <SetPrinter
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
    backgroundColor: '#EFEFF4',
    paddingBottom: 20,
    flex: 1,
  },
});
