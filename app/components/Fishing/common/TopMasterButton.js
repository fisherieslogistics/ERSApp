'use strict';
import React, { Component } from 'react';
import FORM_TYPE from '../../../constants/MPIFormType';
import ShootButton from './ShootButton';
import HaulButton from './HaulButton';

export default class TopMasterButton extends Component {

  render() {
    switch (FORM_TYPE) {
      case 'TrawlEvent':
      case 'HandGatheringEvent':
        if(this.props.canEndEvent) {
          return (<HaulButton />);
        }
        return (<ShootButton />);
      case 'LCER':
        return (<ShootButton />);
    }
  }

}
