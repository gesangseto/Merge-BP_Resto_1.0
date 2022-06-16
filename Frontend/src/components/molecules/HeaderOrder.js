import React, {useEffect, useState} from 'react';
import {BackHandler, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import * as RootNavigation from '../../helper';
import {IconWithBadge} from '../atoms/IconWithBadge';
import FilterAvailableMenu from './FilterAvailableMenu';
import FilterMenu from './FilterMenu';
import ModalAlert from './ModalAlert';

const HeaderOrder = React.forwardRef((props, ref) => {
  const {
    selectedItem,
    filter,
    onClickCart,
    onSearch,
    onChangeSearch,
    onChangeFilter,
    useCart = true,
    useBack = true,
    filterAvailable = false,
    onChangeFilterAvailable,
    isLoading,
  } = props;
  const [textSearch, setTextSearch] = useState('');
  const [viewModalFilter, setViewModalFilter] = useState(false);
  const [viewModalAvailable, setViewModalAvailable] = useState(false);
  const [availableFilter, setAvailableFilter] = useState({});
  const [count, setCount] = useState(0);
  const [alertBack, setAlertBack] = useState(false);

  // useEffect(() => {
  // }, [selectedItem]);

  useEffect(() => {
    let count = 0;
    for (const it of selectedItem) {
      count += it.qty;
    }
    setCount(count);

    const backHardware = BackHandler.addEventListener(
      'hardwareBackPress',
      function () {
        if (selectedItem.length > 0) {
          setAlertBack(true);
          return true;
        }
      },
    );
    return () => {
      backHardware.remove();
    };
  }, [selectedItem]);

  const handleClickCart = () => {
    if (onClickCart) {
      onClickCart(selectedItem);
    }
  };

  const handleChangeSearch = txt => {
    if (onChangeSearch) onChangeSearch(txt);
    setTextSearch(txt);
  };

  const handleBackButton = () => {
    console.log(selectedItem);
    if (selectedItem.length > 0) {
      setAlertBack(true);
      return false;
    } else {
      RootNavigation.goBack();
    }
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderRadius: 10,
          height: 50,
          justifyContent: 'space-around',
          backgroundColor: 'white',
          alignContent: 'center',
          alignItems: 'center',
        }}>
        {useBack ? (
          <TouchableOpacity
            style={{justifyContent: 'center', marginLeft: 15}}
            onPress={() => handleBackButton()}>
            <MatComIcon name="arrow-left" size={30} color="grey" />
          </TouchableOpacity>
        ) : null}
        {filterAvailable ? (
          <TouchableOpacity
            style={{justifyContent: 'center', marginLeft: 15}}
            onPress={() => setViewModalAvailable(true)}>
            <MatComIcon
              name={
                availableFilter.isavailable == null
                  ? 'filter-off-outline'
                  : 'filter-outline'
              }
              size={30}
              color="grey"
            />
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            borderRadius: 10,
            // justifyContent: 'flex-start',
            backgroundColor: colors.lightGrey,
            height: 35,
            borderRadius: 15,
            marginLeft: 15,
            // alignSelf: 'center',
          }}>
          <View style={{justifyContent: 'center', marginHorizontal: 15}}>
            <MatComIcon name="magnify" size={30} color="grey" />
          </View>
          <View style={{justifyContent: 'center', flex: 1}}>
            <TextInput
              style={{
                backgroundColor: colors.lightGrey,
                height: 35,
                borderRadius: 15,
              }}
              value={textSearch}
              onChangeText={txt => handleChangeSearch(txt)}
              onSubmitEditing={() => (onSearch ? onSearch(textSearch) : null)}
            />
          </View>
          {textSearch ? (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                paddingHorizontal: 5,
                flex: 1,
              }}
              onPress={() => handleChangeSearch('')}>
              <MatComIcon name="close-circle-outline" size={20} color="grey" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={{justifyContent: 'center', marginHorizontal: 15}}
          onPress={() => setViewModalFilter(true)}>
          <MatComIcon
            name={
              filter.hasOwnProperty('itgrpid')
                ? 'filter-menu-outline'
                : 'filter-menu'
            }
            size={30}
            color={filter.hasOwnProperty('itgrpid') ? colors.danger : 'grey'}
          />
        </TouchableOpacity>
        {useCart ? (
          <TouchableOpacity
            style={{justifyContent: 'center', paddingRight: 15}}
            onPress={() => handleClickCart()}>
            <IconWithBadge iconName="cart-variant" text={count} iconSize={30} />
          </TouchableOpacity>
        ) : null}
      </View>
      <FilterMenu
        isOpen={viewModalFilter}
        onClose={() => setViewModalFilter(false)}
        onClickSubmit={item => (onChangeFilter ? onChangeFilter(item) : null)}
      />
      <FilterAvailableMenu
        isLoading={isLoading}
        isOpen={viewModalAvailable}
        onClose={() => setViewModalAvailable(false)}
        onClickSubmit={item => {
          onChangeFilterAvailable ? onChangeFilterAvailable(item) : null;
          setAvailableFilter({...item});
        }}
      />
      <ModalAlert
        title={'Konfirmasi'}
        message={
          'Yakin ingin keluar halaman?\nSudah ada order didalam keranjang'
        }
        isOpen={alertBack}
        onCancel={() => setAlertBack(false)}
        onSave={() => {
          setAlertBack(false);
          RootNavigation.goBack();
        }}
      />
    </>
  );
});

export default React.memo(HeaderOrder);
