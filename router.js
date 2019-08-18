//module.exports.usersData = usersData
const fs = require('fs');



console.log('собираем модули...')
var userStart = require('./router/userStart')
console.log('...модули собраны')
module.exports.messageRouter = function messageRouter (message,data,selfMybot){
    switch(message){
        case '/start':
            console.log('сообщение определено как /start');
            start(message,data,selfMybot)
            break;
        case '/pokormit':
            pokormit(message,data,selfMybot)
            break;
    }
}
function pokormit(message,data,selfMybot){
    var dataPath = __dirname+"\\data.json";
    var usersData;
    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(usersData);
    var userId = ""+data.from.id;
    var name = "test"+userId+"_by_kakakaFriendBot";
    var title = ""+name;
    //console.log(usersData[userId][rank])
    if(+usersData[userId]['rank']<99){
        var rank = usersData[userId]['rank']+1;
        console.log('уровень пользователя'+rank)
        var img = fs.createReadStream(__dirname+'\\images'+'\\'+rank+'.png');
        var emojis = "👍";
        selfMybot.sendSticker(data.chat.id,img)
        usersData[userId]['rank'] = rank;
        json = JSON.stringify(usersData);
        fs.writeFile(dataPath, json, 'utf8',function(err) {
            if (err) throw err;
            console.log('complete');
            });
    }
}

function start(message,data,selfMybot){
    var dataPath = __dirname+"\\data.json"
    var usersData;

    usersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(usersData)
    var userId = ""+data.from.id;
    var name = "test"+userId+"_by_kakakaFriendBot";
    var title = ""+name;
    if(!usersData[userId]){
        
    console.log(__dirname)
    var img = fs.createReadStream(__dirname+'\\images'+'\\0.png')
    var emojis = "👍"
    //console.log(img)
    console.log("t.me/addstickers/"+name)
    try{
    selfMybot.createNewStickerSet(userId, name, title,img,emojis)} catch (e) {console.log("ошибка создания стикера || "+e)};
    selfMybot.sendSticker(data.chat.id,img)
    usersData[userId] = {'rank' : 0}
    json = JSON.stringify(usersData); //convert it back to json
    fs.writeFile(dataPath, json, 'utf8',function(err) {
        if (err) throw err;
        console.log('complete');
        });

    } else {console.log('этот пользователь уже стартанул')}
    //console.log(usersData)

}