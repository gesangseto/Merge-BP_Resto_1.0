import {Portal} from '@gorhom/portal';
import React, {useEffect, useRef, useState} from 'react';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {SectionGrid} from 'react-native-super-grid';
import {colors} from '../../constants';
import {Toaster} from '../../helper';
import {getBill} from '../../models';
import {cancelSo} from '../../models/so';
import {Button, ButtonFooterModal, Card} from '../atoms';
import FormCancelItem from './FormCancelItem';
import PrintBill from './PrintBill';

const boxDimension = 250;
const FormOldOrder = React.forwardRef((props, ref) => {
  const {
    param,
    dataItems,
    onChange,
    onSubmit,
    onCancel,
    onCancelOrder,
    isOpen,
  } = props;
  const [datas, setDatas] = useState([]);
  const [data, setData] = useState({});
  const [itemForPrint, setItemForPrint] = useState({});
  const [modalPrint, setModalPrint] = useState(false);
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
            <>
              <View
                style={{
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  flexDirection: 'row',
                  backgroundColor: colors.lightGrey,
                  justifyContent: 'space-between',
                  paddingLeft: 10,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                    }}>
                    {param.hostdesc ?? param.bpname}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      backgroundColor: colors.lightGrey,
                    }}>
                    {param.billno}
                  </Text>
                </View>
                <Button
                  color={colors.success}
                  textColor={'white'}
                  marginRight={10}
                  height={30}
                  title={'Print All'}
                  onPress={() => {
                    setItemForPrint(param);
                    setModalPrint(true);
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  paddingRight: 10,
                  textAlign: 'right',
                }}>
                Order Sebelumnya
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
                  paddingLeft: 10,
                  flexDirection: 'row',
                  backgroundColor: colors.lightGrey,
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    backgroundColor: colors.lightGrey,
                    paddingVertical: 5,
                  }}>
                  {section.sono}
                </Text>

                <Button
                  color={colors.success}
                  textColor={'white'}
                  marginRight={10}
                  height={30}
                  title={'Print SO'}
                  onPress={() => {
                    setItemForPrint(section);
                    setModalPrint(true);
                  }}
                />
              </View>
            )}
          />
        </Modalize>
      </Portal>

      <PrintBill
        isOpen={modalPrint}
        onClose={() => setModalPrint(false)}
        item={itemForPrint}
      />

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
