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

/**
 * Tip: Sign In should not happen in the Default Welcome Intent, instead
 * later in the conversation.
 * See `Action discovery` docs:
 * https://developers.google.com/actions/discovery/implicit#action_discovery
 */

'use strict';

const {dialogflow, SignIn, Suggestions} = require('actions-on-google');
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
  if (!conv.data.uid && email) {
    try {
      conv.data.uid = (await auth.getUserByEmail(email)).uid;
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
      // If the user is not found, create a new Firebase auth user
      // using the email obtained from the Google Assistant
      conv.data.uid = (await auth.createUser({email})).uid;
    }
  }
  if (conv.data.uid) {
    conv.user.ref = dbs.user.doc(conv.data.uid);
  }
});

app.intent('Default Welcome Intent', async (conv) => {
  // Account Linking is only supported for verified users
  // https://developers.google.com/actions/assistant/guest-users
  if (conv.user.verification !== 'VERIFIED') {
    return conv.close(`Hi! You'll need to be a verified user to use this sample`);
  }

  const {payload} = conv.user.profile;
  const name = payload ? ` ${payload.given_name}` : '';
  conv.ask(`Hi${name}!`);
  conv.ask(new Suggestions('Red', 'Green', 'Blue'));

  if (conv.user.ref) {
    const doc = await conv.user.ref.get();
    if (doc.exists) {
      const color = doc.data()[Fields.COLOR];
      return conv.ask(`Your favorite color was ${color}. ` +
        'Tell me a color to update it.');
    }
  }

  conv.ask(`What's your favorite color?`);
});

app.intent('Give Color', async (conv, {color}) => {
  conv.data[Fields.COLOR] = color;
  if (conv.user.ref) {
    await conv.user.ref.set({[Fields.COLOR]: color});
    conv.close(`I got ${color} as your favorite color.`);
    return conv.close(`Since you are signed in, I'll remember it next time.`);
  }
  conv.ask(new SignIn(`To save ${color} as your favorite color for next time`));
});

app.intent('Get Sign In', async (conv, params, signin) => {
  if (signin.status !== 'OK') {
    return conv.close(`Let's try again next time.`);
  }
  const color = conv.data[Fields.COLOR];
  await conv.user.ref.set({[Fields.COLOR]: color});
  conv.close(`I saved ${color} as your favorite color. ` +
    `Since you are signed in, I'll remember it next time.`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
