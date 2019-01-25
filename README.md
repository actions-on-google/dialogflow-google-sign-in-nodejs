# Actions on Google: Account Linking with Google Sign-In Sample using Node.js and Cloud Functions for Firebase

This sample shows you how to create, save, read, and link user data using [Firebase Authentication](https://firebase.google.com/docs/auth/) and [Google Sign-In for the Assistant](https://developers.google.com/actions/identity/google-sign-in).

## Setup Instructions

### Before you begin
Make sure to perform these prerequisite steps:

1. Install Firebase SDK Version `4.x.x` with `npm install --global firebase-tools@4.x.x`.
2. Select a project by running `firebase use --add` using alias `default` in the sample directory.

For troubleshooting these steps, you can refer to the latest [setup instructions for Firebase Functions SDK](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk).

### Steps
1. Use the [Actions on Google Console](https://console.actions.google.com) to add a new project with a name of your choosing and click *Create Project*.
1. Scroll down to the *More Options* section, and click on the *Conversational* card.
1. On the left navigation menu under *ADVANCED OPTIONS*, click on *Account linking*
   1. Under *Account creation*, select `Yes, allow users to sign up for new accounts via voice`.
   1. Under *Linking type*, select `Google Sign In`.
   1. Under *Client information*, select and copy the text content in the box under *Client ID issued by Google to your Actions*, now referred to as `<CLIENT_ID>`.
   1. In the `functions` folder, create a new file called `.env` and set the contents of the file to `CLIENT_ID=<CLIENT_ID>` using the text copied previously.
1. In the Actions Console left navigation menu under *BUILD*, click on *Actions*. Click on *Add Your First Action* and choose your action's language(s).
1. Select *Custom intent*, click *BUILD*. This will open a Dialogflow console. Click *CREATE*.
1. Click on the gear icon to see the project settings.
1. Select *Export and Import*.
1. Select *Restore from zip*. Follow the directions to restore from the `GSISample.zip` file in this repo.
1. Deploy the fulfillment webhook provided in the functions folder using [Google Cloud Functions for Firebase](https://firebase.google.com/docs/functions/):
   1. In the `functions` directory, install dependencies with `npm install`.
   1. Run `firebase deploy` and take note of the endpoint where the fulfillment webhook has been published. It should look like `Function URL (gsi): https://${REGION}-${PROJECT}.cloudfunctions.net/gsi`
1. Go back to the Dialogflow console and select *Fulfillment* from the left navigation menu.
1. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.
1. Go to the [Firebase console](https://console.firebase.google.com) and select the project that you have created on the Actions on Google console.
   1. In the *Database* section, click *Create database* under `Cloud Firestore`.
   1. Click *Enable*. While testing this sample, you can keep the database world readable.
   1. In the *Authentication* section, under the Sign in method tab, enable the Google sign-in method and click Save.
      1. Make sure `One account per email address` is set to `Prevent creation of multiple accounts with the same email address` which should be selected by default.
1. Go back to the [Actions on Google console](https://console.firebase.google.com) and select the project that you have created for this sample.
1. Type `Talk to my test app` in the simulator, or say `OK Google, talk to my test app` to any Actions on Google enabled device signed into your developer account.
1. After you have saved your favorite color, you can navigate to `<YOUR-FIREBASE-APP>.firebaseapp.com` to save and read your favorite color.
   1. You may need to allow popups in your browser for this page.
1. For developer testing to reset sign in for a user, fill out the `Invocation` and `Directory information` fields on the Actions Console, then you can go to the Action page on the [Actions directory](https://developers.google.com/actions/distribute/directory) with a phone even while it's not published and tap `Reset app`.
   1. Note that it make take some time to show up on the Actions directory.

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/dialogflow/deploy-fulfillment).

## References and How to report bugs
* Actions on Google documentation: [https://developers.google.com/actions/](https://developers.google.com/actions/).
* If you find any issues, please open a bug here on GitHub.
* Questions are answered on [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google).

## How to make contributions?
Please read and follow the steps in the CONTRIBUTING.md.

## License
See LICENSE.md.

## Terms
Your use of this sample is subject to, and by using or downloading the sample files you agree to comply with, the [Google APIs Terms of Service](https://developers.google.com/terms/).

## Google+
Actions on Google Developers Community on Google+ [https://g.co/actionsdev](https://g.co/actionsdev).
