import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {FlatGrid} from 'react-native-super-grid';
import {
  Card,
  FormCart,
  FormNoteItem,
  FormOldOrder,
  HeaderOrder,
} from '../../components';
import FooterOrder from '../../components/molecules/FooterOrder';
import {colors} from '../../constants';
import * as RootNavigation from '../../helper';
import {mergeArray, Toaster} from '../../helper';
import {getBill, getMenu} from '../../models';
import {cancelSo, createSo} from '../../models/so';

export default function OrderMenu(routes) {
  const [isLoading, setIsLoading] = useState(false);
  const [oldOrders, setOldOrders] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [hiddenDataMenu, setHiddenDataMenu] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({});
  const [selectedIndexItem, setSelectedIndexItem] = useState(null);
  const host = routes.route.params;
  const boxDimension = 250;
  const [searchText, setSearchText] = useState('');
  const [modalOldOrder, setModalOldOrder] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [modalNote, setModalNote] = useState(false);

  const openModalCart = () => {
    console.log('Open Cart');
    setModalCart(true);
  };
  const closeModalCart = () => {
    setModalCart(false);
  };
  const openModalNoted = item => {
    setSelectedIndexItem(item.index);
    setSelectedMenu({...item});
    setModalNote(true);
  };
  const closeModalNote = () => {
    setModalNote(false);
  };

  const get_menu = async () => {
    let params = {
      prclvlid: '0',
    };
    let menu = await getMenu(params);
    setDataMenu([...menu]);
    setHiddenDataMenu([...menu]);
  };

  const get_old_bill = async () => {
    let oldOrders = await getBill({billno: host.billno});
    if (oldOrders[0].hasOwnProperty('so')) {
      setOldOrders([...oldOrders[0].so]);
    }
  };
  useEffect(() => {
    (async function () {
      setIsLoading(true);
      await get_menu();
      setIsLoading(false);
      await get_old_bill();
    })();
  }, []);

  const handleChangeItemInCart = item => {
    console.log(item);
    let menu = hiddenDataMenu;
    let index = menu.findIndex(x => x.itemid === item.itemid);
    menu[index] = item;
    updateSelectedMenu(menu);
  };

  const updateSelectedMenu = menu => {
    let selected = menu.filter(function (el) {
      return el.qty && el.qty > 0;
    });
    setSelectedMenus([...selected]);
  };

  const handleOrder = async () => {
    let items = [];
    for (const it of selectedMenus) {
      let item = {
        itemid: it.itemid,
        pid: 1,
        qty: it.qty,
        sodnote: it.sodnote ?? '',
        ispacked: it.ispacked ?? '',
      };
      items.push(item);
    }
    let body = {
      billno: host.billno,
      items: items,
    };
    setIsLoading(true);
    let exec = await createSo(body);
    if (exec) {
      Toaster({message: 'Berhasil order menu', type: 'success'});
      RootNavigation.goBack();
    }
    setIsLoading(false);
  };

  const handleSearchText = txt => {
    setSearchText(txt);
    let mn = hiddenDataMenu;
    mn = mn.filter(function (it) {
      return it.itemdesc.toLowerCase().includes(txt.toLowerCase());
    });
    setDataMenu([...mn]);
  };

  const handleCancelMenu = async item => {
    let cancel = await cancelSo(item);
    if (cancel) {
      Toaster({message: 'Success cancel', type: 'success'});
      await get_old_bill();
    }
  };
  return (
    <>
      {/* {isLoading && (
        <Spinner
          visible={true}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
        />
      )} */}
      <HeaderOrder
        selectedItem={selectedMenus}
        onClickCart={() => openModalCart()}
        // onSearch={txt => handleSearchText(txt)}
        onChangeSearch={txt => handleSearchText(txt)}
      />
      <FlatGrid
        onRefresh={() => get_menu()}
        refreshing={isLoading}
        itemDimension={boxDimension}
        data={dataMenu}
        style={styles.gridView}
        spacing={10}
        renderItem={({item, index}) => {
          return (
            <Card
              key={index}
              item={item}
              useAddToCart={false}
              selectedItems={selectedMenus}
              onChangeItem={item => handleChangeItemInCart(item)}
              onPress={item => openModalNoted(item)}
            />
          );
        }}
      />
      {oldOrders.length > 0 ? (
        <FooterOrder onPress={() => setModalOldOrder(true)} />
      ) : null}

      <FormCart
        isOpen={modalCart}
        host={host}
        selectedItems={selectedMenus}
        onChange={item => handleChangeItemInCart(item)}
        onCancel={closeModalCart}
        onSubmit={items => handleOrder(items)}
      />

      <FormNoteItem
        isOpen={modalNote}
        item={selectedMenu}
        selectedItems={selectedMenus}
        index={selectedIndexItem}
        onCancel={closeModalNote}
        onSave={item => {
          handleChangeItemInCart(item);
          closeModalNote();
        }}
      />

      <FormOldOrder
        isOpen={modalOldOrder}
        host={host}
        dataItems={oldOrders}
        // onChange={items => handleChangeItemsInCart(items)}
        onCancel={() => setModalOldOrder(false)}
        // onSubmit={items => handleOrder(items)}
        onCancelOrder={item => handleCancelMenu(item)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
  },
  imageContainer: {backgroundColor: 'white', width: 75, marginLeft: 5},
  containerPlusMinus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  containerMinus: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
  },
  containerPlus: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
  },
});
