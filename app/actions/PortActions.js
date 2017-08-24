
export function updatePorts(ports) {
  return {
    type: 'updatePorts',
    payload: {
      ports,
    },
  }
}
