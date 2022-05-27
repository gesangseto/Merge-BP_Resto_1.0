import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {SectionGrid} from 'react-native-super-grid';
import {colors} from '../../constants';
import {Toaster} from '../../helper';
import {getBill} from '../../models';
import {cancelSo} from '../../models/so';
import {ButtonFooterModal, Card} from '../atoms';
import FormCancelItem from './FormCancelItem';

const boxDimension = 250;
const FormOldOrder = React.forwardRef((props, ref) => {
  const {host, dataItems, onChange, onSubmit, onCancel, onCancelOrder, isOpen} =
    props;
  const [datas, setDatas] = useState([]);
  const [data, setData] = useState({});
  const [total, setTotal] = useState(0);
  const [modalCancelItem, setModalCancelItem] = useState(false);
  const modalizeOldOrders = useRef(null);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    if (isOpen) {
      modalizeOldOrders.current?.open();
    } else {
      modalizeOldOrders.current?.close();
    }
  }, [isOpen]);

  const handleChangeItemInCart = item => {
    let menu = datas;
    let index = item.index;
    menu[index] = item;
    setDatas([...menu]);
    if (onChange) {
      onChange(menu);
    }
  };

  useEffect(() => {
    setDatas([...dataItems]);
    let ttl = 0;
    for (const it of dataItems) {
      for (const dis of it.data) {
        if (!dis.iscancel) ttl += dis.qty * dis.listprice;
      }
    }
    setTotal(ttl);
  }, [dataItems]);

  const handleCloseModal = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const openModalCancel = item => {
    setData({...item});
    setModalCancelItem(true);
  };
  const closeModalCancel = () => {
    setModalCancelItem(false);
  };

  const handleCancelOrder = async item => {
    if (onCancelOrder) {
      onCancelOrder(item);
    }
  };

  return (
    <>
      <Portal>
        <Modalize
          ref={modalizeOldOrders}
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
              totalText={total}
              useButton={false}
              onClickSubmit={() => (onSubmit ? onSubmit(datas) : null)}
            />
          }>
          <SectionGrid
            adjustGridToStyles={true}
            itemDimension={boxDimension}
            sections={datas}
            renderItem={({item, index}) => (
              <Card
                key={index}
                item={item}
                useDetail={true}
                useAddToCart={false}
                onPress={item => openModalCancel(item)}
                onChangeItem={item => handleChangeItemInCart(item)}
              />
            )}
            renderSectionHeader={({section}) => (
              <View
                style={{
                  backgroundColor: colors.lightGrey,
                  marginTop: 10,
                  paddingLeft: 15,
                }}>
                <Text style={{fontSize: 20}}>{section.sono}</Text>
              </View>
            )}
          />
        </Modalize>
      </Portal>
      <FormCancelItem
        isOpen={modalCancelItem}
        item={data}
        // index={selectedIndexItem}
        onCancel={() => closeModalCancel()}
        onSave={item => {
          handleCancelOrder(item);
          closeModalCancel();
        }}
      />
    </>
  );
});

export default React.memo(FormOldOrder);
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
