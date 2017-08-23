import nmeaP from 'nmea-0183';

export function GPGGAUpdate(sentence) {
  if(!sentence) {
    return {
      type: 'GPSLocationUpdate',
      payload: {
        lat: null,
        lon: null,
        fix: 0,
        satellites: 0,
        sentence: "null",
        time: null,
        date: null,
      }
    }
  }
  const parsed = nmeaP.parse(sentence);
  if(parsed.latitude) {
    const { latitude, longitude, fix, satellites, time, date } = parsed;
    return {
      type: 'GPSLocationUpdate',
      payload: {
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
        fix,
        satellites,
        sentence,
        time,
        date,
      }
    };
  }

  return {
    type: 'GPSLocationUpdate',
    payload: {
      location: null,
      sentence,
    }
  };

}

export function GPVTGUpdate(sentence) {
  if(!sentence) {
    return {
      type: 'GPSLocationUpdate',
      payload: {
        speed: null,
        sentence: "null",
      }
    }
  }

  const parsed = nmeaP.parse(sentence);

  return {
    type: 'GPSpeedUpdate',
    payload: {
      speed: parsed.knots,
      sentence,
    }
  };

}

export function VMSLocationUpdate(sentence) {
  return {
    type: 'VMSLocationUpdate',
    payload: {
      sentence,
    }
  };
}

export function VMSSpeedUpdate(sentence) {
  return {
    type: 'VMSSpeedUpdate',
    payload: {
      sentence,
    }
  };
}

export function startTracking(){
  return {
    type: 'startTracking',
    payload: { startTracking: true },
  }
}

export function stopTracking(){
  return {
    type: 'stopTracking',
    payload: { stopTracking: true },
  }
}
