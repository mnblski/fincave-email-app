require('dotenv').config();

const { ImapFlow } = require('imapflow');

console.log('a', process.env.YAHOO_USER, process.env.YAHOO_PASS, process.env.YAHOO_HOST, process.env.YAHOO_PORT);

const client = new ImapFlow({
    host: process.env.YAHOO_HOST,
    port: process.env.YAHOO_PORT,
    secure: true,
    auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS
    }
});


const main = async () => {
    await client.connect();

    // let lock = await client.getMailboxLock('INBOX');

    // try {
    //     let message = await client.fetchOne(client.mailbox.exists, { source: true });
    //     console.log(message.source.toString());

    //     for await (let message of client.fetch('1:*', { envelope: true })) {
    //         console.log(`${message.uid}: ${message.envelope.subject}`);
    //     }
    // } finally {
    //     lock.release();
    // }

    // await client.logout();
};


main().catch(err => {
    console.log('ERROR', err.message);
});