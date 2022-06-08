import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {ButtonFooterModal, Card} from '../atoms';
import FormNoteItem from './FormNoteItem';
import FormNoteOpenItem from './FormNoteOpenItem';

const FormCart = React.forwardRef((props, ref) => {
  const {host, selectedItems, onChange, onSubmit, onCancel, isOpen, isLoading} =
    props;
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedIndexItem, setSelectedIndexItem] = useState(null);
  const [modalNote, setModalNote] = useState(false);
  const [modalOpenNote, setModalOpenNote] = useState(false);
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
    for (const it of selectedItems) {
      ttl += it.qty * it.price1;
    }
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
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 'bold',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                backgroundColor: colors.lightGrey,
                padding: 10,
              }}>
              MEJA {host.hostdesc} : {host.billno}
            </Text>
          }
          FooterComponent={
            <ButtonFooterModal
              isLoading={isLoading}
              totalText={total}
              onClickSubmit={() => (onSubmit ? onSubmit(selectedMenu) : null)}
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
      </Portal>
      <FormNoteItem
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
