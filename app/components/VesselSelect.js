import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { setSelectedTripDetail } from '../actions/TripActions';


const style = {
  box: {
    height: 50,
    backgroundColor: 'white',
  },
  titleBox: {
    backgroundColor: 'transparent',
    height: 40,
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 5,
    paddingTop: 15,
    paddingLeft: 15,
  },
  wrapperOuter: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
  titleText: {
    color: 'green',
  }
}

export default class VesselSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vessels: [],
    };
    this.onSelectVessel = this.onSelectVessel.bind(this);
    this.renderChoice = this.renderChoice.bind(this);
  }

  onSelectVessel(vessel) {
    const newVessel = {
      RAId: vessel.id,
      name: vessel.name,
      registration: '',
      vessel_id: vessel.id,
    }
    vesselDB.create(newVessel);
    const _vessel = getFirstRecord('vessel');
    this.props.dispatch({
      type: 'setVessel',
      payload: {
        vessel_id: _vessel.vessel_id,
        DeviceId: _vessel.vessel_id,
      },
    });
    this.props.dispatch(setSelectedTripDetail('Trip'));
  }

  getVessels() {
    /*const vessel = getFirstRecord('vessel');
    if(vessel) {
      return Promise.resolve([vessel]);
    }
    return new Promise(
      (resolve, reject) => getVessels(this.props.auth.token.idToken).then(
        ({body}) => {
          resolve(body.data.viewer.vessels)
        }).catch(() => {
          resolve([{name: 'yim', id: 'opo'}]);
        }));*/
  }

  componentDidMount() {
    this.getVessels().then(vessels => {
      this.setState({
        vessels,
      });
    });
  }

  renderChoice(choice) {
    const onPress = () => this.onSelectVessel(choice);
    return (
      <TouchableOpacity
        key={ choice.id }
        onPress={ onPress }
        style={ style.wrapper }
      >
        <View style={[style.box]}>
          <Text style={ style.text }>
            {choice.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const choices = this.state.vessels.map(this.renderChoice);
    return (
      <View style={style.wrapperOuter}>
        <View style={[style.box, style.titleBox]}>
          <Text style={ [style.text, style.titleText] }>
            {'Choose Your Vessel'}
          </Text>
        </View>
        { choices }
      </View>
    );
  }

}
