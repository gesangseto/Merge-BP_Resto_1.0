import {Portal} from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import {Modalize} from 'react-native-modalize';
import {FlatGrid} from 'react-native-super-grid';
import {TabView} from 'react-native-tab-view';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CoupleButton, FormDineIn, RequiredText} from '../../components';
import {colors} from '../../constants';
import * as RootNavigation from '../../helper';
import {groupingArray, isColorBrigthness, Toaster} from '../../helper';
import {
  cancelBill,
  createBill,
  getBill,
  getHost,
  getKasirStatus,
} from '../../models';

const heightForm = 45;
const boxDimension = 125;

export default function DineInScreen() {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [tabData, setTabData] = useState({});
  const [routes, setRoutes] = useState([]);
  const [selectedHost, setSelectedHost] = useState({});
  const [kasirStatus, setKasirStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);
  const [visibleModalDineIn, setVisibleModalDineIn] = useState(false);
  const [profile, setProfile] = useState(null);
  const modalizeMoreMenu = useRef(null);

  const openModalMoreMenu = () => {
    modalizeMoreMenu.current?.open();
  };
  const closeModalMoreMenu = () => {
    modalizeMoreMenu.current?.close();
  };

  const get_host = async () => {
    let prop = {active: true};
    setIsLoading(true);
    let exec = await getHost(prop);
    let ksr_status = await getKasirStatus();
    setIsLoading(false);
    if (!exec || !ksr_status) return;
    let grouping = groupingArray(exec, 'hostlocationdesc');
    setTabData({...grouping});
    if (ksr_status) {
      setKasirStatus({...ksr_status[0]});
    }
    let newRoutes = [];
    for (const key in grouping) {
      let it = {key: key, title: key};
      newRoutes.push(it);
    }
    setRoutes([...newRoutes]);
  };

  useEffect(() => {
    let abortController;
    (async function () {
      abortController = new AbortController();
      await get_host();
      let prfl = JSON.parse(await AsyncStorage.getItem('profile'));
      setProfile({...prfl});
    })();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (isFocused) get_host();
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

    Toaster({
      message: msg,
      type: 'error',
    });
    return false;
  };

  const handleClickTable = item => {
    if (!checkKasir()) {
      return;
    }
    if (item.billno) {
      item.sourceScreen = 'DineInScreen';
      RootNavigation.navigate('Order Menu', item);
    } else {
      setSelectedHost({...item});
      setVisibleModalDineIn(true);
    }
  };

  const handleOpenMoreMenu = async item => {
    if (!item.billno || !checkKasir()) {
      return;
    }
    setIsLoading(true);

    let detailHost = await getBill({billno: item.billno});
    detailHost = detailHost[0];
    item.can_cancel = detailHost.can_cancel;
    setIsLoading(false);
    setSelectedHost(item);
    // setVisibleModalEdit(true);
    openModalMoreMenu();
  };

  const createNewBill = async formData => {
    let body = formData;
    body.srepid = profile.srepid;
    setIsLoading(true);
    let process = await createBill(body);
    setIsLoading(false);
    if (!process) {
      return;
    }
    await get_host();
  };

  const handleCancelTable = async item => {
    setVisibleModalEdit(false);

    let cancel = await cancelBill(item);
    if (!cancel) {
      return;
    } else {
      Toaster({message: 'Success cancel table', type: 'success'});
      await get_host();
      closeModalMoreMenu();
    }
  };

  const renderBox = item => {
    let color = 'white';
    if (isColorBrigthness(item.hoststatuscolor)) {
      color = 'black';
    }
    return (
      <TouchableOpacity
        key={index}
        onLongPress={() => handleOpenMoreMenu(item)}
        onPress={() => handleClickTable(item)}
        style={{
          height: boxDimension,
          borderRadius: 16,
          backgroundColor: item.hoststatuscolor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 24, color: color}}>
          {item.hostdesc}
        </Text>
        <Text style={{color: color}}> {item.hoststatusdesc}</Text>
        {item.srepname ? (
          <Text style={{color: color, fontWeight: 'bold'}}>
            ({item.srepname})
          </Text>
        ) : null}

        {item.hoststatusicon && (
          <MatComIcon name={item.hoststatusicon} size={20} color={color} />
        )}
      </TouchableOpacity>
    );
  };

  const renderScene = ({route, jumpTo}) => {
    let data = tabData[`${route.key}`];
    return (
      <FlatGrid
        onRefresh={() => get_host()}
        refreshing={isLoading}
        itemDimension={boxDimension}
        data={data ?? []}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => renderBox(item)}
      />
    );
  };
  const _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          let opacity = 1;
          if (Array.isArray(opacity) && inputRange.length > 1) {
            opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 0.1,
              ),
            });
          }
          let pos = props.navigationState.index;
          return (
            <TouchableOpacity
              key={i}
              style={{
                ...styles.tabItem,
                borderBottomColor: 'red',
                borderBottomWidth: pos === i ? 1 : 0,
              }}
              onPress={() => {
                setIndex(i);
              }}>
              <Animated.Text
                style={{
                  opacity,
                  // color: pos === i ? 'white' : 'grey',
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      {Object.keys(tabData).length === 0 ? (
        <FlatGrid
          onRefresh={() => get_host()}
          refreshing={isLoading}
          data={[]}
          style={styles.gridView}
          renderItem={({item}) => renderBox(item)}
        />
      ) : (
        <TabView
          renderTabBar={_renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: Dimensions.width}}
        />
      )}
      <Portal>
        {visibleModalDineIn ? (
          <FormDineIn
            isOpen={visibleModalDineIn}
            onCancel={() => setVisibleModalDineIn(false)}
            host={selectedHost}
            onSave={formData => {
              createNewBill(formData);
              setVisibleModalDineIn(false);
            }}
          />
        ) : null}

        <Modalize ref={modalizeMoreMenu} modalHeight={150}>
          <View
            style={{
              marginVertical: 20,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={!selectedHost.can_cancel}
              style={{
                width: 250,
                height: 75,
                backgroundColor: !selectedHost.can_cancel
                  ? 'grey'
                  : colors.danger,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => setVisibleModalEdit(true)}>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                Batalkan Meja {selectedHost.hostdesc}
              </Text>
            </TouchableOpacity>
            {!selectedHost.can_cancel && (
              <Text style={{color: colors.danger, fontSize: 12}}>
                Tidak bisa batalkan meja {selectedHost.hostdesc}, silahkan
                cancel semua order
              </Text>
            )}
          </View>
        </Modalize>
        <Modal
          isVisible={visibleModalEdit}
          onBackButtonPress={() => setVisibleModalEdit(false)}
          onBackdropPress={() => setVisibleModalEdit(false)}>
          <ModalCancelTable
            item={selectedHost}
            onCancel={() => setVisibleModalEdit(false)}
            onSave={item => handleCancelTable(item)}
          />
        </Modal>
      </Portal>
      {/* {isLoading && (
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      )} */}
    </>
  );
}

const ModalCancelTable = props => {
  const {item, onCancel, onSave} = props;
  const [itemData, setItemData] = useState({});
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setItemData({...item});
  }, [item]);

  const handleConfirmCancel = () => {
    if (!itemData.note || !itemData.billno) {
      setIsError(true);
    } else {
      if (onSave) {
        onSave(itemData);
      }
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 15,
        }}>
        <Text
          style={{
            textAlign: 'center',
            padding: 15,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          Batal Meja {itemData.hostdesc}
        </Text>
        <View>
          <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Note</Text>
          <TextInput
            style={styles.textNote}
            multiline={true}
            value={itemData.note}
            onChangeText={val => setItemData({...itemData, note: val})}
          />
          <RequiredText style={{paddingLeft: 25}} show={isError} title="Note" />
        </View>
        <View style={{height: 80}}>
          <CoupleButton
            fullSize={true}
            onPressSave={() => handleConfirmCancel()}
            onPressCancel={() => (onCancel ? onCancel() : null)}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  bottomTabItem: {
    borderBottomColor: 'green',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#61a646',
    borderBottomWidth: 3,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
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
});
