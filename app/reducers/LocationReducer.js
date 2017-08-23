import Helper from '../utils/Helper';

const initialState = {
  lat: null,
  lon: null,
  time: null,
  sentence: "",
  fix: null,
  satellites: 0,
  speed: 0,
  timestamp: null,
  averagedSpeed: {
    currentAvg: 0,
    intervals: 0,
    total: 0,
  },
};

const update = (obj, change) => Object.assign({}, obj, change)

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'GPSLocationUpdate':
      if(!payload.date) {
        return update(state, payload);
      }
      const time = Helper.NMEATimeToMoment(payload.time).toDate();
      return update(state, update(payload, { time }));
    case 'GPSpeedUpdate':
      const { averagedSpeed } = state;
      if(isNaN(payload.speed)) {
        return state;
      }
      const total = averagedSpeed.total + payload.speed;
      const intervals = averagedSpeed.intervals + 1;
      return update(state, {
        speed: payload.speed,
        averagedSpeed: {
          total,
          intervals,
          currentAvg: total / intervals,
        }
      });
    case 'startFishingEvent':
      return update(state, { averagedSpeed: initialState.averagedSpeed });
    default:
      return state;
  }
};
