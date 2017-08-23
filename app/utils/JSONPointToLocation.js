
export default function JSONPointToLocation(pointStr) {
  if(!pointStr) {
    return { lat: 0, lon: 0};
  }
  let loc = null;
  try {
    loc = JSON.parse(pointStr);
  } catch (err) {
    return {
      lat: 0,
      lon: 0,
      date: null,
      sentence: "",
      fix: 0,
      speed: 0,
    };
  }
  //console.log(loc, "here is the beast");
  const { coordinates, properties } = loc;
  const  { time, timestamp, sentence, fix, speed, course } = properties;
  return {
    lat: coordinates[1],
    lon: coordinates[0],
    time,
    sentence,
    fix,
    speed,
    timestamp,
    course,
  };
}
