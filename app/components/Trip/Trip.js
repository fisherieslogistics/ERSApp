'use strict';
import {
  View,
  Text,
  AlertIOS,
} from 'react-native';
import { ListView } from 'realm/react-native';

import React from 'react';
import { connect } from 'react-redux';

import RealmMasterDetail from '../layout/RealmMasterDetail';
import {
  updateTrip,
  startTrip,
  endTrip,
  addSelectedHistoryTrip,
  emptySelectedHistoryTrips,
  setSelectedTripDetail,
} from '../../actions/TripActions';
import { createTrip } from '../../api/RestApi';
import { setSelectedTab, setViewingEventId } from '../../actions/ViewActions';
import StartTripEditor from './StartTripEditor';
import TotalsList from './TotalsList';
//import ProfileEditor from '../User/ProfileEditor';
import ConnectionSettingsEditor from '../VMS/ConnectionSettingsEditor';
import TripsList from './TripsList';
import ports from '../../constants/ports';
import VesselSelect from '../VesselSelect';
import {
  getRecords,
  queryRecord,
  getLastRecord,
} from '../../database/RealmHelper';
import AsyncStorage from 'AsyncStorage';
import RealmHelper from '../../database/RealmHelper';

import { colors, textStyles } from '../../styles/styles';
import { MasterToolbar } from '../layout/Toolbar';
import { BigButton } from '../common/Buttons';

const portDB = new RealmHelper('port');

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


class Trip extends RealmMasterDetail {

  constructor (props){
    super(props);
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
    this.props.dispatch(updateTrip(attribute, value, this.props.trip.RAId));
  }

  componentWillReceiveProps(nextProps) {
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
          createTrip(this.props.trip).then(res => {
            if(!res.body && res.body.id) {
              AlertIOS.alert('please try that again when you are online');
              return;
            }
            console.log("RESPONSE TRIPID", res.body.id);
            this.props.dispatch(startTrip(this.props.trip, res.body.id));
            this.props.dispatch(setSelectedTab('fishing'));
          }).catch(err => {
            AlertIOS.alert('please try that again');
          });
        }},
      ]
    );
  }

  endTrip(){
    AlertIOS.alert(
      `Heading to ${this.props.trip.endPort}`,
      `Arriving in about ${this.props.trip.endDateMoment.fromNow(true)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => {

          this.props.dispatch(endTrip(this.props.trip));
          this.props.dispatch(setViewingEventId(null));
        }},
      ]
    );
  }

  getMessages() {
    if (this.props.trip.canStart) {
     return ["Ready to go press Start Trip"];
    }
    if (this.props.trip.canEnd) {
      return ["Press End Trip when your heading in"];
    }
    const numUncompletedShots = [...this.props.trip.fishingEvents].filter(
      fe => !fe.completed).length;
    if(!numUncompletedShots) {
      return ["Select ports and ETA before starting trip"];
    }
    return [
      "Trip Incomplete",
      `${numUncompletedShots} Shots to commit`,
    ];
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
         { this.renderMasterListView() }
        </View>
        <View style={ lowerStyle }>
          { this.renderLowerList() }
        </View>
      </View>
    );
  }

  userReady() {
    const { user } = this.props;
    /*const { id, username, organisation, email } = user;
    return  id && username && organisation && email;*/
    return true;
  }

  onMasterButtonPress() {
    if(this.props.trip.canStart) {
      return this.startTrip();
    } else if(this.props.trip.canEnd) {
      return this.endTrip();
    } else {
      AsyncStorage.removeItem('refreshToken', () => {})
    }
  }

  renderMasterToolbar() {
    let backgroundColor = colors.backgrounds.dark;
    let text = "FLL";
    let textColor = 'rgba(255, 255, 255, 0.2)';
    if(this.props.trip.canStart) {
      backgroundColor = colors.green;
      textColor = colors.white;
      text = "Start Trip";
    }
    if(this.props.trip.canEnd) {
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
    if(!this.props.vessel && this.props.vessel.serverID) {
      return (
        <VesselSelect
          auth={this.props.auth}
          dispatch={this.props.dispatch}
        />
      );
    }
    const detail = this.props.selectedDetail;
    switch (detail) {
      case 'Trip':
        return (
          <StartTripEditor
            ports={this.props.ports}
            trip={this.props.trip}
            dispatch={this.props.dispatch}
          />
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
      case 'Connection Settings':
        return (
          <ConnectionSettingsEditor
            connectionSettings={this.props.connectionSettings}
            dispatch={this.props.dispatch}
          />
        );
    }
  }

  renderDetailView() {
    return (
      <View style={ padStyle }>
        { this.getDetail() }
      </View>
    );
  }

}

const select = (state) => {
  const trip = getLastRecord('trip');
  const trips = getRecords('trip');
  const products = state.trip.totals.products;
  const discards = state.trip.totals.discards;
  const totals = [...productsHeader, ...products, ...discardsHeader, ...discards];
  return {
    tripUpdated: state.trip.lastUpdated,
    view: state.view,
    trip,
    vessel: getLastRecord('vessel'),
    user: getLastRecord('user'),
    fishingEvents: trip.fishingEvents,
    historyTrips: trips,
    selectedHistoryTrips: state.trip.selectedHistoryTrips,
    totalsDataSource: dsTotals.cloneWithRows(totals),
    tripsDataSource: dsTrips.cloneWithRows(trips),
    selectedDetail: state.trip.selectedDetail,
    selectedTab: state.view.selectedTab,
    connectionSettings: queryRecord(
      'connectionSettings', 'active = true').slice(0),
    ports: portDB.findAll().map(p => ({ value: p.name, description: "" })),
    auth: state.auth.auth,
  };
}

export default connect(select)(Trip);
