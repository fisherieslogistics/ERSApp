'use strict';
import dgram from 'react-native-udp';
import TextEncoding from 'text-encoding';

export default class UDPLocationListener {
  constructor () {
    this.onMessage = this.onMessage.bind(this);
    this.setSettings = this.setSettings.bind(this);
    this.server = null;
  }

  setSettings({ udpPort, messageCallback, udpEncoding, closeCallback, errorCallback }) {
    this.port = udpPort;
    this.encoding = udpEncoding;
    this.messageCallback = messageCallback;
    this.onClose = closeCallback;
    this.onError = errorCallback;
  }

  closeServer() {
    if(!(this.server && this.active)) {
      return;
    }
    this.server.close();
  }

  startServer() {
    this.server = dgram.createSocket('udp4');
    this.server.on('error', (err) => {
      try {
        this.server.close();
      } catch (e) {
        this.onError(err, e);
        return;
      }
      this.onError(err);
    });

    this.server.on('close', () => {
      this.active = false;
    });

    this.server.on('message', this.onMessage);

    this.server.on('listening', () => {
      this.active = true;
    });

    this.server.bind(this.port);
  }

  onMessage(msg, rinfo) {
    let messageAsString;
    if(this.encoding === 'uintarray') {
      messageAsString = new TextEncoding.TextDecoder("utf-8").decode(msg);
    }
    if(this.encoding === 'binary') {
      messageAsString = new TextEncoding.TextDecoder("utf-8").decode(msg);
    }
    if(messageAsString) {
      messageAsString.split('\n').forEach((line) => this.messageCallback(null, line, rinfo));
    }
  }

}
