import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {FlatGrid} from 'react-native-super-grid';
import {ic_open_menu} from '../../assets';
import {
  Card,
  FormCart,
  FormNoteItem,
  FormNoteOpenItem,
  FormOldOrder,
  HeaderOrder,
  ModalAlert,
  PrintBill,
} from '../../components';
import FooterOrder from '../../components/molecules/FooterOrder';
import {colors} from '../../constants';
import {Toaster} from '../../helper';
import {getBill, getMenu, getOpenMenu} from '../../models';
import {cancelSo, createSo} from '../../models/so';
import * as RootNavigation from '../../helper';

let params = {
  prclvlid: '0',
  // sort_by: 'a.itgrpid',
  // sort_asc: true,
};
export default function OrderMenu(routes) {
  const [isLoading, setIsLoading] = useState(false);
  const [oldOrders, setOldOrders] = useState([]);
  const [dataMenu, setDataMenu] = useState([]);
  const [openMenu, setOpenMenu] = useState({});
  const [hiddenDataMenu, setHiddenDataMenu] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({});
  const param = routes.route.params;
  const boxDimension = 250;
  const [searchText, setSearchText] = useState('');
  const [filtering, setFiltering] = useState({});
  const [modalOldOrder, setModalOldOrder] = useState(false);
  const [modalCart, setModalCart] = useState(false);
  const [modalNote, setModalNote] = useState(false);
  const [modalOpenNote, setModalOpenNote] = useState(false);
  const [alertClear, setAlertClear] = useState(false);
  const [itemForPrint, setItemForPrint] = useState({});
  const [modalPrint, setModalPrint] = useState(false);

  const actions = [
    {
      text: 'Reset Cart',
      icon: ic_open_menu,
      name: 'resetCart',
      position: 1,
      textBackground: '#1253bc',
      textColor: 'white',
    },
    {
      text: 'Open Menu',
      icon: ic_open_menu,
      name: 'openMenu',
      position: 2,
      textBackground: '#1253bc',
      textColor: 'white',
    },
  ];
  const openModalCart = () => {
    setModalCart(true);
  };
  const closeModalCart = () => {
    setModalCart(false);
  };
  const openModalNoted = item => {
    if (item.hasOwnProperty('isavailable') && !item.isavailable) {
      return Toaster({message: 'Untuk sementara menu tidak tersedia'});
    }
    setSelectedMenu({...item});
    setModalNote(true);
  };
  const closeModalNote = () => {
    setModalNote(false);
  };

  const get_menu = async () => {
    if (hiddenDataMenu.length == 0) {
      let menu = await getMenu(params);
      setDataMenu([...menu]);
      setHiddenDataMenu([...menu]);
    }
  };

  const get_old_bill = async () => {
    let oldOrders = await getBill({billno: param.billno});
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
    let menu = hiddenDataMenu;
    let index = menu.findIndex(x => x.itemid === item.itemid);
    menu[index] = item;
    if (item.is_openmenu && index < 0) {
      menu.push(item);
    }
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
        is_openmenu: it.is_openmenu ?? false,
        price1: it.price1 ?? 0,
        itemdesc: it.itemdesc ?? '',
        itemdesc2: it.itemdesc2 ?? '',
      };
      items.push(item);
    }
    // console.log(items);
    let body = {
      billno: param.billno,
      items: items,
    };
    setIsLoading(true);
    let exec = await createSo(body);
    setIsLoading(false);
    if (exec.error) {
      if (exec.data.length == 1) {
        let _data = exec.data[0];
        // handleChangeItemInCart(_data); BUAT BESOK
      }
      return;
    } else {
      let _print_data = exec.data[0];
      setItemForPrint(_print_data);
      setModalPrint(true);
      resetField();
      closeModalCart();
      Toaster({message: 'Berhasil order menu', type: 'success'});
      // RootNavigation.navigateReplace('MainScreen');
    }
  };

  useEffect(() => {
    handleFiltering();
  }, [searchText, filtering]);

  const handleFiltering = menu => {
    let text = searchText;
    let filter = filtering;
    let mn = menu ?? hiddenDataMenu;
    mn = mn.filter(function (it) {
      return it.itemdesc.toLowerCase().includes(text.toLowerCase());
    });
    if (filter.hasOwnProperty('itgrpid')) {
      mn = mn.filter(function (it) {
        return it.itgrpid === filter.itgrpid;
      });
    }
    setDataMenu([...mn]);
  };

  const handleCancelMenu = async item => {
    let cancel = await cancelSo(item);
    if (cancel) {
      Toaster({message: 'Success cancel', type: 'success'});
      await get_old_bill();
    }
  };

  const resetField = async () => {
    let rm_menu = selectedMenus;
    let i = 0;
    for (const it of rm_menu) {
      rm_menu[i].qty = 0;
      rm_menu[i].sodnote = '';
      i += 1;
    }
    updateSelectedMenu(rm_menu);
  };

  const handlePressMoreMenu = async name => {
    if (name === 'resetCart') {
      if (selectedMenus.length > 0) {
        setAlertClear(true);
      }
    } else if (name === 'openMenu') {
      if (!openMenu.hasOwnProperty('is_openmenu')) {
        let _openMenu = await getOpenMenu(params);
        setOpenMenu({..._openMenu[0]});
      }
      setModalOpenNote(true);
    }
  };

  return (
    <>
      <HeaderOrder
        selectedItem={selectedMenus}
        filter={filtering}
        onClickCart={() => openModalCart()}
        onChangeSearch={txt => setSearchText(txt)}
        onChangeFilter={item => setFiltering({...item})}
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
        isLoading={isLoading}
        isOpen={modalCart}
        param={param}
        selectedItems={selectedMenus}
        onChange={item => handleChangeItemInCart(item)}
        onCancel={closeModalCart}
        onSubmit={items => handleOrder(items)}
      />

      <FormNoteItem
        isOpen={modalNote}
        item={selectedMenu}
        selectedItems={selectedMenus}
        onCancel={closeModalNote}
        onSave={item => {
          handleChangeItemInCart(item);
          closeModalNote();
        }}
      />
      <FormNoteOpenItem
        isOpen={modalOpenNote}
        item={openMenu}
        onCancel={() => {
          setModalOpenNote(false);
        }}
        onSave={item => {
          handleChangeItemInCart(item);
          setOpenMenu({});
          setModalOpenNote(false);
        }}
      />

      <FormOldOrder
        isOpen={modalOldOrder}
        param={param}
        dataItems={oldOrders}
        // onChange={items => handleChangeItemsInCart(items)}
        onCancel={() => setModalOldOrder(false)}
        // onSubmit={items => handleOrder(items)}
        onCancelOrder={item => handleCancelMenu(item)}
      />

      <View style={styles.container}>
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            handlePressMoreMenu(name);
          }}
          textBackground={'#ffffff'}
          showBackground={true}
        />
        <ModalAlert
          title={'Konfirmasi'}
          message={
            'Yakin ingin hapus keranjang?\nSudah ada order didalam keranjang'
          }
          isOpen={alertClear}
          onCancel={() => setAlertClear(false)}
          onSave={() => {
            setAlertClear(false);
            resetField();
          }}
        />

        <PrintBill
          isOpen={modalPrint}
          onClose={() => {
            setModalPrint(false);
            RootNavigation.goBack();
          }}
          item={itemForPrint}
        />
      </View>
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
    borderColor: colors.danger,
    borderRadius: 5,
  },
  containerPlus: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 5,
  },
});
