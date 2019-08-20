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
        case '/adminUpdateDataJson':
            adminUpdateDataJson(message, data, selfMybot)
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
                var stickerId = stickerObj.stickers[stickerObj.stickers.length-1].file_id
                
                selfMybot.sendSticker(data.chat.id, stickerId).then(()=>{
                    selfMybot.deleteStickerFromSet(stickerInTrash)
                })
                selfMybot.sendMessage(data.chat.id,'МММММ, как вкусно, теперь мой уровень '+rank+' . Корми меня дальше чтобы я рос /pokormit')
                usersData[userId] = { 'rank': rank, 'stickerId': stickerId }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            },(err)=>(console.log(err)))
        }, (err) => console.log(err));
    } else selfMybot.sendMessage(data.chat.id,'Спасибо, но я уже наелся😐')
}

function start(message, data, selfMybot) {
    var dataPath = __dirname + "\\data.json"
    var usersData;

    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(usersData)
    var userId = "" + data.from.id;
    var stickerName = "test10" + userId + "_by_kakakaFriendBot";
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
                selfMybot.sendMessage(data.chat.id,'Привет,я твой новый друг и ты меня найдешь в этом стикер паке. Чтобы покормить меня отправь /pokormit')
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

function adminSendMessageAll(message, data, selfMybot){
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    var text = fs.readFileSync(__dirname+"\\text.txt", 'utf8')
    //var usersArr = usersData.arr;
    for(e in usersData){
        console.log('send to '+e + '||text: ' +text)
        selfMybot.sendMessage(e,text)
    }
}

function adminUpdateDataJson(message, data, selfMybot){
    var botId = '976224147'
    var stickerArr = [];
    var dataPath = __dirname + "\\data.json"
    var usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    for(user in usersData){
        var stickerName = "test10" + user + "_by_kakakaFriendBot";
        var rank = usersData[user]['rank'];
        console.log('уровень пользователя' + rank);
        var img = fs.createReadStream(__dirname + '\\images' + '\\' + rank + '.png');
        selfMybot.addStickerToSet(botId, stickerName, img, "😂").then(() => {
            selfMybot.getStickerSet(stickerName).then((stickerObj) => {
                var stickerId = stickerObj.stickers[stickerObj.stickers.length-1].file_id
                //selfMybot.sendSticker(data.chat.id, stickerId)
                //selfMybot.sendMessage(data.chat.id,'МММММ, как вкусно, теперь мой уровень '+rank+' . Корми меня дальше чтобы я рос /pokormit')
                usersData[user] = { 'rank': rank, 'stickerId': stickerId }
                json = JSON.stringify(usersData);
                fs.writeFile(dataPath, json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                })
            },(err)=>(console.log(err)))
        }, (err) => console.log(err));
    
    }
    
    
}