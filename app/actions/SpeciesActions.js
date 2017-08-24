
export function updateSpecies(species) {
  return {
    type: 'updateSpecies',
    payload: {
      species,
    },
  }
}
