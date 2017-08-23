'use strict';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';

import React, { Component } from 'react';
import FormContainer from '../common/ModalEditor';
import CoordinateEditor from './CoordinateEditor';
import { TextButton } from '../common/Buttons';
import { colors } from '../../styles/styles';

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    backgroundColor: colors.black
  },
  doneButton: {
    alignSelf: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 25,
    marginTop: 10,
  },
});


export default class ModalLocationForm extends Component {

  render(){
    if(! this.props.visible){
      return null;
    }

    const inputs = (
      <View style={[ styles.formWrapper ]}>
        <CoordinateEditor
          coordType={'lat'}
          location={ this.props.value }
          attribute={ this.props.attribute }
          onChange={ this.props.onChange }
          fishingEvent={ this.props.fishingEvent }
        />
        <CoordinateEditor
          coordType={'lon'}
          location={ this.props.value }
          attribute={ this.props.attribute }
          onChange={ this.props.onChange }
          fishingEvent={ this.props.fishingEvent }
        />
      </View>
    );
    const controls = (
      <View style={ styles.doneButton }>
        <TextButton text={ 'Done' }
                    color={ colors.blue }
                    style={ styles.button }
                    onPress={ this.props.onRequestClose }
         />
      </View>
    );
    const form = (
      <FormContainer
        inputs={ inputs }
        controls={ controls }
      />
    );
    return (
      <Modal
        animationType={ 'fade' }
        transparent
        visible
        onRequestClose={ this.props.onRequestClose }
      >
        { form }
      </Modal>
    );
  }
}
