import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { inputStyles } from '../../styles/styles';

export default function({ value, style }) {
  return (
    <View style={ style }>
      <Text style={ inputStyles.dateText }>
        {`${value}`}
      </Text>
    </View>
  );
}
