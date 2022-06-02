import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Cell, Section, TableView} from 'react-native-tableview-simple';
import {PickerColor} from '../../components';
import {getHostStatus, updateHostStatus} from '../../models';

export default function ConfigurationScreen(props) {
  const [hostStatus, setHostStatus] = useState([]);
  const [openColor, setOpenColor] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    (async function () {
      await get_hostStatus();
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
      </TableView>
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
