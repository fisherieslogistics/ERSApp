import moment from 'moment';
//import statAreas from '../constants/geography/statAreas';
//import gju from 'geojson-utils';
/* eslint-disable */
//import QMA from '../constants/geography/QMA.json';
/* eslint-enable */

/*const QMAlocations = QMA.map(qma => ({
    name: qma.features[0].properties.FishstockC,
    area: qma.features[0].geometry.coordinates[0].map(x => [x[0] < 0 ? x[0] + 360 : x[0], x[1]]),
    properties: qma.features[0].properties,
}));*/

function update(obj, change, stamps={}) {
  return Object.assign({}, obj, change, stamps);
}

function getQMA(code, location) {
  /*const area = QMAlocations.filter(
    x => x.properties.SpeciesCod === code).find(
      qma => gju.pointInPolygon(
        { type: 'Point', coordinates: [location.lon < 0 ? location.lon + 360 : location.lon, location.lat] },
        { type: 'Polygon', coordinates: [qma.area] }
  ));
  return area ? area.name : 'N/A';*/
  return 'N/A';
}

function calculateStatArea(location) {
  /*const statAreaArray = statAreas.features;
  const statArea = statAreaArray.find((area) => gju.pointInPolygon(
      { type: 'Point', coordinates: [location.lon < 0 ? location.lon + 360 : location.lon, location.lat] },
      area.geometry,
    ));
  if (statArea) return statArea.properties.Statistica;*/
  return 'N/A';
}

export {
  update,
  calculateStatArea,
  getQMA,
};
