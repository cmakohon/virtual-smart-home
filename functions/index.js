// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});

const { v4: uuidv4 } = require('uuid');


// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const defaultDevices = [
  {
    name: "Bedroom Light",
    type: "LIGHT",
    state: "OFF"
  },
  {
    name: "Living Room TV",
    type: "TV",
    state: "OFF"
  },
  {
    name: "Ecobee",
    type: "THERMOSTAT",
    state: "OFF"
  }
];

exports.createHome = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const name = req.query.name;
    // Push the new home into Cloud Firestore using the Firebase Admin SDK.
    defaultDevices.forEach(d => d.id = uuidv4());
    const homeResult = await admin.firestore().collection('homes').add({
      name: name,
      devices: defaultDevices
    });
    // Send back a message that we've succesfully created the home
    res.json({result: homeResult.id});
  });
});

exports.getHome = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { 
    const homeId = req.query.id;
    // Push the new home into Cloud Firestore using the Firebase Admin SDK.
    const readResult = await admin.firestore().collection('homes').doc(homeId).get();
    // Send back a message that we've succesfully created the home
    res.json({result: readResult.data()});
  });
});

exports.addDevice = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { 
    const homeId = req.query.id;
    let device = req.body.device;
    device.id = uuidv4();
    
    // Push the new home into Cloud Firestore using the Firebase Admin SDK.
    const homeRef = admin.firestore().collection('homes').doc(homeId);
    const updateResult = await homeRef.update({
      devices: admin.firestore.FieldValue.arrayUnion(device)
    });
    // Send back a message that we've succesfully created the home
    res.json({result: updateResult});
  });
});

exports.removeDevice = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { 
    const homeId = req.query.id;
    let device = req.body.device;
  
    const homeRef = admin.firestore().collection('homes').doc(homeId);
    const updateResult = await homeRef.update({
      devices: admin.firestore.FieldValue.arrayRemove(device)
    });
    // Send back a message that we've succesfully removed the device
    res.json({result: updateResult});
  });
});

exports.updateDeviceState = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => { 
    const homeId = req.query.id;
    const update = req.body.update;

    const homeRef = admin.firestore().collection('homes').doc(homeId);
    const homeResult = await homeRef.get();
    let devices = homeResult.data().devices;
    devices.forEach(d => {
      if (d.id === update.id) {
        d.state = update.state;
      }
    });
    const updateResult = await homeRef.update({
      devices: devices
    });
    // Send back a message that we've succesfully updated the device
    res.json({result: updateResult});
  });
});


