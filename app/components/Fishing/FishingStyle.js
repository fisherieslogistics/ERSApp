import {
  StyleSheet,
} from 'react-native';
const transparent = 'transparent';
export default StyleSheet.create({
  detailView: {
    padding: 0,
    flex: 1,
  },
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
  viewButton: {
    alignItems: 'flex-end',
    flex: 0.2,
  },
  addItemButtom: {
    alignItems: 'flex-start',
    flex: 0.2
  },
  deleteButton: {
    top: -59,
    right: 40,
    backgroundColor: transparent,
  },
  buttonRowStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  detailWrap: {
    padding: 15,
  }
});
