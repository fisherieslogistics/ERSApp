import { queryRecord, updateRecord, getLastRecord } from '../database/RealmHelper';

const MSECS_BETWEEN_WRITES = 350;

export default class MessageSendLoop {

  constructor(connection) {
    this.connection = connection;
    this.start = this.start.bind(this);
    this.restart = this.restart.bind(this);
    this.stop = this.stop.bind(this);
    this.loop = this.loop.bind(this);
    this.running = false;
  }

  getNextAction() {
    //return queryRecord('actionToSend', ' sent = false ').sorted('timestamp', false).slice(0)[0];
  }

  start() {
    this.stopped = false;
    this.loop();
  }

  loop() {

    if(this.stopped) {
      return;
    }
    const actionToSend = this.getNextAction();

    if(!actionToSend) {
      return this.restart();
    }

    const vessel = getLastRecord('vessel');
    if(!vessel) {
      return Promise.resolve();
    }


    /*Promise.all(fragmentsToSend.map((sentence) => this.sendFragment(sentence))).then((done) => {

      updateRecord(actionToSend, { sent: true });


      this.loop();

    });*/
  }

  restart(err) {
    if(err) {
      /* eslint-disable */
      console.warn(err);
      /* eslint-enable */
    }
    clearTimeout(this._restartTimeout);
    this._restartTimeout = setTimeout(this.loop, 2000);
  }

  stop() {
    this.stopped = true;
    clearTimeout(this._restartTimeout);
  }

}
