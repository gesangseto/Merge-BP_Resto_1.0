import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
import moment from 'moment';
import {Button, InputText} from '../atoms';

const FormBill = React.forwardRef((props, ref) => {
  const {host, onCancel, onSave} = props;
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
    for (const key in errorForm) {
      if (!formData[key]) {
        newError[key] = true;
      } else {
        newError[key] = false;
      }
    }
    seterrorForm({...newError});
  };

  const handleCancel = () => {
    console.log('Batal');
    if (onCancel) {
      onCancel();
    }
  };
  const handleSave = () => {
    console.log('Simpan');
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

  return (
    <View style={{flex: 1, paddingVertical: 15}}>
      <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>
        MEJA {host.hostdesc}
      </Text>
      <InputText
        editable={false}
        title="Kedatangan"
        value={`${formData.billdate} (${formData.arrivetime})`}
      />
      <InputText
        title="Jumlah Tamu"
        value={formData.pax}
        onChangeText={txt => setFormData({...formData, pax: txt})}
        required
        isError={errorForm.pax}
      />
      <InputText
        title="Keterangan"
        value={formData.billnote}
        onChangeText={txt => setFormData({...formData, billnote: txt})}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <Button
          onPress={() => handleCancel()}
          title="Batal"
          color={colors.danger}
          textColor={'white'}></Button>
        <Button
          onPress={() => handleSave()}
          title="Simpan"
          color={colors.success}
          textColor={'white'}></Button>
      </View>
    </View>
  );
});

export default React.memo(FormBill);
