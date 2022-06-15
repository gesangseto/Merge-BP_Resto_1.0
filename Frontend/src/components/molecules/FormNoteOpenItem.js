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
import {ButtonFooterModal, Card, InputPlusMinus} from '../atoms';
import SelectDropdown from 'react-native-select-dropdown';
import {getNote} from '../../models';

const heightForm = 45;
const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];

const FormNoteOpenItem = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen, isTakeAway} = props;
  const [itemData, setItemData] = useState({});
  const [listOption, setListOption] = useState([]);
  const [selectedList, setSelectedList] = useState({});
  const modalizeNote = useRef(null);
  const dropdownRef = useRef({});

  const get_note = async id => {
    let _data = await getNote({itemid: id});
    setListOption([..._data]);
  };

  useEffect(() => {
    let _item = {};
    if (item.hasOwnProperty('itemid')) {
      _item = item;
      _item.qty = item.qty ? item.qty : 1;
      if (item.itemid) get_note(item.itemid);
    }
    if (isTakeAway) {
      _item.ispacked = true;
    }
    setItemData({..._item});
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      modalizeNote.current?.open();
    } else {
      modalizeNote.current?.close();
    }
  }, [isOpen]);

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
          <View>
            <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Desc</Text>
            <TextInput
              style={{
                textAlignVertical: 'top',
                backgroundColor: colors.lightGrey,
                borderRadius: 10,
                marginLeft: 25,
                marginVertical: 5,
                marginHorizontal: 25,
              }}
              value={`${itemData.itemdesc ?? ''}`}
              onChangeText={val => setItemData({...itemData, itemdesc: val})}
            />
          </View>
          <View>
            <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>
              Price (IDR)
            </Text>
            <TextInput
              style={{
                textAlignVertical: 'top',
                backgroundColor: colors.lightGrey,
                borderRadius: 10,
                marginLeft: 25,
                marginVertical: 5,
                marginHorizontal: 25,
              }}
              keyboardType="numeric"
              value={`${itemData.price1 ? parseInt(itemData.price1) : ''}`}
              onChangeText={val => setItemData({...itemData, price1: val})}
            />
          </View>
          <View
            style={{
              marginVertical: 25,
              marginHorizontal: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <InputPlusMinus
              title="Qty"
              value={`${itemData.qty}`}
              onChange={val => {
                setItemData({...itemData, qty: val});
              }}
              minValue={1}
            />
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
                    isTakeAway
                      ? null
                      : setItemData({...itemData, ispacked: val})
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

export default React.memo(FormNoteOpenItem);

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
    borderColor: colors.danger,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginLeft: 25,
  },
  containerPlus: {
    height: heightForm,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
