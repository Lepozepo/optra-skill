const Client = require('azure-iot-device').ModuleClient;
const Message = require('azure-iot-device').Message;
const Transport = require('azure-iot-device-mqtt').Mqtt;
const _ = require('lodash');

const startSyntheticEventStream = require('./startSyntheticEventStream');

(async () => {
  try {
    const client = await Client.fromEnvironment(Transport);
    await client.open();
    const twin = await client.getTwin();

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.onMethod('startSyntheticEventStream', (req, res) => {
      try {
        if (global.eventStream) throw new Error('Event stream already exists!');
        global.eventStream = startSyntheticEventStream(req.payload);
        res.send(200, {}, (err) => {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        console.error(err.message);
        res.send(400, err.message, console.log);
      }
    });
    client.onMethod('stopSyntheticEventStream', (req, res) => {
      clearInterval(global.eventStream);
      res.send(200, {}, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    client.onMethod('forwardMessageToSQS', (req, res) => {
      try {
        const message = new Message(JSON.stringify(req.payload));
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, console.log);

        res.send(200, {}, (err) => {
          if (err) {
            console.log(err);
          }
        });
      } catch (err) {
        console.error(err.message);
        res.send(400, err.message, console.log);
      }
    });

    twin.on('properties.desired', (diff) => {
      const patch = _.omitBy(diff, (v, k) => _.startsWith(k, '$'));
      twin.properties.reported.update(patch, function(err) {
        console.log(JSON.stringify(diff));
        if (err) throw err;
      });
    });
  } catch (err) {
    console.error(err.message);
  }
})();
