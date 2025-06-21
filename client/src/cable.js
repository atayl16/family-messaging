import actionCable from 'actioncable';

const CABLE_URL = 'wss://family-messaging.onrender.com/cable';

const cable = actionCable.createConsumer(CABLE_URL);

const CableApp = {
  cable: cable,
};

export default CableApp; 
