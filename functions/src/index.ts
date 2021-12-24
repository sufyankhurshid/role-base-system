import functions = require("firebase-functions");

exports.randomNumber = functions.https.onRequest((request: any, response: any) => {
  const number = Math.round(Math.random() * 100);
  response.send(number.toString());
});
