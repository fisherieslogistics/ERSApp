import Sexagesimal from 'sexagesimal';
import moment from 'moment';


const locationToWKTPoint = (location) => {
  const { lon, lat } = location;
  return 'POINT ({o} {a})'.replace('{o}', lon).replace('{a}', lat);
}

export default {

  getDegreesMinutesFromLocation: (location) => {
    const lat = Sexagesimal.format(location.lat, 'lat').split(" ");
    const lon = Sexagesimal.format(location.lon, 'lon').split(" ");
    let ew = "East";
    let ns = "North";
    if(location.lat <= 0){
      ns = "South";
    }
    if(location.lon < 0){
      ew = "West";
    }
    return {
      latDegrees: parseInt(lat[0].replace(/\D/g,'')),
      latMinutes: lat.length >= 3 ? parseInt(lat[1].replace(/\D/g,'')) : 0,
      latSeconds: lat.length >= 4 ? parseInt(lat[2].replace(/\D/g,'')) : 0,
      lonDegrees: parseInt(lon[0].replace(/\D/g,'')),
      lonMinutes: lon.length >= 3 ? parseInt(lon[1].replace(/\D/g,'')) : 0,
      lonSeconds: lon.length >= 4 ? parseInt(lon[2].replace(/\D/g,'')) : 0,
      ew,
      ns
    };
  },

  NMEATimeToMoment: (time) => {
    const datetime = moment();
    datetime.minutes(parseInt(time.slice(2, 4)));
    datetime.seconds(parseInt(time.slice(4, 6)));
    datetime.hours(parseInt(time.slice(0, 2)));
    return datetime;
  },

  parseLocation: (degMin, lonHemisphere, latHemisphere) => {
    const lat = parseInt(degMin.latDegrees) + (parseFloat(parseInt(degMin.latMinutes) / 60)) + (parseFloat(degMin.latSeconds) / 3600);
    const lon = parseInt(degMin.lonDegrees) + (parseFloat(parseInt(degMin.lonMinutes) / 60)) + (parseFloat(degMin.lonSeconds) / 3600);
    return {
      lon: lonHemisphere === 'East' ? lon : (lon * -1),
      lat: latHemisphere === 'North' ? lat : (lat * -1)
    };
  },

  locationToGeoJSONPoint: (location) => {
    const { lon, lat, time, timestamp, sentence, speed, fix, satellites } = location;
    if(!(location && Math.abs(lat) && Math.abs(lon))) {
      return null;
    }
    const properties = { time, timestamp, sentence, speed, fix, satellites };
    const coordinates = [lon, lat];
    const geometry= {
      type: "Point",
      coordinates,
      properties,
    };
    return JSON.stringify(geometry);
  },

  locationToWKTPoint,

  geoJSONPointToWKTPoint: (geoJSONPoint) => {
    const point = JSON.parse(geoJSONPoint);
    const lat = point.coordinates[1];
    const lon = point.coordinates[0];
    return locationToWKTPoint({ lat, lon });
  },

  getTotals: (estimatedCatch) => {
    const totals = {};
    [...estimatedCatch].filter(p => p.code && p.amount).forEach((p) => {
      if(p.amount){
        totals[p.code] = ((totals[p.code] || 0) + parseInt(p.amount));
      }
    });
    return Object.keys(totals).map((k) => ({code: k, amount: parseInt(totals[k])}));
  },
  tripCanStart: (trip) => {
    if(trip.started) {
      return false;
    }
    return [
      'leavingPort',
      'startTime',
      'endTime',
      'unloadPort',
      'headlineHeight',
      'wingSpread'
    ].every(key => !!trip[key]);
  },

  createHistoryTrip(trip, fishingEvents){
    const {
      startTime,
      endTime,
      leavingPort,
      unloadPort,
      id,
    } = trip;

    const newEvents = fishingEvents.map(fe => {
      const { discards, estimatedCatch } = fe;
      return {
        discards: discards.map(d => ({ code: d.code, amount: d.amount })),
        estimatedCatch: estimatedCatch.map(d => ({ code: d.code, amount: d.amount })),
      }
    });

    return {
      startTime,
      leavingPort,
      unloadPort,
      endTime,
      fishingEvents: newEvents,
      id,
    };
  },

}
