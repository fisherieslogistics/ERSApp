import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { inputStyles } from '../../styles/styles';

export default class LocationEditor extends Component {

  onPressLabel = () => {
    console.log(this.props.fishingEvent);
  }

  render() {
    const { style, value } = this.props;
    if(!value) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.onPressLabel}>
        <View style={{ width: 330, height: 30 }}>
          <Text style={inputStyles.textInput }>
            {`lat: ${value.lat.toFixed(4).toString()}  lon: ${value.lon.toFixed(4).toString()}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
