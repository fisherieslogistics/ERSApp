
const HandGatheringEventModel = [
  {
    id: 'fishingMethod',
    default: 'H',
    repeating: true,
  },
  {
    id: 'numberOfPeople',
    label: 'Number Of People',
    type: 'number',
    display: { type: 'single' },
    default: 1,
    repeating: true,
  },
];

export default HandGatheringEventModel;
