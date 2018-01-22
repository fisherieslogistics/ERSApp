'use strict';
import {
  View,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import React from 'react';
import Sexagesimal from 'sexagesimal';
import {textStyles, colors} from '../../styles/styles';

const viewStyle = {flex: 1, marginBottom: 20, marginLeft: 4, height: 50, marginTop: 0};
const textStyle = [textStyles.font, {fontSize: 20, color: colors.blue}];

class PositionDisplay extends React.Component{

  constructor(props) {
    super(props);
    this.getPositionText = this.getPositionText.bind(this);
    this.getSpeedText = this.getSpeedText.bind(this);
  }

  getPositionText() {
    const loc = this.props.location;
    if(!(loc.lat && loc.lat)){
      return 'No Location';
    }
    const posText = `${Sexagesimal.format(loc.lat, 'lat')}\n${Sexagesimal.format(loc.lon, 'lon')}`;
    const speedText = this.getSpeedText();
    return `${posText}\n${speedText}`;
  }

  getSpeedText(){
    if(!this.props.location.speed) {
      return '';
    }
    return `${this.props.location.speed.toFixed(1)} kts`;
  }

  render() {
    return (
      <View style={viewStyle}>
          <Text style={textStyle}>
            {this.getPositionText()}
          </Text>
      </View>
    );
  }
}


const select = (state) => ({
  location: state.location,
});

export default connect(select)(PositionDisplay);
