import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Select2 from 'react-native-select-two';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';
const SelectOption = React.forwardRef((props, ref) => {
  const {
    title,
    required,
    isError,
    bgColor,
    styleInput,
    onSelect,
    options,
    value,
    valueId = 'id',
    valueName = 'name',
  } = props;
  const [selected, setSelected] = useState({});
  const [listOptions, setListOptions] = useState([]);

  useEffect(() => {
    setSelected({...value});
    let _opt = [];
    for (const it of options) {
      let _map = {
        id: it[valueId],
        name: it[valueName],
        checked: false,
      };
      if (it[valueId] == value) {
        _map.checked = true;
      }
      _opt.push(_map);
    }
    setListOptions([..._opt]);
  }, [value, options]);

  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <Text style={{fontWeight: 'bold', paddingVertical: 5}}>{title}</Text>
        {required && (
          <Text style={{color: colors.danger, paddingVertical: 5}}> *</Text>
        )}
      </View>
      <Select2
        isSelectSingle
        style={{borderRadius: 5}}
        colorTheme="green"
        popupTitle="Select item"
        title="Select item"
        selectButtonText="Set"
        cancelButtonText="Batal"
        listEmptyTitle="No data"
        data={listOptions}
        onSelect={data => (onSelect ? onSelect(data) : null)}
        {...props}
      />
      {isError === true || isError === 'true' ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <MatComIcon
            name="alert-circle-outline"
            size={15}
            color={colors.red}
            style={{paddingVertical: 3}}
          />
          <Text style={{padding: 5, fontSize: 10, color: colors.red}}>
            {title} is required
          </Text>
        </View>
      ) : isError ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <MatComIcon
            name="alert-circle-outline"
            size={15}
            color={colors.red}
            style={{paddingVertical: 3}}
          />
          <Text style={{padding: 5, fontSize: 10, color: colors.red}}>
            {isError}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export default React.memo(SelectOption);
