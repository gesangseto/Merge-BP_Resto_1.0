import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {FlatGrid} from 'react-native-super-grid';
import {FormCancelBill, ModalAlert} from '../../components';
import {isColorBrigthness, Toaster} from '../../helper';
import {createBill, getBill, getKasirStatus} from '../../models';
import * as RootNavigation from '../../helper';
import {colors} from '../../constants';
import {Cell, TableView} from 'react-native-tableview-simple';
import {Portal} from '@gorhom/portal';
import {Modalize} from 'react-native-modalize';
import {useIsFocused} from '@react-navigation/native';

const heightForm = 45;
const boxDimension = 125;

const default_color = {
  CHECKIN: colors.lightGrey,
  ORDER: colors.info,
};

export default function TakeAwayScreen() {
  const isFocused = useIsFocused();
  const floatingAction = useRef(null);
  const modalizeMoreMenu = useRef(null);
  const [openModalTakeAway, setOpenMadalTakeAway] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [takeAwayData, setTakeAwayData] = useState([]);
  const [kasirStatus, setKasirStatus] = useState({});
  const [selectedBill, setSelectedBill] = useState({});

  const get_bill = async () => {
    let param = {
      hiddenso: true,
      billtype: 'TA',
      // billstatus: 'ORDER',
    };
    setIsLoading(true);
    let _data = await getBill(param);
    let ksr_status = await getKasirStatus();
    setIsLoading(false);
    if (!_data || !ksr_status) {
      return;
    }
    if (ksr_status) {
      setKasirStatus({...ksr_status[0]});
    }
    let _n_data = [];
    for (const it of _data) {
      it.color = default_color[it.billstatus];
      _n_data.push(it);
    }
    setTakeAwayData([..._n_data]);
  };

  const create_new_takeaway = async () => {
    let param = {
      srepid: profile.srepid,
      billtype: 'TA',
      billstatus: 'ORDER',
      billdate: `${moment().format('YYYY-MM-DD')}`,
      arrivetime: `${moment().format('HH:mm:ss')}`,
      pax: 2,
      paystatus: 'N',
    };
    await createBill(param);
    await get_bill();
  };

  useEffect(() => {
    (async function () {
      await get_bill();
      let prfl = JSON.parse(await AsyncStorage.getItem('profile'));
      setProfile({...prfl});
    })();
  }, []);

  useEffect(() => {
    if (isFocused) get_bill();
  }, [isFocused]);

  const checkKasir = () => {
    let msg = 'Untuk melanjutkan transaksi mohon buka kasir terlebih dahulu';
    if (kasirStatus.hasOwnProperty('starttime')) {
      let dt_start = moment(kasirStatus.starttime).format('DD-MM-YYYY');
      let today = moment(new Date()).format('DD-MM-YYYY');
      if (dt_start === today) {
        return true;
      } else {
        msg = `Silahkan tutup kasir pada tanggal ${dt_start}`;
      }
    }
    Toaster({message: msg, type: 'error'});
    return false;
  };
  const handleClickBox = item => {
    if (!checkKasir()) {
      return;
    }
    if (item.billno) {
      item.sourceScreen = 'TakeAwayScreen';
      RootNavigation.navigate('Order Menu', item);
    }
  };
  const handleLongClickBox = async item => {
    setIsLoading(true);
    let detailBill = await getBill({billno: item.billno});
    detailBill = detailBill[0];
    item.can_cancel = detailBill.can_cancel;
    setSelectedBill(item);
    setIsLoading(false);
    modalizeMoreMenu.current?.open();
  };

  const renderBox = item => {
    let color = 'white';
    if (isColorBrigthness(item.color)) {
      color = 'black';
    }
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
        }}
        onPress={() => handleClickBox(item)}
        onLongPress={() => handleLongClickBox(item)}>
        <View style={{flex: 1}}>
          <Text
            style={{
              color: colors.darkGrey,
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {item.billno}
          </Text>
          <Text style={{color: 'red'}}>({item.srepname}) </Text>
          <Text>
            {moment(`${item.billdate}`).format('DD-MM-YY')}{' '}
            {`${item.arrivetime ?? ''}`}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.darkGrey,
            }}>
            {item.billstatus}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const closeModalTakeAway = () => {
    setOpenMadalTakeAway(false);
    floatingAction.current?.reset();
  };

  const handleAddTakeAway = () => {
    if (!checkKasir()) {
      return;
    }
    setOpenMadalTakeAway(true);
  };
  return (
    <>
      <ScrollView
        style={{marginVertical: 5}}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={get_bill} />
        }>
        <TableView style={{flex: 1}}>
          {takeAwayData.map((item, index) => {
            return (
              <Cell
                contentContainerStyle={{
                  alignItems: 'flex-start',
                  height: 75,
                  elevation: 2,
                  borderColor: 'grey',
                }}
                cellContentView={renderBox(item)}
                key={index}
                cellStyle="Subtitle"
                title={`#${item.billno}`}
                detail={item.srepname}
              />
            );
          })}
        </TableView>
      </ScrollView>
      <ModalAlert
        isOpen={openModalTakeAway}
        title={'Konfirmasi'}
        message={'Ingin menambahkan Take Away baru?'}
        onCancel={() => closeModalTakeAway()}
        onSave={() => {
          create_new_takeaway();
          closeModalTakeAway();
        }}
      />
      <FloatingAction ref={floatingAction} onOpen={() => handleAddTakeAway()} />
      <Portal>
        <Modalize ref={modalizeMoreMenu} modalHeight={150}>
          <FormCancelBill
            selectedBill={selectedBill}
            onCancelBill={() => {
              modalizeMoreMenu.current?.close();
              get_bill();
            }}
          />
        </Modalize>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  textBoxBig: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  textBoxSmall: {
    // fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});
