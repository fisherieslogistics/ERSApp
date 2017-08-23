
export default function generateRealm(model, name) {

  const schema = {
    name,
    primaryKey: 'RAId',
    properties: {
      RAId: { type: 'string' },
      createdTimestamp: { type: 'date' },
      updatedTimestamp: { type: 'date' },
    },
  };

  model.forEach((field) => {
    if(field.realm) {
      schema.properties = Object.assign({}, schema.properties, { [field.id]: field.realm });
    }
  });

  return schema;

}
