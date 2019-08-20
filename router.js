//module.exports.usersData = usersData
const fs = require('fs');



console.log('собираем модули...')
var userStart = require('./router/userStart')
console.log('...модули собраны')
module.exports.messageRouter = function messageRouter(message, data, selfMybot) {
    switch (message) {
        case '/start':
            console.log('сообщение определено как /start');
            start(message, data, selfMybot)
            break;
        case '/pokormit':
            pokormit(message, data, selfMybot)
            break;
        case '/adminSendMessageAllGeneral':
            adminSendMessageAll(message, data, selfMybot)
            break;
        case '/adminUpdateDataJsonOld':
            adminUpdateDataJsonOld(message, data, selfMybot)
            break;
        case '/adminUpdateUserData':
            adminUpdateUserData(message, data, selfMybot)
            break;
        case '/adminObosratsaAllUsers':
            adminObosratsaAllUsers(message, data, selfMybot)
            break;
        case '/ubrat':
            ubratZaKotom(message, data, selfMybot)
            break;
    }
}
function pokormit(message, data, selfMybot) {
    var botId = '976224147'
    var dataPath = __dirname + "\\data.json";
    var usersData;
    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    //console.log(usersData);
    var userId = "" + data.from.id;
    var stickerName = "test10" + userId + "_by_kakakaFriendBot";
    var title = "" + stickerName;
    var stickerId = usersData[userId]['stickerId']
    //console.log(usersData[userId][rank])
    if (+usersData[userId]['rank'] < 99) {
        var rank = usersData[userId]['rank'] + 1;
        console.log('уровень пользователя' + rank);
        var img = fs.createReadStream(__dirname + '\\images' + '\\' + rank + '.png');
        selfMybot.addStickerToSet(botId, stickerName, img, "😂").then(() => {
            selfMybot.getStickerSet(stickerName).then((stickerObj) => {
                var stickerInTrash = stickerObj.stickers[0].file_id
                var stickerId = stickerObj.stickers[stickerObj.stickers.length - 1].file_id

                selfMybot.sendSticker(data.chat.id, stickerId).then(() => {
                    selfMybot.deleteStickerFromSet(stickerInTrash)
                })
                selfMybot.sendMessage(data.chat.id, 'МММММ, как вкусно, теперь мой уровень ' + rank + ' . Корми меня дальше чтобы я рос /pokormit')
                usersData[userId] = { 'rank': rank, 'stickerId': stickerId }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            }, (err) => (console.log(err)))
        }, (err) => console.log(err));
    } else selfMybot.sendMessage(data.chat.id, 'Спасибо, но я уже наелся😐')
}

function start(message, data, selfMybot) {
    var dataPath = __dirname + "\\data.json"
    var usersData;

    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(data)
    var userId = "" + data.from.id;
    var stickerName = "test10" + userId + "_by_kakakaFriendBot";
    var stickerNameTemp = stickerName
    var title = "" + stickerName;

    if (!usersData[userId]) {
        var first_name = data.from.hasOwnProperty('first_name') ? data.from.first_name : 'empty'
        var last_name = data.from.hasOwnProperty('last_name') ? data.from.last_name : 'empty'
        var username = data.from.hasOwnProperty('username') ? data.from.username : 'empty'
        console.log(__dirname)
        var img = fs.createReadStream(__dirname + '\\images' + '\\0.png')
        var emojis = "😂"
        console.log(img + 'PNGSTIKERHERE-------------------------------------')
        console.log("t.me/addstickers/" + stickerName)
        selfMybot.createNewStickerSet(userId, stickerName, title, img, emojis).then((val) => {
            //console.log(val)
            selfMybot.getStickerSet(stickerNameTemp).then((stickerObj) => {
                console.log(stickerObj)
                var stickerId = stickerObj.stickers[0].file_id
                selfMybot.sendSticker(data.chat.id, stickerId)
                selfMybot.sendMessage(data.chat.id, 'Привет,я твой новый друг и ты меня найдешь в этом стикер паке. Чтобы покормить меня отправь /pokormit')
                usersData[userId] = {
                    'isObosralsa': false,
                    'rank': 0,
                    'stickerId': stickerId,
                    'first_name': first_name,
                    'last_name': last_name,
                    'username': username
                }
                json = JSON.stringify(usersData); //convert it back to json
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            })
        }, (err) => console.log(err));

    } else { console.log('этот пользователь уже стартанул') }
    //console.log(usersData)

}

function adminSendMessageAll(message, data, selfMybot) {
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    var text = fs.readFileSync(__dirname + "\\text.txt", 'utf8')
    //var usersArr = usersData.arr;
    for (e in usersData) {
        console.log('send to ' + e + '||text: ' + text)
        selfMybot.sendMessage(e, text)
    }
}

