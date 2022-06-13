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

const FormUpdateItem = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen} = props;
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
        modalHeight={200}
        ref={modalizeNote}
        onClosed={() => handleCloseModal()}
        FooterComponent={
          <ButtonFooterModal
            useTotal={false}
            buttonColor={itemData.isavailable ? colors.danger : colors.success}
            buttonTittle={itemData.isavailable ? 'Nonaktifkan' : 'Aktifkan'}
            onClickSubmit={() => handleSubmit()}
          />
        }>
        <>
          <View style={{padding: 25}}>
            <Card item={itemData} useCartInfo={false} />
          </View>
        </>
      </Modalize>
    </Portal>
  );
});

export default React.memo(FormUpdateItem);

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
