import React from 'react';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Header = React.forwardRef((props, ref) => {
  const {} = props;
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 50,
        justifyContent: 'center',
        backgroundColor: 'red',
        alignContent: 'center',
        alignItems: 'center',
      }}
      {...props}>
      <Text style={{color: 'white', fontSize: 20}}>Order Sebelumnya</Text>
    </TouchableOpacity>
  );
});

export default React.memo(Header);
