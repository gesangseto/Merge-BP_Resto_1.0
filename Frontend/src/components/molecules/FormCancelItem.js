import {Portal} from '@gorhom/portal';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Modal from 'react-native-modal';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {isInt, Toaster} from '../../helper';
import {
  ButtonFooterModal,
  Card,
  CoupleButton,
  InputPlusMinus,
  RequiredText,
} from '../atoms';

const heightForm = 45;

const FormCancelItem = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen} = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [itemData, setItemData] = useState(item);
  const modalCancelItem = useRef(null);

  useEffect(() => {
    item.qty = item.qty ? item.qty : 1;
    setItemData({...item});
  }, [item]);

  useEffect(() => {
    if (isOpen) {
      modalCancelItem.current?.open();
    } else {
      modalCancelItem.current?.close();
    }
  }, [isOpen]);

  const handleCancelOrder = () => {
    if (itemData.iscancel) {
      return Toaster({message: 'Item sudah dibatalkan', type: 'error'});
    }
    setVisibleModal(true);
  };

  const handleCloseModal = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Portal>
      <Modalize
        ref={modalCancelItem}
        onClosed={() => handleCloseModal()}
        modalHeight={500}
        FooterComponent={
          <ButtonFooterModal
            buttonTittle="Batalkan Order"
            buttonColor={colors.danger}
            onClickSubmit={() => handleCancelOrder()}
            totalText={itemData.qty * (itemData.price1 ?? itemData.listprice)}
          />
        }>
        <>
          <View style={{padding: 25}}>
            <Card item={itemData} useAvailableInfo={false} />
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
                <TextInput
                  keyboardType="numeric"
                  style={{
                    width: 100,
                    height: heightForm,
                    backgroundColor: colors.lightGrey,
                    marginVertical: 5,
                    borderRadius: 10,
                    textAlign: 'center',
                  }}
                  value={`${parseInt(itemData.qty ?? 0)}`}
                  onChangeText={val =>
                    setItemData({
                      ...itemData,
                      qty: parseInt(val ?? 0),
                    })
                  }
                  editable={false}
                />
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
                <CheckBox value={itemData.ispacked} />
              </View>
            </View>
          </View>

          <View>
            <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Note</Text>
            <TextInput
              style={styles.textNote}
              value={`${itemData.sodnote ?? ''}`}
              editable={false}
              onChangeText={val => setItemData({...itemData, sodnote: val})}
              multiline={true}
            />
          </View>
        </>
      </Modalize>
      <Modal
        isVisible={visibleModal}
        onBackButtonPress={() => setVisibleModal(false)}
        onBackdropPress={() => setVisibleModal(false)}>
        <ModalCancel
          item={itemData}
          onCancel={() => setVisibleModal(false)}
          onSave={it => {
            onSave ? onSave(it) : null;
            setVisibleModal(false);
          }}
        />
      </Modal>
    </Portal>
  );
});

const ModalCancel = props => {
  const {item, onCancel, onSave} = props;
  const [itemData, setItemData] = useState({});
  const [isError, setIsError] = useState(false);
  const [maxQty, setMaxQty] = useState(1);

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(item));
    setMaxQty(item.qty);
    data.qty = 1;
    setItemData({...data});
  }, [item]);

  const roleChangeQty = val => {
    if (isInt(val)) {
      if (parseInt(val) <= 0 || parseInt(val) > parseInt(item.qty)) {
        return;
      } else {
        setItemData({
          ...itemData,
          qty: parseInt(val) ?? 1,
        });
      }
    } else {
      setItemData({
        ...itemData,
        qty: 0,
      });
    }
  };

  const handleConfirmCancel = () => {
    if (!itemData.qty || !itemData.note) {
      setIsError(true);
    } else {
      if (onSave) {
        onSave(itemData);
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 15,
      }}>
      <Text
        style={{
          paddingTop: 10,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        Batalkan Order
      </Text>
      <View style={{paddingVertical: 15, marginHorizontal: 25}}>
        <View>
          <InputPlusMinus
            title="Qty"
            value={`${parseInt(itemData.qty)}`}
            onChange={val => {
              setItemData({...itemData, qty: val});
            }}
            maxValue={maxQty}
            minValue={1}
            isError={isError}
          />
        </View>
      </View>
      <View style={{marginHorizontal: 25}}>
        <Text style={{fontWeight: 'bold'}}>Note</Text>
        <TextInput
          style={styles.textNoteCancel}
          multiline={true}
          value={itemData.note}
          onChangeText={val => setItemData({...itemData, note: val})}
        />

        <RequiredText show={isError} title={'Note'} />
      </View>
      <View style={{height: 80}}>
        <CoupleButton
          fullSize={true}
          onPressSave={() => handleConfirmCancel()}
          onPressCancel={() => (onCancel ? onCancel() : null)}
        />
      </View>
    </View>
  );
};

export default React.memo(FormCancelItem);

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
    marginVertical: 5,
    marginHorizontal: 25,
  },
  textNoteCancel: {
    height: heightForm * 3,
    textAlignVertical: 'top',
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    marginVertical: 5,
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
