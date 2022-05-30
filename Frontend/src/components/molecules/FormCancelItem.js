import {Portal} from '@gorhom/portal';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useRef, useState} from 'react';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {ButtonFooterModal, Card, CoupleButton} from '../atoms';
import Modal from 'react-native-modal';
import {isInt, Toaster} from '../../helper';

const heightForm = 45;

const FormCancelItem = React.forwardRef((props, ref) => {
  const {item, onCancel, onSave, isOpen} = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [itemData, setItemData] = useState(item);
  const modalizeNote = useRef(null);

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
      <Modalize
        ref={modalizeNote}
        onClosed={() => handleCloseModal()}
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

  useEffect(() => {
    setItemData({...item});
  }, [item]);

  const handleChangeQty = type => {
    let itm = itemData;
    let qty = parseInt(itm.qty);
    if (type == 'remove') {
      qty = qty > 0 ? qty - 1 : 0;
    } else {
      qty = qty == 0 ? 1 : qty + 1;
    }
    roleChangeQty(qty);
  };

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
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
      }}>
      <View style={{paddingVertical: 15}}>
        <View>
          <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>
            Qty to cancel
          </Text>
          <View style={styles.containerPlusMinus}>
            <TouchableOpacity
              style={styles.containerMinus}
              onPress={() => handleChangeQty('remove')}>
              <MatComIcon name="minus" color={colors.danger} />
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
              value={`${parseInt(1 ?? 0)}`}
              onChangeText={val => roleChangeQty(val)}
            />
            <TouchableOpacity
              style={styles.containerPlus}
              onPress={() => handleChangeQty('add')}>
              <MatComIcon name="plus" color="white" />
            </TouchableOpacity>
          </View>

          {isError ? (
            <Text style={styles.textError}>* Qty must bigger than 0</Text>
          ) : null}
        </View>
      </View>
      <View>
        <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Note</Text>
        <TextInput
          style={styles.textNote}
          multiline={true}
          value={itemData.note}
          onChangeText={val => setItemData({...itemData, note: val})}
        />
        {isError ? (
          <Text style={styles.textError}>* Note is required</Text>
        ) : null}
      </View>
      <View style={{height: 80}}>
        <CoupleButton
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
