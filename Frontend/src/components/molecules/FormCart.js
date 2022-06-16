import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ModalAlert} from '.';
import {colors} from '../../constants';
import {ButtonFooterModal, Card} from '../atoms';
import FormNoteItem from './FormNoteItem';
import FormNoteOpenItem from './FormNoteOpenItem';

const FormCart = React.forwardRef((props, ref) => {
  const {
    param,
    selectedItems,
    onChange,
    onSubmit,
    onCancel,
    isOpen,
    isLoading,
    isTakeAway,
  } = props;
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedIndexItem, setSelectedIndexItem] = useState(null);
  const [modalNote, setModalNote] = useState(false);
  const [modalOpenNote, setModalOpenNote] = useState(false);
  const [alertSubmit, setAlertSubmit] = useState(false);
  const modalizeCart = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalizeCart.current?.open();
    } else {
      modalizeCart.current?.close();
    }
  }, [isOpen]);

  const handleChangeItemInCart = item => {
    let menu = selectedMenu;
    let index = item.index;
    menu[index] = item;
    // setSelectedMenu([...menu]);
    if (onChange) {
      onChange(item);
    }
  };

  const openModalNoted = item => {
    setSelectedIndexItem(item.index);
    setSelectedItem({...item});
    setModalNote(true);
  };

  const openModalOpenNoted = item => {
    // setSelectedIndexItem(item.index);
    setSelectedItem({...item});
    setModalOpenNote(true);
  };

  const closeModalNote = () => {
    setModalNote(false);
  };
  const closeModalOpenNote = () => {
    setModalOpenNote(false);
  };

  useEffect(() => {
    setSelectedMenu([...selectedItems]);
    let ttl = 0;
    let qty = 0;
    for (const it of selectedItems) {
      ttl += it.qty * it.price1;
      qty += it.qty;
    }
    setQuantity(qty);
    setTotal(ttl);
  }, [selectedItems]);

  const handleCloseModal = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <Portal>
        <Modalize
          ref={modalizeCart}
          onClosed={() => handleCloseModal()}
          HeaderComponent={
            <>
              <View
                style={{
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  paddingHorizontal: 10,
                  backgroundColor: colors.lightGrey,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: colors.lightGrey,
                  }}>
                  <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                    {param.hostdesc ?? param.bpname}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      textAlignVertical: 'center',
                    }}>
                    Item Menu: {selectedMenu.length}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: colors.lightGrey,
                  }}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {param.billno}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      textAlignVertical: 'center',
                    }}>
                    Jml Porsi: {quantity}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  paddingRight: 10,
                  textAlign: 'right',
                }}>
                Keranjang
              </Text>
              <View
                style={{
                  borderBottomColor: colors.lightGrey,
                  borderBottomWidth: 1,
                  elevation: 2,
                }}
              />
            </>
          }
          FooterComponent={
            <ButtonFooterModal
              isLoading={isLoading}
              totalText={total}
              onClickSubmit={() => setAlertSubmit(true)}
            />
          }>
          <View style={{flex: 1, paddingVertical: 15}}>
            {selectedMenu.map((item, index) => {
              return (
                <View key={index} style={{padding: 5}}>
                  <Card
                    item={item}
                    useDetail={true}
                    useAddToCart={false}
                    onPress={item =>
                      item.hasOwnProperty('is_openmenu')
                        ? openModalOpenNoted(item)
                        : openModalNoted(item)
                    }
                    onChangeItem={item => handleChangeItemInCart(item)}
                  />
                </View>
              );
            })}
          </View>
        </Modalize>
        <ModalAlert
          title={'Konfirmasi'}
          message={'Apakah Anda yakin mau mengirimkan order ini?'}
          isOpen={alertSubmit}
          onCancel={() => setAlertSubmit(false)}
          onSave={() => {
            setAlertSubmit(false);
            onSubmit ? onSubmit(selectedMenu) : null;
          }}
        />
      </Portal>
      <FormNoteItem
        isTakeAway={isTakeAway}
        isOpen={modalNote}
        item={selectedItem}
        index={selectedIndexItem}
        onCancel={closeModalNote}
        onSave={item => {
          handleChangeItemInCart(item);
          closeModalNote();
        }}
      />
      <FormNoteOpenItem
        isTakeAway={isTakeAway}
        isOpen={modalOpenNote}
        item={selectedItem}
        index={selectedIndexItem}
        onCancel={closeModalOpenNote}
        onSave={item => {
          handleChangeItemInCart(item);
          closeModalOpenNote();
        }}
      />
    </>
  );
});

export default React.memo(FormCart);
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingTop: 50,
    flex: 1,
  },
  left: {
    backgroundColor: 'lightblue',
    flex: 1,
  },
  right: {
    backgroundColor: 'lightgreen',
    flex: 4,
  },
  rightInner: {
    flex: 1,
    backgroundColor: 'orange',
  },
  content: {
    flex: 1,
  },
  footer: {
    backgroundColor: 'green',
  },
});
