import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {FlatGrid} from 'react-native-super-grid';
import {ModalAlert} from '../../components';
import {Toaster} from '../../helper';
import {createBill, getBill, getKasirStatus} from '../../models';
import * as RootNavigation from '../../helper';

const heightForm = 45;
const boxDimension = 125;

export default function TakeAwayScreen() {
  const [openModalTakeAway, setOpenMadalTakeAway] = useState(false);
  const floatingAction = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [takeAwayData, setTakeAwayData] = useState([]);
  const [kasirStatus, setKasirStatus] = useState({});

  const get_bill = async () => {
    let param = {
      hiddenso: true,
      billtype: 'TA',
      // billstatus: 'ORDER',
    };
    setIsLoading(true);
    let _data = await getBill(param);
    let ksr_status = await getKasirStatus();
    if (ksr_status) {
      setKasirStatus({...ksr_status[0]});
    }
    setIsLoading(false);
    setTakeAwayData([..._data]);
  };

  const create_new_takeaway = async () => {
    let param = {
      srepid: profile.srepid,
      billtype: 'TA',
      billstatus: 'ORDER',
      billdate: moment().format('DD-MM-YYYY'),
      arrivetime: moment().format('hh:mm:ss'),
      pax: 2,
      paystatus: 'N',
    };
    let process = await createBill(param);
    await get_bill();
    console.log(process);
  };

  useEffect(() => {
    (async function () {
      await get_bill();
      let prfl = JSON.parse(await AsyncStorage.getItem('profile'));
      setProfile({...prfl});
    })();
  }, []);

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
    } else {
      setSelectedHost({...item});
      openModal();
    }
  };
  const handleLongClickBox = item => {
    console.log(item);
  };

  const renderBox = item => {
    let color = 'black';
    return (
      <TouchableOpacity
        key={item.billno}
        onLongPress={() => handleLongClickBox(item)}
        onPress={() => handleClickBox(item)}
        style={{
          height: boxDimension,
          borderRadius: 16,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.textBoxBig}>{item.srepname}</Text>
        <Text style={styles.textBoxSmall}>{item.billno}</Text>
        <Text style={styles.textBoxBig}>{item.billstatus}</Text>
      </TouchableOpacity>
    );
  };

  const closeModalTakeAway = () => {
    setOpenMadalTakeAway(false);
    floatingAction.current?.reset();
  };

  return (
    <>
      <FlatGrid
        onRefresh={() => get_bill()}
        refreshing={isLoading}
        itemDimension={boxDimension}
        data={takeAwayData}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => renderBox(item)}
      />
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
      <FloatingAction
        ref={floatingAction}
        onOpen={() => setOpenMadalTakeAway(true)}
      />
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
