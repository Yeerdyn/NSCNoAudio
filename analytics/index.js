const data = require('./result.json')
const { head, last } = require('ramda')

const messages = data.messages;


console.log('chat info', data.name, data.type, data.id);
console.log('messages', messages.length);
console.log('oldest message at', head(messages).date);
console.log('newest message at', last(messages).date);


console.log('------------------------------------------------');

let peoples = {};

messages.filter(item => item.type === 'message').forEach(message => {
    peoples[message.from_id] = message.from

    if (!message.from_id) {
        console.log('messages', message);
    }
});

console.log('peoples', peoples);