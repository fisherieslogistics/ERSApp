'use strict';
import {
  View,
  Text,
  AlertIOS,
  ListView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { connect } from 'react-redux';

import MasterDetail from '../layout/MasterDetail';
import {
  updateTrip,
  startTrip,
  endTrip,
  addSelectedHistoryTrip,
  emptySelectedHistoryTrips,
  setSelectedTripDetail,
} from '../../actions/TripActions';
import { setSelectedTab } from '../../actions/ViewActions';
import { setViewingEvent } from '../../actions/FishingEventActions';

import StartTripEditor from './StartTripEditor';
import TotalsList from './TotalsList';
//import ProfileEditor from '../User/ProfileEditor';
import ConnectionSettingsEditor from '../VMS/ConnectionSettingsEditor';
import TripsList from './TripsList';
import ports from '../../constants/ports';
import VesselSelect from '../VesselSelect';
import AsyncStorage from 'AsyncStorage';
import { colors, textStyles } from '../../styles/styles';
import { MasterToolbar } from '../layout/Toolbar';
import { BigButton } from '../common/Buttons';
import Label from '../common/Label';
import { TripHelper } from '../../models/TripModel';

const masterChoices = [
 'Trip',
 'Totals',
 'Profile',
// 'Connection Settings',
];

const icons = {
  Totals: 'fishing',
  Trip: 'fishing-boat-filled',
  Profile: 'user',
  //'Connection Settings': 'settings',
};

const padStyle = { padding: 5, flex: 1 };
const wrapStyles = {
  flex: 1,
  flexDirection: 'row',
  marginTop: 30,
}
const outerStyle = { padding: 0, margin: 0, flexDirection: 'column', flex: 1, alignItems: 'flex-start' };
const innerStyle = { padding: 0, margin: 0, flexDirection: 'row', height: 240 };
const midStyle = { alignItems: 'flex-start', marginTop: 25 };
const messageWrapperStyle  = { margin: 10 };
const messageTextStyle = { color: 'white', fontSize: 18 };

const productsHeader = [
  { code: 'Totals', amount: '', color: 'red'},
  { code: 'Species Code', amount: 'Total KG', color: 'orange' },
];
const discardsHeader = [
  { code: '', amount: '', color: 'green' },
  { code: 'Discards', amount: '', color: 'red' },
  { code: 'Species Code', amount: 'Total KG', color: 'orange' },
];



const dsTotals = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
const dsTrips = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });


class Trip extends MasterDetail {

