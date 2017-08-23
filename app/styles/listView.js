'use strict';

import colors from './colors'

export default {
  listRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 9,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 10,
    backgroundColor: colors.white,
  },
  selectedListRow: {
    backgroundColor: colors.highlightBlue,
  },
  listRowItem: {
    flex: 0.5,
    backgroundColor: colors.white,
  },
  listRowItemTiny: {
    flex: 0.1,
  },
  listRowItemNarrow:{
    flex: 0.20,
    justifyContent: 'flex-start',
  },
  listViewWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    padding: 0,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    left: 0,
    top: 5,
  },
  detail: {
    marginTop: 5
  },
  seperator: {
    height: 1,
    backgroundColor: colors.midGray,
  }
};
