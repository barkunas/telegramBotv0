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
    }
}
function pokormit(message, data, selfMybot) {
    var botId = '976224147'
    var dataPath = __dirname + "\\data.json";
    var usersData;
    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(usersData);
    var userId = "" + data.from.id;
    var stickerName = "test9" + userId + "_by_kakakaFriendBot";
    var title = "" + stickerName;
    var stickerId = usersData[userId]['stickerId']
    //console.log(usersData[userId][rank])
    if (+usersData[userId]['rank'] < 99) {
        var rank = usersData[userId]['rank'] + 1;
        console.log('уровень пользователя' + rank);
        var img = fs.createReadStream(__dirname + '\\images' + '\\' + rank + '.png');
        selfMybot.addStickerToSet(botId, stickerName, img, "😂").then(() => {
            selfMybot.getStickerSet(stickerName).then((stickerObj) => {
                var stickerId = stickerObj.stickers[stickerObj.stickers.length-1].file_id
                selfMybot.sendSticker(data.chat.id, stickerId)
                usersData[userId] = { 'rank': rank, 'stickerId': stickerId }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            },(err)=>(console.log(err)))
        }, (err) => console.log(err));
    }
}

function start(message, data, selfMybot) {
    var dataPath = __dirname + "\\data.json"
    var usersData;

    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(usersData)
    var userId = "" + data.from.id;
    var stickerName = "test9" + userId + "_by_kakakaFriendBot";
    var stickerNameTemp = stickerName
    var title = "" + stickerName;
    if (!usersData[userId]) {

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
                usersData[userId] = { 'rank': 0, 'stickerId': stickerId }
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