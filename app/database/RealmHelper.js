import uuid from 'uuid/v1';
import { classMapper, getRealm } from '../database/realmDB';

export const getRecords = (name) => {
  const realmClass = classMapper[name];
  return getRealm().objects(realmClass.schema.name).sorted('createdTimestamp', false);
}

export function getLastRecord(name) {
  const realmClass = classMapper[name];
  return getRealm().objects(realmClass.schema.name).sorted('createdTimestamp', true)[0];
}

export function getFirstRecord(name) {
  return getRecords(name)[0];
}

export function queryRecord(name, query, ...args) {
  return getRecords(name).filtered(query, ...args);
}

export const getRecord = (name, id) => {
  const realmClass = classMapper[name];
  return getRealm().objectForPrimaryKey(realmClass, id)
}

export const updateRecord = (item, changes) => getRealm().write(() => {
  Object.keys(changes).forEach((key) => {
    item[key] = changes[key];
  });
  item.updatedTimestamp = new Date();
});

export const createRecord = (name, values) => {
  const realmClass = classMapper[name];
  const standardAttributes = {
    RAId: values.RAId ? values.RAId : uuid(),
    createdTimestamp: new Date(),
    updatedTimestamp: new Date(),
  };
  const attributes = Object.assign({}, values, standardAttributes);
  return getRealm().write(() => getRealm().create(realmClass.schema.name, attributes));
}

export const addRecordsToRecord = ({ itemToAddTo, itemsToAdd, key }) => getRealm().write(() => {
    itemsToAdd.forEach((itemToAdd) => {
      itemToAddTo.updatedTimestamp = new Date();
      const list = itemToAddTo[key] || [];
      list.push(itemToAdd);
    });
  });

export const deleteRecord = (item) => getRealm().write(() => getRealm().delete(item));

export default class RealmHelper {

  constructor(name) {
    this.name = name;
  }

  create(values) {
    createRecord(this.name, values);
    return this.getLast();
  }

  findOne(id) {
    return getRecord(this.name, id);
  }

  findAll() {
    return getRecords(this.name);
  }

  findWhere(query) {
    return queryRecord(this.name, query);
  }

  findOneWhere(query, sorting, acsending = false) {
    return queryRecord(this.name, query).sorted(sorting, acsending)[0];
  }

  update(item, changes) {
    return updateRecord(item, changes);
  }

  upsert(item, changes={}) {
    if(item.RAId) {
      const record = getRecord(this.name, item.RAId);
      if(record) {
        return updateRecord(record, item);
      }
    }
    return createRecord(this.name, Object.assign({}, item, changes));
  }

  addToList(itemToAddTo, itemsToAdd, key) {
    return addRecordsToRecord({ itemToAddTo, itemsToAdd, key });
  }

  getFirst() {
    return getFirstRecord(this.name);
  }

  getLast() {
    return getLastRecord(this.name);
  }

  delete(item) {
    return deleteRecord(item);
  }

}
