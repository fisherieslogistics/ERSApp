import Sexagesimal from 'sexagesimal';
import moment from 'moment';

export function locationToWKTPoint(location) {
  const { lon, lat } = location;
  return 'POINT ({o} {a})'.replace('{o}', lon).replace('{a}', lat);
}

export function update(obj, change, more={}) {
  return Object.assign({}, obj, change, more);
}

export function updateWithTimeStamp(obj, change){
  return update(obj, change, { lastUpdated: moment().milliseconds() });
}

export function getDegreesMinutesFromLocation(location) {
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
  };

export function NMEATimeToMoment(time) {
  const datetime = moment();
  datetime.minutes(parseInt(time.slice(2, 4)));
  datetime.seconds(parseInt(time.slice(4, 6)));
  datetime.hours(parseInt(time.slice(0, 2)));
  return datetime;
};

function toDecimal(degrees, mins, seconds, hemisphere) {
  const dec = parseInt(degrees) + (parseFloat(parseInt(mins) / 60)) + (parseFloat(seconds) / 3600);
  return ['East', 'North'].find(f => f === hemisphere) ? dec : (dec *-1);
}

export function parseLocation({ lonDegrees, lonMinutes, lonSeconds }, lonHemisphere, latHemisphere) {
  return {
    lon: toDecimal(lonDegrees, lonMinutes, lonSeconds, lonHemisphere),
    lat: toDecimal(latDegrees, latMinutes, latSeconds, latHemisphere),
  };
};

export function locationToGeoJSONPoint(location) {
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
};

export function geoJSONPointToWKTPoint(geoJSONPoint) {
  const point = JSON.parse(geoJSONPoint);
  const lat = point.coordinates[1];
  const lon = point.coordinates[0];
  return locationToWKTPoint({ lat, lon });
};

export function getTotals(estimatedCatch) {
  const totals = {};
  [...estimatedCatch].filter(p => p.code && p.weightKgs).forEach((p) => {
    if(p.weightKgs){
      totals[p.code] = ((totals[p.code] || 0) + parseInt(p.weightKgs));
    }
  });
  return Object.keys(totals).map((k) => ({code: k, weightKgs: parseInt(totals[k])}));
};

export function tripCanStart(trip) {
  if(trip.started) {
    return false;
  }
  return [
    'leavingPort',
    'datetimeAtStart',
    'datetimeAtEnd',
    'unloadPort',
    'headlineHeight',
    'wingSpread'
  ].every(key => !!trip[key]);
};

export function createHistoryTrip(trip, fishingEvents){
  const {
    datetimeAtStart,
    datetimeAtEnd,
    leavingPort,
    unloadPort,
    id,
  } = trip;

  const newEvents = fishingEvents.map(fe => {
    const { discards, estimatedCatch } = fe;
    return {
      discards: discards.map(d => ({ code: d.code, weightKgs: d.weightKgs })),
      estimatedCatch: estimatedCatch.map(d => ({ code: d.code, weightKgs: d.weightKgs })),
    }
  });

  return {
    datetimeAtStart,
    leavingPort,
    unloadPort,
    datetimeAtEnd,
    fishingEvents: newEvents,
    id,
  };
}