  constructor (props){
    super(props);
    this.tripHelper = new TripHelper({});
    this.masterChoices = masterChoices;
    this.icons = icons;
    this.startTrip = this.startTrip.bind(this);
    this.endTrip = this.endTrip.bind(this);
    this.renderTripsList = this.renderTripsList.bind(this);
    this.renderTotalsListView = this.renderTotalsListView.bind(this);
    this.tripsListOnPress = this.tripsListOnPress.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  updateTrip(attribute, value){
    this.props.db.update(trip.id, {[attribute]: value });
  }

  componentWillReceiveProps(nextProps) {
    
    this.tripHelper = new TripHelper(nextProps.trip || {})
    
    if(this.props.selectedDetail !== nextProps.selectedDetail ||
       this.props.selectedTab !== nextProps.selectedTab) {
      this.props.dispatch(emptySelectedHistoryTrips());
    }
  }

  tripsListOnPress(trip){
    this.props.dispatch(addSelectedHistoryTrip(trip));
  }
  renderTotalsListView(){
    return (
      <View style={ wrapStyles }>
        <TotalsList
          dataSource={ this.props.totalsDataSource }
          isSelected={ this.isSelected }
        />
      </View>
    );
  }

  startTrip(){
    const title = `Please Confirm Correct`;
    const body = `
      Person in Charge:
      ${this.props.user.username}

      Vessel Name:
      ${this.props.vessel.name}

      Vessel Registration:
      ${this.props.vessel.registration}

      Leaving Port:
      ${this.props.trip.leavingPort}
    `;
    AlertIOS.alert(
      title,
      body,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {

          console.log(this.props.trip._id)
          this.props.db.update({ started: true }, this.props.trip._id);
          this.props.dispatch(setSelectedTab('fishing'));

        }},
      ]
    );
  }

  endTrip(){
    AlertIOS.alert(
      `Heading to ${this.props.trip.unloadPort}`,
      `Arriving in about ${this.props.trip.endDateMoment.fromNow(true)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {

          this.props.dispatch(endTrip(this.props.trip));
          this.props.dispatch(setViewingEvent(null));
        }},
      ]
    );
  }

  getMessages() {
    if (this.tripHelper.canStart) {
     return ["Ready to go press Start Trip"];
    }
    if (this.tripHelper.canEnd) {
      return ["Press End Trip when your heading in"];
    }
    /*const numUncompletedShots = [...this.props.trip.fishingEvents].filter(
      fe => !fe.completed).length;*/
    //if(!numUncompletedShots) {
      return ["Select ports and ETA before starting trip"];
    ///  }
    //return [
    //  "Trip Incomplete",
    //  `${numUncompletedShots} Shots to commit`,
    //];
  }

  renderMessage(){
    const wrapStyle = { padding: 15 };
    const textStyle = [textStyles.light, { fontSize: 23 }];
    const msgs = this.getMessages().map(m => (
      <Text style={textStyle} key={m}>
        {m}
      </Text>
    ));
    return (
      <View style={wrapStyle}>
        { msgs }
      </View>
    )
  }

  renderTripsList() {
    const wrapStyle = { height: 500 };
    return (
      <TripsList
        selectedTrips={ this.props.selectedHistoryTrips }
        wrapperStyle={ wrapStyle }
        onPress={ this.tripsListOnPress }
        dataSource={ this.props.tripsDataSource }
      />
    );
  }

  renderLowerList() {
    switch (this.props.selectedDetail) {
      case 'Trip':
        return this.renderMessage();
      case 'Totals':
        return this.renderTripsList();
      default:
        break;
    }
  }

  getDescription() {
    return this.props.selectedDetail;
  }

  isSelected(item) {
    return this.props.selectedDetail === item;
  }

  renderMasterView() {
    if(!this.userReady()) {
      return (
        <View style={ messageWrapperStyle }>
          <View>
            <Text style={ messageTextStyle }>
              { "First Enter Your Details "}
            </Text>
          </View>
        </View>
      );
    }
    const lowerStyle = Object.assign({}, innerStyle, midStyle, { flex: 1, height: 400 });
    return (
      <View style={ outerStyle }>
        <View style={ innerStyle }>
         { /*this.renderMasterListView()*/ }
        </View>
        {/*<View style={ lowerStyle }>
          { this.renderLowerList() }
        </View>*/}
      </View>
    );
  }

  userReady() {
    const { user } = this.props;
    const { user_id, username, email } = user;
    return user_id && username && email;
  }

  onMasterButtonPress() {
    if(this.tripHelper.canStart) {
      return this.startTrip();
    } else if(this.tripHelper.canEnd) {
      return this.endTrip();
    } else {
      AsyncStorage.removeItem('refreshToken', () => {})
    }
  }

  renderMasterToolbar() {
    let backgroundColor = colors.backgrounds.dark;
    let text = "FLL";
    let textColor = 'rgba(255, 255, 255, 0.2)';
    if(this.tripHelper.canStart) {
      backgroundColor = colors.green;
      textColor = colors.white;
      text = "Start Trip";
    }
    if(this.tripHelper.canEnd) {
      backgroundColor = colors.red;
      textColor = colors.white;
    }
    if(this.props.trip.started){
      text = "End Trip";
    }

    const button = (
      <BigButton
        text={ text }
        backgroundColor={ backgroundColor }
        textColor={ textColor }
        onPress={ this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

  masterListOnPress(choice) {
    this.props.dispatch(setSelectedTripDetail(choice));
  }

  getDetail() {
    const { vessel, user, trip, ports } = this.props;
    //if(!(vessel && vessel.id)) {
      /*return (
        <VesselSelect
          dispatch={this.props.dispatch}
        />
      );*/
    //}
    const detail = this.props.selectedDetail;
    switch (detail) {
      case 'Trip':
        const ves = `${vessel.name} ${vessel.registration}`;
        const use = `${user.username} ${user.email}`
        return (
          <KeyboardAwareScrollView
            viewIsInsideTabBar
            extraHeight={ 150 }
            bouncesZoom={false}
            alwaysBounceVertical={false}
          >
            <StartTripEditor
              ports={this.props.ports}
              trip={this.props.trip}
              db={this.props.db}
            />
            <Label value={`${this.props.user.username} ${this.props.user.email}`} />
            <Label value={`${this.props.vessel.name} ${this.props.vessel.registration}`} />
          </KeyboardAwareScrollView>
        );

      case 'Totals':
        return this.renderTotalsListView();
      /*case 'Profile':
        return (
          <ProfileEditor
            user={this.props.user}
            vessel={this.props.vessel}
            dispatch={this.props.dispatch}
          />
        );*/
      /*case 'Connection Settings':
        return (
          <ConnectionSettingsEditor
            connectionSettings={this.props.connectionSettings}
            dispatch={this.props.dispatch}
          />
        );*/
    }
  }

  renderDetailView() {
    if(!this.userReady()) {
      return (
        <View style={ messageWrapperStyle }>
          <View>
            <Text style={ messageTextStyle }>
              { "First Enter Your Details "}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={ padStyle }>
        { this.getDetail() }
      </View>
    );
  }

}

const select = (state) => {
  const t = state.trip.currentTrip;
  
  return {
    tripUpdated: state.trip.lastUpdated,
    view: state.view,
    trip: state.trip.currentTrip,
    vessel: state.vessel.selected,
    user: state.user.user,
    fishingEvents: state.fishingEvents,
    historyTrips: [],
    selectedHistoryTrips: [],
    totalsDataSource: dsTotals.cloneWithRows([]),
    tripsDataSource: dsTrips.cloneWithRows([]),
    selectedDetail: state.trip.selectedDetail,
    selectedTab: state.view.selectedTab,
    ports: state.ports.all,
    db: state.database.db,
  };
}

export default connect(select)(Trip);
