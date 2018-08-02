/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const {dialogflow, SignIn} = require('actions-on-google');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const dotenv = require('dotenv');

dotenv.config();
admin.initializeApp();

const auth = admin.auth();
const db = admin.firestore();

db.settings({timestampsInSnapshots: true});

const Fields = {
  COLOR: 'color',
};

const dbs = {
  user: db.collection('user'),
};

const app = dialogflow({
  clientId: process.env.CLIENT_ID,
  debug: true,
});

app.middleware(async (conv) => {
  const {email} = conv.user;
  if (email) {
    try {
      const user = await auth.getUserByEmail(email);
      conv.user.ref = dbs.user.doc(user.uid);
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      const user = await auth.createUser({email});
      conv.user.ref = dbs.user.doc(user.uid);
    }
  }
});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask(new SignIn('To save your favorite color'));
});

app.intent('Get Sign In', async (conv, params, signin) => {
  if (signin.status !== 'OK') {
    return conv.close(
      'I need to connect your account to save your favorite color.',
      'Please try to link your account again.'
    );
  }
  const {payload} = conv.user.profile;
  const greeting = payload ? ` ${payload.given_name}` : '';
  conv.ask(`Hi${greeting}!`);

  const doc = await conv.user.ref.get();
  if (doc.exists) {
    return conv.ask(`Your favorite color was ${doc.data()[Fields.COLOR]}. ` +
      'Tell me a color to update it.');
  }
  conv.ask(`What's your favorite color?`);
});

app.intent('Save Color', async (conv, {color}) => {
  await conv.user.ref.set({
    [Fields.COLOR]: color,
  });
  conv.ask(`I saved your favorite color as ${color}.`);
  conv.ask('You can also ask for your saved favorite color.');
});

app.intent('Read Color', async (conv) => {
  const doc = await conv.user.ref.get();
  if (!doc.exists) {
    conv.ask('I do not have your favorite color saved.');
    return conv.ask('You can tell me your favorite color to save it.');
  }
  conv.ask(`Your favorite color is ${doc.data()[Fields.COLOR]}.`);
  conv.ask('You can also tell me your favorite color to update it.');
});

app.fallback('Default Fallback Intent', (conv) => {
  conv.ask(`Sorry, I didn't understand.`);
  conv.ask(`You can ask me to get or set your favorite color.`);
});

exports.gsi = functions.https.onRequest(app);
