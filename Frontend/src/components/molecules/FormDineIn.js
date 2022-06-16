import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Text, View, TextInput} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {ButtonFooterModal, InputPlusMinus, InputText} from '../atoms';

const heightForm = 45;

const FormDineIn = React.forwardRef((props, ref) => {
  const {isOpen, host, onCancel, onSave, onChange} = props;
  const modalOpenDineIn = useRef(null);
  const [formData, setFormData] = useState({
    bpid: 'CASH',
    billtype: 'DI',
    hostid: null,
    billdate: `${moment().format('YYYY-MM-DD')}`,
    arrivetime: `${moment().format('HH:mm:ss')}`,
    pax: '2',
    paystatus: 'N',
    billstatus: 'CHECKIN',
    billnote: '-',
    srepid: '', //Pelayan berdasarkan Login
  });

  const [errorForm, seterrorForm] = useState({
    pax: false,
  });

  const validationForm = () => {
    let newError = errorForm;
    let have_error = false;
    for (const key in errorForm) {
      if (!formData[key]) {
        have_error = true;
        newError[key] = true;
      } else {
        newError[key] = false;
      }
    }
    seterrorForm({...newError});
    if (!have_error && onChange) {
      onChange(formData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  useEffect(() => {
    validationForm();
  }, [formData]);

  useEffect(() => {
    setFormData({...formData, hostid: host.hostid});
  }, [host]);

  useEffect(() => {
    if (isOpen) {
      modalOpenDineIn.current?.open();
    } else {
      modalOpenDineIn.current?.close();
    }
  }, [isOpen]);

  return (
    <Modalize
      ref={modalOpenDineIn}
      modalHeight={450}
      onClosed={handleCancel}
      FooterComponent={
        <ButtonFooterModal
          buttonTittle={'Simpan'}
          useTotal={false}
          onClickSubmit={() => handleSave(formData)}
        />
      }
      HeaderComponent={
        <Text
          style={{
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            paddingVertical: 10,
          }}>
          MEJA {host.hostdesc}
        </Text>
      }>
      <View style={{flex: 1, paddingVertical: 15}}>
        <InputText
          editable={false}
          title="Kedatangan"
          value={`${formData.billdate} (${formData.arrivetime})`}
        />
        <View style={{margin: 10}}>
          <InputPlusMinus
            title="Jumlah Tamu"
            value={`${formData.pax}`}
            onChange={val => {
              setFormData({...formData, pax: val});
            }}
            isError={errorForm.pax}
          />
        </View>
        <TextInput
          style={{
            height: heightForm * 2,
            textAlignVertical: 'top',
            backgroundColor: colors.lightGrey,
            borderRadius: 10,
            marginVertical: 5,
            marginHorizontal: 10,
          }}
          value={`${formData.billnote ?? ''}`}
          onChangeText={txt => setFormData({...formData, billnote: txt})}
          multiline={true}
        />
      </View>
    </Modalize>
  );
});

export default React.memo(FormDineIn);
