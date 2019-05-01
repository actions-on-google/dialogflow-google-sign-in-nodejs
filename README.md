# Actions on Google: Account Linking with Google Sign-In Sample

This sample demonstrates Actions on Google features for use on Google Assistant including account linking and [Google Sign In](https://developers.google.com/actions/identity/google-sign-in) -- using the [Node.js client library](https://github.com/actions-on-google/actions-on-google-nodejs), [Firebase Authentication](https://firebase.google.com/docs/auth/), and deployed on [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).

## Setup Instructions
### Prerequisites
1. Node.js and NPM
    + We recommend installing using [NVM](https://github.com/creationix/nvm)
1. Install the [Firebase CLI](https://developers.google.com/actions/dialogflow/deploy-fulfillment)
    + We recommend using version 6.5.0, `npm install -g firebase-tools@6.5.0`
    + Run `firebase login` with your Google account

### Configuration
#### Actions Console
1. From the [Actions on Google Console](https://console.actions.google.com/), add a new project > **Create Project** > under **More options** > **Conversational**
1. On the left navigation menu under **Advanced Options** > **Account linking**:
   + **Account creation** > select `Yes, allow users to sign up for new accounts via voice`.
   + **Linking type** > select `Google Sign In`.
   + **Client information** > copy **Client ID** > **Save**.
1. In the `functions` folder, create a `.env` file and declare `CLIENT_ID=${CLIENT_ID}`, replacing ${CLIENT_ID} from the previous step.
1. From the left navigation menu under **Build** > **Actions** > **Add Your First Action** > **BUILD** (this will bring you to the Dialogflow console) > Select language and time zone > **CREATE**.
1. In the Dialogflow console, go to **Settings** ⚙ > **Export and Import** > **Restore from zip** using the `agent.zip` in this sample's directory.

#### Firestore Database
1. From the [Firebase console](https://console.firebase.google.com), find and select your Actions on Google Project ID
1. From **Settings** ⚙ > **Project settings** > **Service accounts** > **Firebase Admin SDK** > **Node.js** > **Generate new private key**
1. Save private key in `functions/` and rename the file to `service-account.json`
1. In the left navigation menu under **Develop** section > **Database** > **Create database** button > Select **Start in test mode** > **Enable**

#### Firebase Deployment
1. On your local machine, in the `functions` directory, run `npm install`
1. Run `firebase deploy --project {PROJECT_ID}` to deploy the function
    + To find your **Project ID**: In [Dialogflow console](https://console.dialogflow.com/) under **Settings** ⚙ > **General** tab > **Project ID**.
1. Visit the **Hosting URL** link output from the prior deployment, `https://${PROJECT_ID}.firebaseapp.com`, in your browser
1. Visit the **Project Console** link > **Functions** > **Dashboard** > copy the link: `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/dialogflowFirebaseFulfillment`

#### Dialogflow Console
1. Return to the [Dialogflow Console](https://console.dialogflow.com) > select **Fulfillment** > **Enable** Webhook > Set **URL** to the **Function URL** from Firebase copied from previous step in the form of: `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/dialogflowFirebaseFulfillment` > **SAVE**.
1. From the left navigation menu, click **Integrations** > **Integration Settings** under Google Assistant > Enable **Auto-preview changes** >  **Test** to open the Actions on Google simulator then say or type `Talk to my test app`.

### Running this Sample
+ You can test your Action on any Google Assistant-enabled device on which the Assistant is signed into the same account used to create this project. Just say or type, “OK Google, talk to my test app”.
+ You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.
+ Go to `https://<YOUR-FIREBASE-APP>.firebaseapp.com` to save and read your favorite color.

## Troubleshooting
+ If running into issues after following the above steps, clear your browser's cache and make sure pop ups are allowed.

## References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google), [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/) or [Support](https://developers.google.com/actions/support/).
+ For bugs, please report an issue on Github.
+ Actions on Google [Documentation](https://developers.google.com/actions/extending-the-assistant)
+ Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant)
+ [Webhook Boilerplate Template](https://github.com/actions-on-google/dialogflow-webhook-boilerplate-nodejs) for Actions on Google

## Make Contributions
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).
