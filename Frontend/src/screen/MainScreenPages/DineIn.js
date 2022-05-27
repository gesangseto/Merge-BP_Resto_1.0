import {Portal} from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {Modalize} from 'react-native-modalize';
import {FlatGrid} from 'react-native-super-grid';
import {TabView} from 'react-native-tab-view';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CoupleButton, FormBill} from '../../components';
import {colors} from '../../constants';
import * as RootNavigation from '../../helper';
import {groupingArray, Toaster} from '../../helper';
import {cancelBill, createBill, getBill, getHost} from '../../models';

const heightForm = 45;

const color_mapping = [
  {
    code: 'KSNG',
    color: '#7eed72',
    icon: 'silverware',
  },
  {
    code: 'DINE',
    color: 'yellow',
    icon: 'table-chair',
  },
  {
    code: 'DINE',
    color: 'yellow',
    icon: 'table-chair',
  },
];

export default function DineIn() {
  const [index, setIndex] = useState(0);
  const [tabData, setTabData] = useState({});
  const [routes, setRoutes] = useState([]);
  const [selectedHost, setSelectedHost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const boxDimension = 125;
  const modalizeRef = useRef(null);
  const modalizeMoreMenu = useRef(null);

  const openModalMoreMenu = () => {
    modalizeMoreMenu.current?.open();
  };
  const closeModalMoreMenu = () => {
    modalizeMoreMenu.current?.close();
  };

  const openModal = () => {
    modalizeRef.current?.open();
  };
  const closeModal = () => {
    modalizeRef.current?.close();
  };
  const get_host = async () => {
    let prop = {active: true};
    setIsLoading(true);
    let exec = await getHost(prop);
    setIsLoading(false);
    let grouping = groupingArray(exec, 'hostlocationdesc');
    setTabData({...grouping});

    let newRoutes = [];
    for (const key in grouping) {
      let it = {key: key, title: key};
      newRoutes.push(it);
    }
    setRoutes([...newRoutes]);
  };

  useEffect(() => {
    (async function () {
      await get_host();
      let prfl = JSON.parse(await AsyncStorage.getItem('profile'));
      setProfile({...prfl});
    })();
  }, []);

  const handleClickTable = item => {
    if (item.billno) {
      RootNavigation.navigate('Order Menu', item);
      console.log(item.billno);
    } else {
      setSelectedHost({...item});
      openModal();
    }
  };

  const handleOpenMoreMenu = async item => {
    if (!item.billno) {
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
    closeModal();
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
    let color = '#f54269';
    let icon = 'account';
    for (const it of color_mapping) {
      if (item.hoststatuscode == it.code) {
        color = it.color;
        icon = it.icon;
      }
    }
    return (
      <TouchableOpacity
        key={index}
        onLongPress={() => handleOpenMoreMenu(item)}
        onPress={() => handleClickTable(item)}
        style={{
          height: boxDimension,
          borderRadius: 16,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 24}}>{item.hostdesc}</Text>
        <Text>{item.hoststatusdesc}</Text>
        <MatComIcon name={icon} size={20} color="black" />
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
        data={data}
        style={styles.gridView}
        spacing={10}
        renderItem={({item}) => renderBox(item)}
      />
    );
  };

  return (
    <>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: Dimensions.width}}
      />
      <Portal>
        <Modalize ref={modalizeRef}>
          <FormBill
            host={selectedHost}
            onCancel={() => closeModal()}
            onSave={formData => createNewBill(formData)}
          />
        </Modalize>

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
          {isError ? (
            <Text style={styles.textError}>* Note is required</Text>
          ) : null}
        </View>
        <View style={{height: 80}}>
          <CoupleButton
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
