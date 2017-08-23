'use strict';
import{
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
import { ListView } from 'realm/react-native';
import React, { Component } from 'react';
import { listViewStyles, colors, textStyles } from '../../styles/styles';


export default class RealmMasterListView extends Component {

  constructor(props){
    super(props);
    this.renderSeperator = this.renderSeperator.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  renderSeperator(sectionID, rowID) {
    return (<View key={`${sectionID}-${rowID}`} style={listViewStyles.seperator} />);
  }

  onPress(item){
    if(this.props.onPress) {
      this.props.onPress(item);
    }
  }

  getTextStyle(isSelected){
    if(isSelected){
      return [ textStyles.font, listViewStyles.text, textStyles.white ];
    }
    return [ textStyles.font, listViewStyles.text ];
  }

  getDescription(item, selected){
    return item;
  }

  renderDescription(item, isSelected) {
    const descStyles = this.getTextStyle(isSelected, item);
    let desc;
    if(this.props.getDescription){
      desc = this.props.getDescription();
    }
    desc = this.getDescription(item, isSelected);
    return (
      <View style={listViewStyles.description}>
        <Text style={descStyles}>
          { desc }
        </Text>
      </View>
    )
  }

  getIcon(item, selected) {
    return this.props.getIcon ? this.props.getIcon(item, selected) : null;
  }

  renderIcon(item) {
    const icon = this.getIcon(item);
    return (
      <View style={ listViewStyles.listRowItemTiny }>
        { icon }
      </View>
    );
  }

  getRowStyle(selected){
   if(selected) {
     return [listViewStyles.listRow, listViewStyles.selectedListRow];
   }
   return listViewStyles.listRow;
  }

  isSelected(item, rowId, sectionId) {
    if(this.props.isSelected){
      return this.props.isSelected(item, rowId, sectionId);
    }
  }

  renderRow(item, sectionId, rowId) {
    const selected = this.isSelected(item, rowId);
    const rowStyle = this.getRowStyle(selected);
    const onPress = () => this.onPress(item, rowId);
    return (
      <TouchableHighlight
        onPress={ onPress }
        underlayColor={ colors.blue }
        activeOpacity={ 0.3 }
      >
        <View style={ rowStyle }>
          { this.renderIcon(item) }
          { this.renderDescription(item, selected) }
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const renderRow = this.props.renderRow || this.renderRow;
    const tall = { height: this.props.height * 0.7 };

    return (
      <View
        style={[listViewStyles.listViewWrapper, tall, this.props.wrapperStyle]}
      >
        <ListView
          style={listViewStyles.listViewRow}
          enableEmptySections
          dataSource={ this.props.dataSource }
          renderRow={ renderRow  }
          renderSeparator={this.renderSeperator}
        />
      </View>
    );
  }
}
