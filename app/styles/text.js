"use strict";
import {
  StyleSheet
} from 'react-native';
import colors from './darkColors';

export default StyleSheet.create({
  largeLabel: {
    lineHeight: 35,
    fontSize: 30,
    color: '#fff',
  },
  font: {
    fontFamily: 'System',
  },
  light: {
    color: colors.green,
  },
  black: {
    color: colors.black,
  },
  white: {
    color: 'white'
  },
  listView: {
    fontSize: 20,
  },
  button: {
    fontSize: 20,
    fontWeight: "400",
    color: '#fff',
  }
});
