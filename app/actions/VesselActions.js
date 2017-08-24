
export function updateVessels(vessels) {
  return {
    type: 'updateVessels',
    payload: {
      vessels,
    },
  }
}
