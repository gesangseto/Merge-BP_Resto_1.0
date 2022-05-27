import {Portal} from '@gorhom/portal';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import {isInt} from '../../helper';
import {ButtonFooterModal, Card} from '../atoms';

const heightForm = 45;

const FormNoteItem = React.forwardRef((props, ref) => {
  const {item, selectedItems, onCancel, onSave, isOpen} = props;
  const [itemData, setItemData] = useState({});
  const [selectedMenus, setSelectedMenus] = useState([]);
  const modalizeNote = useRef(null);

  useEffect(() => {
    item.qty = item.qty ? item.qty : 1;
    setItemData({...item});
  }, [item]);

  useEffect(() => {
    item.qty = item.qty ? item.qty : 1;
    setItemData({...item});
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      modalizeNote.current?.open();
    } else {
      modalizeNote.current?.close();
    }
  }, [isOpen]);

  const handleAddToCart = type => {
    let menu = itemData;
    if (type == 'remove') {
      menu.qty = menu.qty || menu.qty < 0 ? menu.qty - 1 : 0;
    } else {
      menu.qty = menu.qty || menu.qty == 0 ? menu.qty + 1 : 1;
    }
    setItemData({...menu});
  };
  const handleSubmit = () => {
    if (onSave) {
      onSave(itemData);
    }
    handleCloseModal();
  };
  const handleCloseModal = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeNote}
        onClosed={() => handleCloseModal()}
        FooterComponent={
          <ButtonFooterModal
            buttonTittle="Simpan Keranjang"
            onClickSubmit={() => handleSubmit()}
            totalText={itemData.qty * itemData.price1 ?? 0}
          />
        }>
        <>
          <View style={{padding: 25}}>
            <Card item={itemData} />
          </View>
          <View
            style={{
              marginVertical: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>
                Qty
              </Text>
              <View style={styles.containerPlusMinus}>
                <TouchableOpacity
                  style={styles.containerMinus}
                  onPress={() => handleAddToCart('remove')}>
                  <MatComIcon name="minus" color="red" />
                </TouchableOpacity>
                <TextInput
                  keyboardType="numeric"
                  style={{
                    width: 100,
                    height: heightForm,
                    backgroundColor: colors.lightGrey,
                    marginVertical: 5,
                    textAlign: 'center',
                  }}
                  value={`${parseInt(itemData.qty ?? 0)}`}
                  onChangeText={val =>
                    setItemData({
                      ...itemData,
                      qty: isInt(val) || val > 0 ? val : 0,
                    })
                  }
                />
                <TouchableOpacity
                  style={styles.containerPlus}
                  onPress={() => handleAddToCart(itemData, 'add')}>
                  <MatComIcon name="plus" color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>
                Take away
              </Text>
              <View
                style={{
                  height: heightForm,
                  marginVertical: 5,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <CheckBox
                  value={itemData.ispacked}
                  onValueChange={val =>
                    setItemData({...itemData, ispacked: val})
                  }
                />
              </View>
            </View>
          </View>

          <View>
            <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Note</Text>
            <TextInput
              style={{
                height: heightForm * 3,
                textAlignVertical: 'top',
                backgroundColor: colors.lightGrey,
                borderRadius: 10,
                marginLeft: 25,
                marginVertical: 5,
                marginHorizontal: 25,
              }}
              value={`${itemData.sodnote ?? ''}`}
              onChangeText={val => setItemData({...itemData, sodnote: val})}
              multiline={true}
            />
          </View>
        </>
      </Modalize>
    </Portal>
  );
});

export default React.memo(FormNoteItem);

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  boxContainer: {
    elevation: 3,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerMinus: {
    height: heightForm,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 25,
  },
  containerPlus: {
    height: heightForm,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
