import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {colors} from '../../constants';

const Button = React.forwardRef((props, ref) => {
  const {
    title,
    required,
    margin,
    marginLeft,
    marginRight,
    padding,
    height,
    color,
    textColor,
  } = props;
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color ?? colors.red,
        margin: margin ?? 0,
        marginRight: marginRight ?? 0,
        marginLeft: marginLeft ?? 0,
        padding: padding ?? 0,
        height: height ?? 40,
        width: 75,
        borderRadius: 5,
        alignSelf: 'center',
        justifyContent: 'center',
      }}
      {...props}>
      <Text
        style={{
          textAlign: 'center',
          color: textColor ?? 'black',
          textAlignVertical: 'center',
        }}>
        {title ? title : 'No Title'}
      </Text>
    </TouchableOpacity>
  );
});

export default React.memo(Button);
