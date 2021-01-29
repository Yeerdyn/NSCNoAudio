const data = require('./result.json')
const fs = require('fs');
const { head, last, take, takeLast } = require('ramda')
const dayjs = require('dayjs')
const { getPeoplesByMessages, 
    getMessagesCountByPeople, 
    getTopByWords, 
    getMessagesCountByDate, 
    getMessagesCountByHour, 
    getMessagesCountByDay, 
    getTonByMessage, 
    extractMessagesText, 
    extractMessagesWordsText
} = require('./functions')

const messages = data.messages;
// const messages = take(5, data.messages);

const firstMessageDate = new Date(head(messages).date)
const lastMessageDate = new Date(last(messages).date)


console.log('chat info', data.name, data.type, data.id);
console.log('messages', messages.length);
console.log('oldest message at', dayjs(firstMessageDate).format('DD/MM/YYYY HH:mm:ss'));
console.log('newest message at', dayjs(lastMessageDate).format('DD/MM/YYYY HH:mm:ss'));

console.log('------------------------------------------------');

let members = {};
let messagesPerPeopleData = []
let topByWords = []
let messagesByDate = []
let messagesByHour = []
let messagesByDay = []

let justMessages = messages.filter(item => item.type === 'message')

// members = getPeoplesByMessages(justMessages)
// messagesPerPeopleData = getMessagesCountByPeople(justMessages)
// topByWords = takeLast(100, getTopByWords(justMessages))
// messagesByDate = takeLast(100, getMessagesCountByDate(justMessages))
// messagesByHour = takeLast(100, getMessagesCountByHour(justMessages))
// messagesByDay = takeLast(100, getMessagesCountByDay(justMessages))
// console.log('members', members);
// console.log('messagesPerMembers', messagesPerPeopleData);
// console.log('topByWords', topByWords);
// console.log('messagesByDate', messagesByDate);
// console.log('messagesByHour', messagesByHour);
// console.log('messagesByDay', messagesByDay);

// fs.writeFile("topByWords.json", JSON.stringify(topByWords), function(err) {
//     if (err) {
//         console.log(err);
//     }
// });

// let rawMessages = extractMessagesText(justMessages)
// let rawWords = extractMessagesWordsText(justMessages)

// fs.writeFile("extractMessagesText.json", JSON.stringify(rawMessages), function(err) {
//     if (err) {
//         console.log(err);
//     }
// });


// fs.writeFile("extractWordsText.json", JSON.stringify(rawWords), function(err) {
//     if (err) {
//         console.log(err);
//     }
// });