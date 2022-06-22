import {Portal} from '@gorhom/portal';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Modalize} from 'react-native-modalize';
import {colors} from '../../constants';
import {getGroupMenu} from '../../models';
import {ButtonFooterModal} from '../atoms';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const FilterMenu = forwardRef((props, ref) => {
  const {isOpen, onClose, onClickSubmit} = props;
  const modalFilter = useRef(null);
  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [selectedSubFilter, setSelectedSubFilter] = useState({});

  useEffect(() => {
    if (isOpen) {
      modalFilter.current?.open();
    } else {
      modalFilter.current?.close();
    }
  }, [isOpen]);

  useEffect(() => {
    (async function () {
      let group = await getGroupMenu({ispos: true});
      setFilters([...group]);
    })();
  }, []);

  useEffect(() => {}, [selectedSubFilter]);

  const handleClickSubmit = () => {
    if (onClickSubmit) {
      if (selectedSubFilter.hasOwnProperty('itgrpid')) {
        onClickSubmit(selectedSubFilter);
      } else {
        onClickSubmit(selectedFilter);
      }
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
          ref={modalFilter}
          onClosed={() => handleCloseModal()}
          modalHeight={650}
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
              <Text style={styles.textHeader}>Filter</Text>

              {selectedSubFilter.hasOwnProperty('itgrpid') ||
              selectedFilter.hasOwnProperty('itgrpid') ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.danger,
                    paddingHorizontal: 10,
                    marginHorizontal: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setSelectedSubFilter({...null});
                    setSelectedFilter({...null});
                  }}>
                  <Text style={styles.buttonHeader}>Reset</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          FooterComponent={
            <ButtonFooterModal
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
                    style={{
                      padding: 20,
                      borderBottomWidth: 1,
                      borderRightWidth:
                        selectedFilter.itgrpid === item.itgrpid ? 0 : 1,
                      backgroundColor:
                        selectedFilter.itgrpid === item.itgrpid
                          ? 'white'
                          : colors.darkGrey,
                      borderColor: colors.black,
                    }}
                    onPress={() => setSelectedFilter({...item})}>
                    <Text>{item.itgrpname}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.rightContainer}>
              {selectedFilter.hasOwnProperty('children') &&
                selectedFilter.children.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.boxRigthcontainer}
                      onPress={() => setSelectedSubFilter({...item})}>
                      <View style={{paddingVertical: 20, paddingLeft: 10}}>
                        <Text>{item.itgrpname}</Text>
                      </View>
                      <View style={{paddingVertical: 20, paddingRight: 10}}>
                        <MatComIcon
                          name={
                            selectedSubFilter.itgrpid === item.itgrpid
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

export default React.memo(FilterMenu);

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
