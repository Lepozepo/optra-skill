const uuid = require('uuid');
const { random } = require('lodash');

module.exports = function startSyntheticEventStream(props = {}) {
  if (!props.deviceId) throw new Error('deviceId is required!');

  return setInterval(() => {
    const totalSpaces = 80;

    const spacesOccupied = random(totalSpaces - 1);
    const spacesAvailable = totalSpaces - spacesOccupied;

    const message = new Message(JSON.stringify({
      triggeredBySensorIds: ['265510051067724289'],
      createdAt: Date.now(),
      idempotencyKey: uuid.v4(),
      deviceId: props.deviceId,
      skillId: process.env.OPTRA_SKILL_ID,
      sensors: [
        {
          sensorId: '265510051067724289',
          imageUrls: {
            snapshot: 'https://optra-demo-data.s3.amazonaws.com/loves/sadieville/camera3/snapshot_1586547159290.jpg',
            debug: 'https://optra-demo-data.s3.amazonaws.com/loves/sadieville/camera3/debug_1586547159290.jpg'
          },
        },
      ],
      data: {
        spacesOccupied,
        spacesAvailable,
        snapshot: 'https://optra-demo-data.s3.amazonaws.com/loves/sadieville/camera3/snapshot_1586547159290.jpg',
        debug: 'https://optra-demo-data.s3.amazonaws.com/loves/sadieville/camera3/debug_1586547159290.jpg'
      },
    }));
    console.log('Sending message: ' + message.getData());
    client.sendEvent(message, console.log);
  }, 15000);
}