const HandGatheringEventModel = [
  {
    id: 'fishingMethod',
    default: 'H',
    repeating: true,
    realm: { type: 'string' },
  },
  {
    id: 'numberOfPeople',
    label: 'Number Of People',
    type: 'number',
    display: { type: 'single' },
    default: 1,
    repeating: true,
    realm: { type: 'int', optional: true }
  },
];
/*{
  "eventHeader": {
  "eventId": "qweasd123",
  "isVesselUsed": false,
  "notes": "Hand gathering CREATE - TEST",
  "tripId": "111",
  "completedDateTime": "2017-01-01T08:00:00+13:00",
  "softwareVendor": "ERS-FishServe",
  "softwareVersion": "1.1.2",
  "softwareInstallationId": "a13afab2-c409-4622-b8f8-146996587809",
  "clientNumber": "1234567",
  "completerUserId": "1234"
  },
  "numberOfPeople": 1,
  "timeSpentHours": 1,
  "isNonFishOrProtectedSpeciesCatchPresent": false,

  "fishingMethodCode": "H",
  "targetSpeciesCode": "SNA",
  "mitigationDeviceCodes": ["STR"],
  "startLocation": {
    "systemDateTime": "2017-04-10T09:15:00+11:00",
    "systemLocation": {
      "longitude": -175.5432,
      "latitude": -45.9878
    }
  },
  "finishLocation": {
      "systemDateTime": "2017-04-10T09:15:00+11:00",
      "systemLocation": {
        "longitude": "174.6799",
        "latitude": "-41.4289"
      }
  },
   "catches": [
    {
      "speciesCode": "SNA",
      "greenWeightEstimateKg": 50.25
    },
    {
      "speciesCode": "HOK",
      "greenWeightEstimateKg": 23.75
    }
    ],


  "nonFishOrProtectedSpeciesCatches": [
    {
      "speciesCode": "XAF",
      "estimatedWeightKg": null,
      "seabirdCaptureCode": "",
      "numberUninjured": 1,
      "numberInjured": null,
      "numberDead": null,
      "tags": null
    },
    {
      "speciesCode": "DEN",
      "estimatedWeightKg": 5.5,
      "numberUninjured": null,
      "numberInjured": null,
      "numberDead": null,
      "tags": ["SG101", "SG105", "SG305", "SG501"]
    }
  ]
}*/

export default HandGatheringEventModel;
