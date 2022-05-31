import {Portal} from '@gorhom/portal';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../../constants';
import {CoupleButton} from '../atoms';

const heightForm = 45;

const ModalAlert = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen, title, message} = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [itemData, setItemData] = useState(item);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isOpen) {
      setVisibleModal(true);
    } else {
      setVisibleModal(false);
    }
  }, [isOpen]);

  const handleCancelOrder = () => {
    setVisibleModal(true);
  };

  const handleCloseModal = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Portal>
      <Modal
        isVisible={visibleModal}
        onBackButtonPress={() => setVisibleModal(false)}
        onBackdropPress={() => setVisibleModal(false)}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <View style={{paddingVertical: 15, alignSelf: 'center'}}>
            <Text
              style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
              {title ?? 'No Title'}
            </Text>
          </View>
          <View style={{paddingVertical: 15, alignSelf: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              {message ?? 'Yakin ingin keluar halaman?'}
            </Text>
          </View>
          <View style={{height: 80}}>
            <CoupleButton
              titleSave="Ya"
              titleCancel="Tidak"
              onPressSave={() => (onSave ? onSave() : null)}
              onPressCancel={() => (onCancel ? onCancel() : null)}
            />
          </View>
        </View>
      </Modal>
    </Portal>
  );
});

export default React.memo(ModalAlert);

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  textError: {
    fontSize: 10,
    paddingLeft: 25,
    marginTop: -5,
    color: colors.danger,
  },
  textNote: {
    height: heightForm * 3,
    textAlignVertical: 'top',
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    marginLeft: 25,
    marginVertical: 5,
    marginHorizontal: 25,
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
    paddingHorizontal: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
