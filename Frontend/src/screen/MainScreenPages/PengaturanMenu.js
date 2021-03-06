import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {Card, FormUpdateItem, HeaderOrder} from '../../components';
import {colors} from '../../constants';
import {filterItemGroup} from '../../helper';
import {getMenu, updateMenu} from '../../models';

let params = {
  prclvlid: '0',
  sort_by: 'isavailable',
  sort_asc: true,
};
const boxDimension = 250;
export default function PengaturanMenu(routes) {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [dataMenus, setDataMenus] = useState([]);
  const [hiddenDataMenus, setHiddenDataMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [filtering, setFiltering] = useState({});
  const [availableFilter, setAvailableFilter] = useState({});
  const [searchText, setSearchText] = useState('');
  const [openMenuUpdate, setOpenMenuUpdate] = useState(false);

  const get_menu = async force_update => {
    if (hiddenDataMenus.length == 0 || force_update) {
      let menu = await getMenu(params);
      if (!menu) {
        return;
      }
      setHiddenDataMenus([...menu]);
      setDataMenus([...menu]);
    }
  };

  const handleUpdate = async item => {
    setIsLoading(true);
    let body = {
      itemid: item.itemid,
      isavailable: item.isavailable == 1 ? '0' : '1',
    };
    setOpenMenuUpdate(false);
    await updateMenu(body);
    await get_menu(true);
    setIsLoading(false);
  };

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      await get_menu();
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isFocused) get_menu();
  }, [isFocused]);

  useEffect(() => {
    if (hiddenDataMenus.length > 0) {
      handleFiltering();
    }
  }, [searchText, filtering, availableFilter, hiddenDataMenus]);

  function getItemGroup(_filter, menu) {
    let _menu = [];
    if (_filter.hasOwnProperty('children') && _filter.children.length > 0) {
      for (const it of _filter.children) {
        _menu = [..._menu, ...getItemGroup(it, menu)];
      }
    } else if (_filter.hasOwnProperty('itgrpid')) {
      for (const it of menu) {
        if (it.itgrpid === _filter.itgrpid) {
          _menu.push(it);
        }
      }
    }
    return _menu;
  }

  const handleFiltering = async () => {
    if (hiddenDataMenus.length > 0) {
      setIsLoading(true);
      let text = searchText;
      let filter = filtering;
      let avail = availableFilter;
      let mn = hiddenDataMenus;
      mn = mn.filter(function (it) {
        return it.itemdesc.toLowerCase().includes(text.toLowerCase());
      });
      if (filter.hasOwnProperty('itgrpid')) {
        mn = filterItemGroup(filter, mn);
      }
      if (avail.isavailable == 0 || avail.isavailable == 1) {
        mn = mn.filter(function (it) {
          return it.isavailable === avail.isavailable;
        });
      }
      setDataMenus([...mn]);
      setIsLoading(false);
    }
  };

  const handleClickCart = item => {
    setSelectedMenu({...item});
    setOpenMenuUpdate(true);
  };

  return (
    <>
      <HeaderOrder
        filterAvailable={true}
        onChangeFilterAvailable={item => setAvailableFilter({...item})}
        useBack={false}
        useCart={false}
        selectedItem={[]}
        filter={filtering}
        onClickCart={() => openModalCart()}
        onChangeSearch={txt => setSearchText(txt)}
        onChangeFilter={item => setFiltering({...item})}
      />
      <FlatGrid
        onRefresh={() => get_menu(true)}
        refreshing={isLoading}
        itemDimension={boxDimension}
        data={dataMenus}
        style={styles.gridView}
        spacing={10}
        renderItem={({item, index}) => {
          return (
            <Card
              key={index}
              item={item}
              useAddToCart={false}
              useCartInfo={false}
              selectedItems={[]}
              // onChangeItem={item => handleChangeItemInCart(item)}
              onPress={item => handleClickCart(item)}
            />
          );
        }}
      />
      <FormUpdateItem
        isOpen={openMenuUpdate}
        onCancel={() => setOpenMenuUpdate(false)}
        onSave={item => handleUpdate(item)}
        item={selectedMenu}
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
