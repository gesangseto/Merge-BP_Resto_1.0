import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {Card, FormUpdateItem, HeaderOrder} from '../../components';
import {colors} from '../../constants';
import {getMenu, updateMenu} from '../../models';

let params = {
  prclvlid: '0',
  sort_by: 'isavailable',
  sort_asc: true,
};
const boxDimension = 250;
export default function PengaturanMenu(routes) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataMenus, setDataMenus] = useState([]);
  const [hiddenDataMenus, setHiddenDataMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [filtering, setFiltering] = useState({});
  const [openMenuUpdate, setOpenMenuUpdate] = useState(false);

  const get_menu = async () => {
    // if (hiddenDataMenus.length == 0) {
    let menu = await getMenu(params);
    setDataMenus([...menu]);
    setHiddenDataMenus([...menu]);
    // }
  };

  const handleUpdate = async item => {
    setIsLoading(true);
    let body = {
      itemid: item.itemid,
      isavailable: item.isavailable == 1 ? '0' : '1',
    };
    setOpenMenuUpdate(false);
    await updateMenu(body);
    get_menu();
    setIsLoading(false);
  };

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      await get_menu();
      setIsLoading(false);
    })();
  }, []);

  const handleClickCart = item => {
    console.log('Open editor');
    setSelectedMenu({...item});
    setOpenMenuUpdate(true);
  };

  return (
    <>
      <HeaderOrder
        useBack={false}
        useCart={false}
        selectedItem={[]}
        filter={filtering}
        onClickCart={() => openModalCart()}
        onChangeSearch={txt => console.log(txt)}
        onChangeFilter={item => console.log(item)}
      />
      <FlatGrid
        onRefresh={() => get_menu()}
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
