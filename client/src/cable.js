import actionCable from 'actioncable';

const CABLE_URL = 'wss://family-messaging-b43098fd5fb4.herokuapp.com/cable';

const cable = actionCable.createConsumer(CABLE_URL);

const CableApp = {
  cable: cable,
};

export default CableApp; 
