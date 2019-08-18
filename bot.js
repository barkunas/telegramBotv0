process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.NTBA_FIX_319 = 1;
var TelegramBot = require('node-telegram-bot-api');

var userData = {}

var token = '976224147:AAGkrKkqAwWVHZUgFp_O7WePkJVnj08lbEA';

var myBot = new TelegramBot(token, { polling: true });



var router = require('./router')

myBot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  console.log(JSON.stringify(msg))
  var testText
  myBot.sendMessage(chatId, resp);
});


myBot.on('message', function (msg) {
  var selfMybot = this
  var chatId = msg.chat.id;
  var text = msg.text
  try {
    //console.log(router.messageRouter)
    router.messageRouter(text, msg, selfMybot)
  } catch (e) { console.log(e) }
  console.log(JSON.stringify('сообщение от ' + chatId + "||текст - " + text + "||"))

});



