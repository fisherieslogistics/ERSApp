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

export default HandGatheringEventModel;
