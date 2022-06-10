import React, {useEffect, useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../../constants';
import Modal from 'react-native-modal';
import {CoupleButton, RequiredText} from '../atoms';
import {cancelBill} from '../../models';
import {Toaster} from '../../helper';
const heightForm = 45;
const boxDimension = 125;

const FormCancelBill = React.forwardRef((props, ref) => {
  const {selectedBill, onCancelBill} = props;
  const [visibleModalEdit, setVisibleModalEdit] = useState(false);

  useEffect(() => {}, []);

  const handleCancelBill = async item => {
    setVisibleModalEdit(false);

    let cancel = await cancelBill(item);
    if (!cancel) {
      return;
    } else {
      Toaster({
        message: `Sukses batalkan pesanan ${item.billno}`,
        type: 'success',
      });
      if (onCancelBill) {
        onCancelBill();
      }
    }
  };

  return (
    <>
      <Modal
        isVisible={visibleModalEdit}
        onBackButtonPress={() => setVisibleModalEdit(false)}
        onBackdropPress={() => setVisibleModalEdit(false)}>
        <ModalCancelTable
          item={selectedBill}
          onCancel={() => setVisibleModalEdit(false)}
          onSave={item => handleCancelBill(item)}
        />
      </Modal>
      <View
        style={{
          marginVertical: 20,
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          disabled={!selectedBill.can_cancel}
          style={{
            width: 250,
            height: 75,
            backgroundColor: !selectedBill.can_cancel ? 'grey' : colors.danger,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setVisibleModalEdit(true)}>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Batalkan Pesanan
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            {`${selectedBill.billno ?? selectedBill.hostdesc}`}
          </Text>
        </TouchableOpacity>
        {!selectedBill.can_cancel && (
          <Text
            style={{
              color: colors.danger,
              fontSize: 12,
              textAlign: 'center',
            }}>
            Tidak bisa batalkan pesanan{' '}
            {`${selectedBill.billno ?? selectedBill.hostdesc}`}, silahkan cancel
            semua order
          </Text>
        )}
      </View>
    </>
  );
});

export default FormCancelBill;

const ModalCancelTable = props => {
  const {item, onCancel, onSave} = props;
  const [itemData, setItemData] = useState({});
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setItemData({...item});
  }, [item]);

  const handleConfirmCancel = () => {
    if (!itemData.note || !itemData.billno) {
      setIsError(true);
    } else {
      if (onSave) {
        onSave(itemData);
      }
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 15,
        }}>
        <Text
          style={{
            textAlign: 'center',
            padding: 15,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          Batal Pesanan {`${itemData.billno ?? itemData.hostdesc}`}
        </Text>
        <View>
          <Text style={{marginHorizontal: 25, fontWeight: 'bold'}}>Note</Text>
          <TextInput
            style={styles.textNote}
            multiline={true}
            value={itemData.note}
            onChangeText={val => setItemData({...itemData, note: val})}
          />
          <RequiredText style={{paddingLeft: 25}} show={isError} title="Note" />
        </View>
        <View style={{height: 80}}>
          <CoupleButton
            onPressSave={() => handleConfirmCancel()}
            onPressCancel={() => (onCancel ? onCancel() : null)}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
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
});
