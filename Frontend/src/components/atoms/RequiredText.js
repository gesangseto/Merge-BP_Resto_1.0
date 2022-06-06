import React from 'react';
import {Text, View} from 'react-native';
import MatComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../constants';

const RequiredText = React.forwardRef((props, ref) => {
  const {title, message, style, show} = props;

  return (
    <View style={{...style}}>
      {show && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <MatComIcon
            name="alert-circle-outline"
            size={15}
            color={colors.red}
            style={{paddingVertical: 3}}
          />
          <Text style={{padding: 5, fontSize: 10, color: colors.red}}>
            {title ? `${title} is required` : message ?? 'No Message'}{' '}
          </Text>
        </View>
      )}
    </View>
  );
});

export default React.memo(RequiredText);
