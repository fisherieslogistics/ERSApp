'use strict';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import React from 'react';
import { inputStyles } from '../../styles/styles';
import Sexagesimal from 'sexagesimal';
import ModalLocationForm from './ModalLocationForm';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
  },
  touchAbleStyle: { height: 22 },
  textStyles: Object.assign({}, inputStyles.textInput, { marginTop: 2 }),
});

export default class LocationEditor extends React.Component {

  constructor(props){
    super(props);
    this.makeVisible = this.makeVisible.bind(this);
    this.makeInVisible = this.makeInvisible.bind(this);
    this.state = {
      modalVisible: false
    }
  }

  validLocation() {
    return this.props.value && parseFloat(this.props.value.lat) && parseFloat(this.props.value.lon);
  }

  makeVisible() {
    this.setState({modalVisible: true});
  }

  makeInvisible() {
    this.setState({modalVisible: false});
  }

  renderLocation(){
    const renderedLoc = `${Sexagesimal.format(this.props.value.lat, 'lat')}  -  ${Sexagesimal.format(this.props.value.lon, 'lon')}`;
    const posText = this.validLocation() ? renderedLoc : 'Touch To Set Location';
    return (
      <View style={ styles.wrapper }>
        <TouchableOpacity
          onPress={ this.makeVisible }
          style={ styles.touchAbleStyle }
        >
        <Text style={ styles.textStyles }>
            { posText }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(){
    return (
      <View>
        { this.state.modalVisible ? null : this.renderLocation() }
        <ModalLocationForm
          visible={ this.state.modalVisible }
          onRequestClose={ this.makeInVisible  }
          location={ this.props.value }
          { ...this.props }
        />
      </View>
    );
  }
}
