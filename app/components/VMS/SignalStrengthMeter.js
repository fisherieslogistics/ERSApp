import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const textStyle = {
  color: '#00e0ff',
  fontSize: 11,
  top: -27,
  left: 10,
  width: 22,
};

class SignalStrengthMeter extends Component {

  constructor(props) {
    super(props);
    this.getSignalStrength = this.getSignalStrength.bind(this);
    this.getSignalStrengthDesc = this.getSignalStrengthDesc.bind(this);
  }

  getSignalStrengthPercentage() {
    const strength = this.getSignalStrength();
    if(strength < -90){
      return 0;
    }
    if(strength > -30) {
      return 100;
    }

  }

  getSignalStrength() {
    return parseInt(this.props.signalStrength) || -90;
  }

  getSignalStrengthDesc() {
    const strengths = {
      30: "Amazing Max achievable signal strength.",
      67: "Very Good Minimum signal strength for applications that require very reliable, timely delivery of data packets.",
      70: "Okay Minimum signal strength for reliable packet delivery.",
      80: "Not Good Minimum signal strength for basic connectivity. Packet delivery may be unreliable.",
      90: "Unusable Approaching or drowning in the noise floor. Any functionality is highly unlikely.",
    };
    const strengthNum = Math.abs(this.getSignalStrength());
    let desc = strengths[90];
    Object.keys(strengths).sort().forEach((k) => {
      if(strengthNum < strengths[k]) {
        desc = strengths[k];
      }
    });
    return desc;
  }

  renderDescription() {
    return (
      <View>
        <Text>
          { this.getSignalStrengthDesc() }
        </Text>
      </View>
    )
  }

  renderSignalStrength() {
    return (
      <View>
        <Text style={textStyle}>
          { this.props.signalStrength }
        </Text>
      </View>
    );
  }

  render() {
    return (
      <AnimatedCircularProgress
        size={ 40 }
        width={3}
        fill={ this.getSignalStrength() }
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {
          (fill) => this.renderSignalStrength
        }
      </AnimatedCircularProgress>
    );
  }

}

const select = (state) => {
  
  return {
    signalStrength: state.connection.signalStrength,
  }
}

export default connect(select)(SignalStrengthMeter);
