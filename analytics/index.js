const data = require('./result.json')
const fs = require('fs');
const { head, last, take, takeLast, reduce, maxBy, sortBy, prop } = require('ramda')
const dayjs = require('dayjs')
const Az = require('az');
const { 
    getPeoplesByMessages, 
    getMessagesCountByPeople, 
    getTopByWords, 
    getMessagesCountByDate, 
    getMessagesCountByHour, 
    getMessagesCountByDay, 
    getTonByMessage, 
    extractMessagesText, 
    extractMessagesWordsText,
    modifyMessageToAnalytic,
    modifyMessagesToAnalytics
} = require('./functions')

const messages = data.messages;
// const messages = takeLast(100, data.messages);

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

async function testSentimental() {
    const preparted = await modifyMessagesToAnalytics(justMessages)

    const toxics = preparted.map(it => ({
        toxic: it.meta.sentimental.toxic.toxic,
        toxicSort: it.meta.sentimental.toxic.toxic * 100,
        message: it.text
    }));

    toxicsData = sortBy(prop('toxicSort'), toxics)

    console.log('toxics', takeLast(20, toxicsData));

    fs.writeFile("modifyMessagesToAnalytics.json", JSON.stringify(preparted), function(err) {
        if (err) {
            console.log(err);
        }
    });
}


testSentimental()
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
// const morph = Az.Morph.init('', () => {
//     ready++ && console.log(ready)

//     if (ready >= 10) {
//         console.log(Az.Morph('стали'))
//     }
// })


// TODO add to get top by words
        // const tokens = Az.Tokens('Бля у нас фронта на митинге в мск задержали, на 15 суток может в отпуск отъехать))').done()

        // let tokensArr = tokens.filter(it => String(it.type) === 'WORD').map(it => it.toString())
        // console.log('tokensArr', tokensArr);
        // let morphed = []

        // Az.Morph.init('node_modules/az/dicts', function() {
        //     morphed = tokensArr.map(it => {
        //         let parses = Az.Morph(it);
        //         let f = head(parses)

        //         if (f) {
        //             return f.normalize().word
        //         }

        //         return it
        //     })

        //     console.log(morphed.join(' '))
            
        // });
        // // console.log('tokens', tokens.map(it => it.type.toString()));

        // console.log('Бля у нас фронта на митинге в мск задержали, на 15 суток может в отпуск отъехать))');


