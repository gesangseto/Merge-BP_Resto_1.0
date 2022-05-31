import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import {curencyFormating, textTrimPerLine} from '../../helper';

const defaultItem = {
  index: '',
  itemid: '',
  link_picture: '',
  itemdesc: '',
  qty: '',
  price1: '',
  baseprice: '',
  unit: '',
  unit1: '',
};
export default function Card(prop) {
  const {item, selectedItems, onChangeItem, onPress, useDetail, useAddToCart} =
    prop;
  const [itemData, setItemData] = useState(defaultItem);

  const handleAddToCart = type => {
    let itm = itemData;
    if (type == 'remove') {
      itm.qty = itm.qty || itm.qty == 0 ? itm.qty - 1 : 1;
    } else {
      itm.qty = itm.qty || itm.qty == 0 ? itm.qty + 1 : 1;
    }
    if (onChangeItem) {
      onChangeItem(itm);
    }
    setItemData({...itm});
  };

  const handleClickCard = () => {
    if (onPress) {
      onPress(itemData);
    }
  };

  useEffect(() => {
    if (Object.keys(item).length > 0) {
      setItemData({...item});
      if (selectedItems && selectedItems.length) {
        let index = selectedItems.findIndex(x => x.itemid === item.itemid);
        let it = selectedItems[index];
        if (index >= 0)
          setItemData({...item, qty: it.qty, ispacked: it.ispacked});
      }
    }
  }, [item, selectedItems]);

  return (
    <>
      <TouchableOpacity
        onPress={() => handleClickCard()}
        style={{
          elevation: 3,
          flexDirection: 'row',
          flexWrap: 'wrap',
          // height: 80,
          borderRadius: 10,
          backgroundColor: itemData.iscancel ? '#ffd0c4' : colors.white,
          justifyContent: 'flex-start',
        }}>
        <View style={styles.imageContainer}>
          {itemData.link_picture ? (
            <Image
              style={{height: 80}}
              resizeMode={'contain'}
              source={{uri: `${itemData.link_picture}`}}
            />
          ) : null}
        </View>
        <View style={{flex: 1, paddingLeft: 10}}>
          <View style={{flex: 1, marginTop: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>
              {itemData.itemdesc}
            </Text>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-start', marginBottom: 5}}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: colors.danger}}>
                Rp. {curencyFormating(itemData.price1 ?? itemData.listprice)} /{' '}
                {itemData.unit1 ?? itemData.unit}
              </Text>
              {useAddToCart ? (
                <View style={styles.containerPlusMinus}>
                  {itemData.qty ? (
                    <TouchableOpacity
                      style={styles.containerMinus}
                      onPress={() => handleAddToCart('remove')}>
                      <MatComIcon name="minus" color={colors.danger} />
                    </TouchableOpacity>
                  ) : null}
                  <View
                    style={{
                      justifyContent: 'center',
                      paddingHorizontal: 7,
                    }}>
                    <Text>{parseInt(itemData.qty ?? 0)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.containerPlus}
                    onPress={() => handleAddToCart(itemData, 'add')}>
                    <MatComIcon name="plus" color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.containerPlusMinus}>
                  <View
                    style={{
                      justifyContent: 'center',
                      paddingHorizontal: 7,
                    }}>
                    <Text
                      style={{color: itemData.qty ? colors.danger : 'grey'}}>
                      {parseInt(itemData.qty ?? 0)} x
                    </Text>
                  </View>
                  <MatComIcon name="cart-variant" size={20} color="grey" />
                </View>
              )}
            </View>
          </View>
          <View
            style={{flex: 1, justifyContent: 'flex-start', marginBottom: 5}}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <View style={styles.containerPlusMinus}>
                {itemData.ispacked && (
                  <>
                    <MatComIcon name={'package-variant'} size={20} />
                    <Text> Bungkus</Text>
                  </>
                )}
              </View>
              <View style={styles.containerPlusMinus}>
                {useDetail ? (
                  <Text
                    style={{
                      color: itemData.qty ? colors.danger : 'grey',
                      fontWeight: 'bold',
                    }}>
                    RP.{' '}
                    {curencyFormating(
                      itemData.qty * (itemData.price1 ?? itemData.listprice),
                    )}
                  </Text>
                ) : null}
              </View>
            </View>
            {itemData.sodnote ? (
              <View
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderColor: colors.lightGrey,
                  flexDirection: 'row',
                }}>
                <MatComIcon name="file-document-edit" size={20} color="grey" />
                <Text style={{color: 'grey', paddingHorizontal: 5}}>
                  {itemData.sodnote}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
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
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 5,
  },
  containerPlus: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 5,
  },
});
