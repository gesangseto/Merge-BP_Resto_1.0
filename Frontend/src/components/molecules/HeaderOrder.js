import React, {useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import * as RootNavigation from '../../helper';
import {IconWithBadge} from '../atoms/IconWithBadge';

const HeaderOrder = React.forwardRef((props, ref) => {
  const {selectedItem, onClickCart, onSearch, onChangeSearch} = props;
  const [textSearch, setTextSearch] = useState('');
  const [count, setCount] = useState(0);
  useEffect(() => {
    let count = 0;
    for (const it of selectedItem) {
      count += it.qty;
    }
    setCount(count);
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

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 10,
        height: 50,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{justifyContent: 'center', paddingLeft: 15}}
        onPress={() => RootNavigation.goBack()}>
        <MatComIcon name="arrow-left" size={30} color="grey" />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderRadius: 10,
          justifyContent: 'flex-start',
          backgroundColor: colors.lightGrey,
          height: 35,
          // width: 170,
          borderRadius: 15,
          alignSelf: 'center',
        }}>
        <View style={{justifyContent: 'center', paddingHorizontal: 5}}>
          <MatComIcon name="magnify" size={30} color="grey" />
        </View>
        <View style={{justifyContent: 'center'}}>
          <TextInput
            style={{
              backgroundColor: colors.lightGrey,
              width: 140,
              height: 35,
              borderRadius: 15,
            }}
            value={textSearch}
            onChangeText={txt => handleChangeSearch(txt)}
            onSubmitEditing={() => (onSearch ? onSearch(textSearch) : null)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{justifyContent: 'center'}}
        onPress={() => console.log('filter')}>
        <MatComIcon name="filter-menu" size={30} color="grey" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{justifyContent: 'center', paddingRight: 15}}
        onPress={() => handleClickCart()}>
        <IconWithBadge iconName="cart-variant" text={count} iconSize={30} />
      </TouchableOpacity>
    </View>
  );
});

export default React.memo(HeaderOrder);
