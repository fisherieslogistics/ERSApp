import AsyncStorage from 'AsyncStorage';

export default class ReactNativeStorage {
  constructor(name) {
    this.name = name;
    this.cache = null;
    this.read = this.read.bind(this)
    this.update = this.update.bind(this)
  }


  read(cb) {
    if(this.cache) {
      cb(null, Object.assign({}, this.cache));
      return;
    }

    AsyncStorage.getItem(this.name, (err, state) => {
      if(err) {
        cb(err);
        return;
      }
      if(!state) {
        this.cache = {};
      } else {
        this.cache = JSON.parse(state);
      }
      cb(null,  Object.assign({}, this.cache));
    });
  }

  update(toUpdate, cb) {
    this.read((err, readState) => {
      if(err) {
        cb(err)
        return;
      }
      Object.assign(readState, toUpdate);
      this.cache = readState;
      AsyncStorage.setItem(this.name, JSON.stringify(readState), cb);
    });
  }

}
