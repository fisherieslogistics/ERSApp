'use strict';
import {
  View,
  TabBarIOS,
  Text,
  AlertIOS,
} from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fishing from '../components/Fishing/Fishing';
//import FormView from '../components/Forms/FormView';
import Trip from '../components/Trip/Trip';
//import Chat from '../components/Chat/Chat';
import SuggestBar from '../components/common/SuggestBar';
import Orientation from 'react-native-orientation';
import { startTracking } from '../actions/LocationActions';
import { setSelectedTab } from '../actions/ViewActions';
import Icon8 from '../components/common/Icon8';


const styles = {
  wrapper: {
    left: 0,
    top: 0
  },
  toEdges:{
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  fill:{
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1
  },
  detailView: {
    padding: 0,
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  hitSlop: {
    top: 20, left: 20, bottom: 20, right: 20
  },
  tab: {
    flex: 0.1
  },
  tabBar: {
    flex: 1,
  },
  connectionStatus: {
    right: 150,
    top: 1,
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  connectionText: {
    color: 'white',
  }
};

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.orientationDidChange = this.orientationDidChange.bind(this);
    this.renderTrip = this.renderTrip.bind(this);
    this.renderFishing = this.renderFishing.bind(this);
    this.renderForms = this.renderForms.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    //this.setupForms = this.setupForms.bind(this);
    this.setTab = this.setTab.bind(this);
    this.tabs = {
      trip: { render: this.renderTrip, icon: 'fishing-boat', selectedIcon: 'fishing-boat-filled', onPress: () => this.setTab('trip') },
      fishing: { render: this.renderFishing, icon: 'fishing', selectedIcon: 'fishing-filled', onPress: () => this.setTab('fishing') },
      //forms: { render: this.renderForms, icon: 'form', selectedIcon: 'form-filled', onPress: () => this.setTab('forms') },
      //chat: { render: this.renderChat, icon: 'user-filled', selectedIcon: 'user-filled', onPress: () => this.setTab('chat') },*/
    };
  }

  setTab(tab) {
    if(this.props.trip.values().active) {
      this.props.dispatch(setSelectedTab(tab));
    } else {
      AlertIOS.alert("start trip first");
    }
  }

  orientationDidChange(orientation) {
    this.props.dispatch({ type: 'orientation', payload: {
      orientation}});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this.orientationDidChange);
    this.props.dispatch({ type: 'orientation', payload: {
      orientation: Orientation.getInitialOrientation(),
    }});
    this.props.dispatch(startTracking());
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  renderTabs(){
    return Object.keys(this.tabs).map(
      (tab) => (
        <Icon8.TabBarItemIOS
          key={ tab }
          title={ tab.capitalize() }
          selected={ this.props.selectedTab === tab }
          iconName={ this.tabs[tab].icon }
          selectedIconName={ this.tabs[tab].selectedIcon }
          hitSlop={ styles.hitSlop }
          style={ styles.tab }
          onPress={this.tabs[tab].onPress}
        >
          <View style={[styles.col, styles.fill]}>
           { this.props.renderErrors() }
           { this.tabs[tab].render() }
          </View>
      </Icon8.TabBarItemIOS>)
    );
  }

  renderTrip(){
    return (<Trip />);
  }

  renderForms(){
    /*return (
      <FormView />
    );*/
  }

  renderFishing(){
    return (
      <Fishing
        position={this.props.position}
      />
    );
  }

  renderChat() {
    /*return (
      <Chat />
    )*/
  }

  renderSuggestBar() {
    if(!this.props.suggestBarVisible) {
      return null;
    }
    return (
      <SuggestBar
        width={ this.props.width }
        height={ this.props.height }
        dispatch={ this.props.dispatch }
      />
    );
  }

  render(){
    const wrapStyles = [styles.wrapper, {width: this.props.width, height: this.props.height}];
    return (
      <View style={wrapStyles}>
        <TabBarIOS
          unselectedTintColor="#bbbbbb"
          tintColor="#007aff"
          barTintColor="#000"
          style={ styles.tabBar }
        >
          { this.renderTabs() }
        </TabBarIOS>
          { this.renderSuggestBar() }
      </View>
    );
  }
}

const select = (state) => {
  const { view, connection } = state;
  return {
    lastUpdated: view.lastUpdated,
    trip: state.trip.currentTrip,
    orientation: view.orientation,
    height: view.height,
    width: view.width,
    fishingEvents: state.fishingEvents.fishingEvents,
    viewingForm: view.viewingForm,
    showFormsHistory: view.isShowingHistory,
    suggestBarVisible: view.suggestBarVisible,
    selectedTab: view.selectedTab,
  };
}

export default connect(select)(ReportingApp)
