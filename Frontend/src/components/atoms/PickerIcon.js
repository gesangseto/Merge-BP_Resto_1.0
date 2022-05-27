import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {LogBox, StyleSheet, TouchableOpacity} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {WhitePortal} from 'react-native-portal';
import {FlatGrid} from 'react-native-super-grid';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, listIcons} from '../../constants';
import InputTextPressable from './InputTextPressable';

const PickerIcon = forwardRef((props, ref) => {
  const {title, required, value, onSubmit} = props;
  const [data, setData] = useState('');
  const [list, setList] = useState([]);
  const load = 60;
  const modalizeRef = useRef(null);

  useEffect(() => {
    setData(value);
  }, [value]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    generateListIcon();
  }, []);

  const handleClickBoxItem = item => {
    setList([]);
    setData(item);
    modalizeRef.current?.close();
    if (onSubmit) {
      onSubmit(item);
    }
  };

  const generateListIcon = () => {
    let cur_len = list.length;
    let arr = [];
    arr = listIcons.slice(cur_len, load + cur_len);
    setList([...list, ...arr]);
  };

  const renderBoxItem = item => {
    return (
      <TouchableOpacity
        onPress={() => handleClickBoxItem(item)}
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          padding: 10,
          height: 80,
          backgroundColor: colors.darkGrey,
        }}>
        <MatComIcon name={item} size={40} />
      </TouchableOpacity>
    );
  };
  return (
    <>
      <InputTextPressable
        onPressIn={() => modalizeRef.current?.open()}
        required={required}
        title={title}
        selectTextOnFocus={false}
        editable={false}
        icon={data}
        value={data}
      />
      <WhitePortal name="PickerIcon">
        <Modalize ref={modalizeRef}>
          <FlatGrid
            onEndReached={() => generateListIcon()}
            itemDimension={80}
            data={list}
            style={styles.gridView}
            spacing={5}
            renderItem={({item}) => renderBoxItem(item)}
          />
        </Modalize>
      </WhitePortal>
    </>
  );
});

const styles = StyleSheet.create({
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: 10,
    height: 40,
    backgroundColor: 'red',
    borderColor: 'red',
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemDesc: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default React.memo(PickerIcon);