function adminUpdateDataJsonOld(message, data, selfMybot) {
    var botId = '976224147'
    var stickerArr = [];
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    for (user in usersData) {
        var stickerName = "test10" + user + "_by_kakakaFriendBot";
        var rank = usersData[user]['rank'];
        console.log('уровень пользователя' + rank);
        var img = fs.createReadStream(__dirname + '\\images' + '\\' + rank + '.png');
        selfMybot.addStickerToSet(botId, stickerName, img, "😂").then(() => {
            selfMybot.getStickerSet(stickerName).then((stickerObj) => {
                var stickerId = stickerObj.stickers[stickerObj.stickers.length - 1].file_id
                usersData[user] = { 'rank': rank, 'stickerId': stickerId }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            }, (err) => (console.log(err)))
        }, (err) => console.log(err));

    }


}

function adminUpdateUserData(message, data, selfMybot) {
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    var userArr = []
    for (user2 in usersData) {
        let user = user2
        //userArr.push(user)
        selfMybot.getChat(user).then((chatObj) => {
            //console.log(userData2)
            if (!usersData[chatObj.id].hasOwnProperty('isObosralsa')) { usersData[chatObj.id]['isObosralsa'] = false }
            usersData[chatObj.id]['first_name'] = chatObj.hasOwnProperty('first_name') ? chatObj.first_name : 'empty'
            usersData[chatObj.id]['last_name'] = chatObj.hasOwnProperty('last_name') ? chatObj.last_name : 'empty'
            usersData[chatObj.id]['username'] = chatObj.hasOwnProperty('username') ? chatObj.username : 'empty'


        })
    }
    setTimeout(function () {
        json = JSON.stringify(usersData);
        fs.writeFile(dataPath, json, 'utf8', function (err) {
            if (err) throw err;
            console.log('complete');
        })
    }, 10000)
}

function adminObosratsaAllUsers(message, data, selfMybot) {
    var botId = '976224147'
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    var userArr = []
    for (e in usersData) {
        let userObj = usersData[e]
        let user = e
        let stickerId = userObj['stickerId']
        let stickerSetName = "test10" + user + "_by_kakakaFriendBot";

        if (!userObj.hasOwnProperty('isObosralsa')) { userObj['isObosralsa'] = false }

        if (!userObj['isObosralsa'] && userObj.rank > 3) {
            usersData['rank'] = usersData['rank'] - 3
            usersData[user]['isObosralsa'] = true;
            var img = fs.createReadStream(__dirname + '\\images' + '\\pokakal.png');
            selfMybot.addStickerToSet(botId, stickerSetName, img, "😂").then(() => {
                selfMybot.getStickerSet(stickerSetName).then((stickerObj) => {
                    var stickerInTrash = stickerObj.stickers[0].file_id
                    var stickerId = stickerObj.stickers[stickerObj.stickers.length - 1].file_id

                    selfMybot.sendSticker(user, stickerId).then(() => {
                        selfMybot.deleteStickerFromSet(stickerInTrash)
                    })
                    selfMybot.sendMessage(user, 'ОЙ, оёёй, оно само!(((💩💩💩 Настроение персонажа -3. /ubrat')
                    //usersData[userId] = { 'rank': rank, 'stickerId': stickerId }

                }, (err) => (console.log(err)))
            }, (err) => console.log(err));
        }
        setTimeout(function () {
            json = JSON.stringify(usersData)
            fs.writeFile(dataPath, json, 'utf8', function (err) {
                if (err) throw err;
                console.log('pokakali vse');
            })
        },5000)
    }
}
function ubratZaKotom(message, data, selfMybot){
    var botId = '976224147'
    var dataPath = __dirname + "\\data.json";
    var usersData;
    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    //console.log(usersData);
    var userId = "" + data.from.id;
    var stickerName = "test10" + userId + "_by_kakakaFriendBot";
    var title = "" + stickerName;
    var stickerId = usersData[userId]['stickerId']
    //console.log(usersData[userId][rank])
    if (+usersData[userId]['isObosralsa'] == true) {
        var rank = usersData[userId]['rank'];
        var img = fs.createReadStream(__dirname + '\\images' + '\\' + rank + '.png');
        selfMybot.addStickerToSet(botId, stickerName, img, "😂").then(() => {
            selfMybot.getStickerSet(stickerName).then((stickerObj) => {
                var stickerInTrash = stickerObj.stickers[0].file_id
                var stickerId = stickerObj.stickers[stickerObj.stickers.length - 1].file_id

                selfMybot.sendSticker(data.chat.id, stickerId).then(() => {
                    selfMybot.deleteStickerFromSet(stickerInTrash)
                })
                selfMybot.sendMessage(data.chat.id, '❤️Спасибо, мимими.❤️ Теперь тут приятней находиться))))))❤️❤️❤️')
                usersData[userId] = { 'rank': rank, 'isObosralsa': false }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            }, (err) => (console.log(err)))
        }, (err) => console.log(err));
    } else selfMybot.sendMessage(data.chat.id, '😡Что ты собрался тут убирать?????😡😡😡 Тут всегда только одни бабочки и пахнет радугой')
}