const data = require('./result.json')
const { head, last, take, takeLast } = require('ramda')
const dayjs = require('dayjs')
const { getPeoplesByMessages, getMessagesCountByPeople, getTopByWords } = require('./functions')

const messages = data.messages;
// const messages = take(100, data.messages);

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

let justMessages = messages.filter(item => item.type === 'message')

members = getPeoplesByMessages(justMessages)
messagesPerPeopleData = getMessagesCountByPeople(justMessages)
topByWords = getTopByWords(messages)

console.log('members', members);
console.log('messagesPerMembers', messagesPerPeopleData);
console.log('topByWords', takeLast(20, topByWords));