'use strict';
import{
  View,
  Text,
} from 'react-native';
import React from 'react';
import MasterListView from '../common/MasterListView';
import { listViewStyles, colors } from '../../styles/styles';

class TotalsList extends MasterListView {

  constructor(props){
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  isSelected(){
    return false;
  }

  renderRow(item, sectionId, rowId) {
    const rowStyle = { backgroundColor: colors.transparent };
    return (
      <View style={[listViewStyles.listRow, rowStyle]}>
        { this.getDescription(item, item.color, sectionId, rowId) }
      </View>
    )
  }

  getDescription(total, color) {
    const textStyle = {
      color: color ? colors[color] : colors.green,
      fontSize: 18,
    };
    return [total.code, total.amount].map((detail, i) => (
      <View
        style={ [listViewStyles.listRowItemNarrow, {backgroundColor: colors.transparent}] }
        key={"totals_list" + i}
      >
        <Text style={ textStyle }>
          { detail }
        </Text>
    </View>
    ));
  }
}

export default TotalsList;
