const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// ?  process.cwd() - returns the current working directory of the Node.js process
// ? path.join() - joins all given path segments together using the platform-specific separator as a delimiter, then normalizes the resulting path.
// ? path.join(process.cwd(), './gmail/token.json') - returns the current working directory of the Node.js process + /gmail/token.json
// ? fs - file system module
// ? fs.writeFile() - writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
// ? fs.readFile() - reads the entire contents of a file. data can be a string or a buffer.
const TOKEN_PATH = path.join(process.cwd(), './gmail/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './gmail/credentials.json');


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

function decodeBase64(base64str) {
    const buffer = Buffer.from(base64str, 'base64');
    return buffer.toString('utf8');
}
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});


    const messages = await gmail.users.messages.list({
        userId: 'me',
    })

    console.log('messages', messages.data.messages)

    const lastMessage = await gmail.users.messages.get({
        userId: 'me',
        id: messages.data.messages[0].id,
    })

    console.log('lastMessage', lastMessage.data)

    for (let i = 0; i < lastMessage.data.payload.parts.length; i++) {
        var part = lastMessage.data.payload.parts[i];

        console.log('part', part);

        switch (part?.mimeType) {
            case 'multipart/alternative':

             for (let i = 0; i < part.parts.length; i++) {
                var subPart = part.parts[i];

                switch (subPart?.mimeType) {
                    case 'text/plain':
                        console.log('text/plain', decodeBase64(subPart.body.data));
                        break;
        
                    case 'text/html':
                        console.log('SHOULD HAVEN OT WHITE SPACE', decodeBase64(subPart.body.data).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " "));
                        break;
                }
             }

            case 'text/plain':
                if (part.body.data) {
                    console.log('text/plain', decodeBase64(part.body.data));
                }
                break;

            case 'text/html':
                if (part.body.data) {
                    // ? replace(/<\/?[^>]+(>|$)/g, "") - removes all html tags
                    // ? replace(/\s\s+/g, ' ') - removes all extra spaces and live only single space
                    console.log('text/html', decodeBase64(part.body.data))
                    // console.log('text/html', decodeBase64(part.body.data).replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, ''));
                }
                break;
        }
    }
}

authorize().then(listLabels).catch(console.error);