import moment from 'moment';
import { GPGGAUpdate, GPVTGUpdate, VMSLocationUpdate, VMSSpeedUpdate } from '../../actions/LocationActions';


export default class locationHandler {

  constructor() {
    this.VMSLocationUpdatedAt = moment();
    this.VMSSpeedUpdatedAt = moment();
    this.handleSentence = this.handleSentence.bind(this);
    this.setDispatch = this.setDispatch.bind(this);
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch;
  }

  handleGGASentence(sentence) {

    this.dispatch(GPGGAUpdate(sentence));
    if(moment.duration(moment().diff(this.VMSLocationUpdatedAt)).minutes() >= 2) {
      this.dispatch(VMSLocationUpdate(sentence));
      this.VMSLocationUpdatedAt = moment();
    }
  }

  handleVTGSentence(sentence) {
    this.dispatch(GPVTGUpdate(sentence));
    if(moment.duration(moment().diff(this.VMSSpeedUpdatedAt)).minutes() >= 5) {
      this.dispatch(VMSSpeedUpdate(sentence));
      this.VMSSpeedUpdatedAt = moment();
    }
  }

  handleSentence(sentence) {
    if(!sentence) {
      return;
    }
    if(!this.dispatch) {
      return;
    }
    if(sentence.includes('$GPGGA')) {
      this.handleGGASentence(sentence);
    }
    if(sentence.includes('$GPVTG')) {
      this.handleVTGSentence(sentence);
    }
  }

  setNullLocation() {
    if(!this.dispatch) {
      return;
    }
    this.dispatch(GPGGAUpdate(null));
    this.dispatch(GPVTGUpdate(null));
  }

}
