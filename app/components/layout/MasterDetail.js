'use strict';
import {
  View,
} from 'react-native';
import React, { Component } from 'react';
import { ListView } from 'react-native';
import MasterListView from '../../components/common/MasterListView';
import { MasterToolbar, DetailToolbar } from './Toolbar';
import {shadowStyles, colors, iconStyles, masterDetailStyles } from '../../styles/styles';
import { BigButton } from '../../components/common/Buttons';
import Icon8 from '../../components/common/Icon8';


const styles = {
  outerStyle: {
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  innerStyle: {
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    flex: 0.85,
  },
  bottomStyle: {
    flex: 0.15,
  },
  midStyle: {
    alignItems: 'flex-start',
    marginTop: 25,
  },
}

const masterChoices = ['a', 'b', 'c'];
const icons = {
    a: 'user',
    b: 'fishing',
    c: 'fishing-boat-filled',
};


class MasterDetail extends Component {

  constructor(props){
    super(props);
    this.onMasterButtonPress = this.onMasterButtonPress.bind(this);
    this.renderMasterListView = this.renderMasterListView.bind(this);
    this.getDescription = this.getDescription.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.masterListOnPress = this.masterListOnPress.bind(this);
    this.renderMasterIcon = this.renderMasterIcon.bind(this);
    this.renderDetailView = this.renderDetailView.bind(this);
    this.renderMasterToolbar = this.renderMasterToolbar.bind(this);
    this.renderDetailToolbar = this.renderDetailToolbar.bind(this);
    this.dsDetail = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.masterChoices = masterChoices;
    this.icons = icons;
    this.state = {
      selectedDetail: 'a',
    }
  }

  isSelected(choice) {
    return choice === this.state.selectedDetail;
  }

  getDescription(choice) {
    return choice;
  }

  renderMasterIcon(choice){
    const isSelected = this.isSelected(choice);
    const iconName = this.icons[choice];
    let backgroundStyle = { backgroundColor: colors.blue, color: colors.white, left: -50 };
    if(isSelected){
      backgroundStyle = { backgroundColor: colors.white, color: colors.blue, left: -50 };
    }
    return (
      <Icon8
        name={iconName}
        size={30}
        color={"white"}
        style={[ iconStyles, backgroundStyle ]}
      />
    );
  }

  masterListOnPress(choice) {
    this.setState({
      selectedDetail: choice,
    });
  }

  renderDetailView(){
    return (<View />);
  }

  renderMasterListView() {
    return (
      <MasterListView
        getDescription={ this.getDescription }
        isSelected={ this.isSelected }
        onPress={ this.masterListOnPress }
        dataSource={ this.dsDetail.cloneWithRows(this.props.masterChoices || this.masterChoices) }
        getIcon={ this.renderMasterIcon }
      />
    );
  }

  renderMasterView(){
    const masterListView = this.renderMasterListView();
    const bottomView = this.renderBottomMasterView();
    return (
      <View style={[masterDetailStyles.outerStyle]}>
        <View style={[styles.innerStyle]}>
          { masterListView }
        </View>
        <View style={[styles.innerStyle, styles.bottomStyle]}>
          { bottomView }
        </View>
     </View>
    );
  }

  onMasterButtonPress() {

  }

  renderBottomMasterView() {
    return null;
  }

  renderMasterToolbar(text, backgroundColor, textColor) {
    const eventButton = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={eventButton}
      />
    );
  }

  renderDetailToolbar(){
    return (<DetailToolbar />);
  }

  getMasterDetailProps(){
    return {
      detail: this.renderDetailView(),
      master: this.renderMasterView(),
      detailToolbar: this.renderDetailToolbar(),
      masterToolbar: this.renderMasterToolbar(),
    }
  }

  render() {
    const { detail, master, masterToolbar, detailToolbar } = this.getMasterDetailProps();
    return (
      <View style={[masterDetailStyles.wrapper]}>
        <View style={[masterDetailStyles.row]}>
          <View style={[masterDetailStyles.master, shadowStyles.shadowRight]}>
            <View>
              { masterToolbar }
            </View>
            <View style={[masterDetailStyles.col,masterDetailStyles.bgtop]}>
              { master }
            </View>
          </View>
          <View style={[masterDetailStyles.detail]}>
            <View style={[shadowStyles.shadowDown, masterDetailStyles.bgleft]}>
              { detailToolbar }
            </View>
            <View style={[masterDetailStyles.col, masterDetailStyles.detail]}>
              { detail }
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default MasterDetail
