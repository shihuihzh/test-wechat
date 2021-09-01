const QRCode = require('qrcode')
const { Wechaty, config } = require('wechaty');
const name = 'wechat-puppet-wechat';

let bot = new Wechaty({
    name, // generate xxxx.memory-card.json and save login data for the next login
});

//  Genrate QR code
function onScan(qrcodeText, status) {
    // require('qrcode-terminal').generate(qrcode); // show qr code in terminal
    QRCode.toString(qrcodeText, { type: 'terminal' }, function (err, url) {
        console.log(url)
    })
    QRCode.toFile('qr-login.png', qrcodeText)
}

// login call back
async function onLogin(user) {
    console.log(`Robot ${user} login success`);
    findUUIRoomAndSendMessage()
}

// logout
function onLogout(user) {
    console.log(`Robot ${user} logout success`);
}

// onmessage
async function onMessage(msg) {
    console.log(`Received from ${msg.talker()} `);
    if (msg.age() > 60) {
        console.log('Message discarded because its TOO OLD(than 1 minute)')
        return
    }

    if (msg.type() !== bot.Message.Type.Text || !/^(ding|ping|bing|code)$/i.test(msg.text())) {
        console.log('Message discarded because it does not match ding/ping/bing/code')
        return
    }

    /**
     * 1. reply 'pong'
     */
    await msg.say('This Pong is from Howe\'s Bot')
    console.log('REPLY: pong')
}

// find room and send message
async function findUUIRoomAndSendMessage() {
    const room = await bot.Room.find({ topic: /^UUI.*/ })
    if (room) {
        console.log('UUI room found')
        // room.say("This is a messsage send by bot")
    }
}

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.start()
    .then(() => console.log('Start to login'))
    .catch((e) => console.error(e));