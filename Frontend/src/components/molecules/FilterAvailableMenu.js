import {Portal} from '@gorhom/portal';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {getGroupMenu} from '../../models';
import {ButtonFooterModal} from '../atoms';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterAvailableMenu = forwardRef((props, ref) => {
  const {isOpen, onClose, onClickSubmit, isLoading} = props;
  const modalAvailableMenu = useRef(null);
  const [filters, setFilters] = useState([
    {isavailable: null, name: 'Semua'},
    {isavailable: 1, name: 'Tersedia'},
    {isavailable: 0, name: 'Kosong'},
  ]);
  const [selectedFilter, setSelectedFilter] = useState({
    isavailable: null,
    name: 'Semua',
  });

  useEffect(() => {
    if (isOpen) {
      modalAvailableMenu.current?.open();
    } else {
      modalAvailableMenu.current?.close();
    }
  }, [isOpen]);

  const handleClickSubmit = () => {
    if (onClickSubmit) {
      onClickSubmit(selectedFilter);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Portal>
        <Modalize
          ref={modalAvailableMenu}
          onClosed={() => handleCloseModal()}
          modalHeight={300}
          HeaderComponent={
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 2,
                backgroundColor: 'white',
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
              }}>
              <Text style={styles.textHeader}>Available Filter</Text>
            </View>
          }
          FooterComponent={
            <ButtonFooterModal
              isLodaing={isLoading}
              buttonTittle={'Terapkan'}
              useTotal={false}
              onClickSubmit={() => handleClickSubmit()}
            />
          }>
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              {filters.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.boxRigthcontainer}
                    onPress={() => setSelectedFilter({...item})}>
                    <View style={{paddingVertical: 20, paddingLeft: 10}}>
                      <Text>{item.name}</Text>
                    </View>
                    <View style={{paddingVertical: 20, paddingRight: 10}}>
                      <MatComIcon
                        name={
                          selectedFilter.isavailable === item.isavailable
                            ? 'checkbox-blank-circle'
                            : 'checkbox-blank-circle-outline'
                        }
                        size={20}
                        color="grey"
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Modalize>
      </Portal>
    </>
  );
});

export default React.memo(FilterAvailableMenu);

const styles = StyleSheet.create({
  textHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    // backgroundColor: colors.lightGrey,
  },
  leftContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rightContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  boxRigthcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    backgroundColor: 'white',
  },
});
