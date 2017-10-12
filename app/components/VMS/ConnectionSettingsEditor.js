
import React, {
  Component
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModelEditor from '../common/ModelEditor';
import ConnectionSettingsModel from '../../models/ConnectionSettingsModel';
import { updateConnectionSettings, setConnectionSettings, startConnection, startTracking } from '../../actions/ConnectionActions';

//TODO -- loads of shit here to make it look really cool

const stages = [
  { text: '',          fill: null },
  { text: 'TCP',       fill: 10 },
  { text: 'GPS',       fill: 45 },
  { text: 'Listening', fill: 85 },
  { text: 'Done',      fill: 100 },
];

const style = {
  wrapper: {
    flex: 1, flexDirection: 'column', justifyContent: 'flex-start', height: 800
  },
  textStyle: {
    color: "#00e0ff",
    textAlign: 'center',
  },
  textWrap: {
    bottom: 110,
    left: 50,
    width: 100,
  },
  imgStyle: {
    width: 120,
    height: 120,
    margin: 25,
    backgroundColor: 'white',
  },
  brandTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
  disabledTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
  vmsTextWrap: {
    backgroundColor: '#000',
    opacity: 0.6,
    height: 20,
    top: 100,
    width: 120,
  },
  disabledCover: {
    backgroundColor: '#000',
    opacity: 0.7,
    height: 120,
    paddingTop: 100,
    width: 120,
  },
  wrapStlye: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
};

class ConnectionsSettingsEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auto: true,
      stage: 0,
    }
    this.getEditorProps = this.getEditorProps.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setNavicom = this.setNavicom.bind(this);
    this.setSierra = this.setSierra.bind(this);
    this.setiOs = this.setiOs.bind(this);
  }

  onChange(inputId, value) {
    this.props.dispatch(updateConnectionSettings(inputId, value));
  }

  changeConnection(name) {
    this.props.dispatch(setConnectionSettings(name));
    this.props.dispatch(startConnection());
    this.props.dispatch(startTracking());
  }

  setNavicom() {
    //this.changeConnection('navicom');
  }

  setSierra() {
    //this.changeConnection('sierra');
  }

  setiOs() {
    //this.changeConnection('ios');
  }

  getUserEditorProps(attribute){
   return this.getEditorProps(attribute, this.props.user);
  }

  getEditorProps(attribute, values) {
    return {
      values: values[attribute.id],
      attribute,
      extraProps: {},
      inputId: attribute.id + "__connection_settings__",
    }
  }

  renderManualSettings() {
    const styleGap = {
      marginTop: 20,
      flex: 1,
    }
    return (
        <View style={styleGap}>
          <ModelEditor
            getEditorProps={ this.getEditorProps }
            model={ ConnectionSettingsModel }
            modelValues={ this.props.connectionSettings }
            index={1}
            onChange={ this.onChange }
          />
      </View>
    );
  }

  renderAutoSettings() {
    const stage = stages[this.state.stage];

    return (
      <View style={style.wrapper}>
        <View style={style.wrapStlye}>
              <TouchableOpacity
                onPress={ this.setNavicom }
              >
                <Image
                  source={ require('./images/navi.jpg') }
                  style={style.imgStyle}
                  resizeMode={'contain'}
                >
                  <View style={style.disabledCover}>
                    <Text style={style.disabledTextStyle}>
                      Navicom NDS01
                    </Text>
                  </View>
                </Image>
              </TouchableOpacity>
            <TouchableOpacity
              onPress={ this.setSierra }
            >
              <Image
                source={ require('./images/SIERRA.png') }
                style={style.imgStyle}
                resizeMode={'contain'}
                onPress={ this.setSierra }
                >
                  <View style={style.disabledCover}>
                    <Text style={style.disabledTextStyle}>
                      Airlink MP70
                    </Text>
                  </View>
                </Image>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={ this.setiOs }
            >
              <Image
                source={ require('./images/applelogo.png') }
                style={style.imgStyle}
                resizeMode={'contain'}
                onPress={ this.setiOs }
                >
                  <View style={ style.vmsTextWrap}>
                    <Text style={style.brandTextStyle}>
                      iOS
                    </Text>
                  </View>
                </Image>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 140 }
        bouncesZoom={false}
        alwaysBounceVertical={false}
      >
        {this.renderAutoSettings()}
      </KeyboardAwareScrollView>
    );
  }
}

const select = (state) => {
  const { connection, location } = state;
  return {
    connectionSettings: connection.connectionSettings,
    position: location.latest,
  };
}

export default connect(select)(ConnectionsSettingsEditor);
