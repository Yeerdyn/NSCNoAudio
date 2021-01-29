const { sortBy, prop, flatten } = require('ramda')

function getPeoplesByMessages(messages) {
    let peoples = {};

    messages.forEach(message => {
        peoples[message.from_id] = message.from
    });

    return peoples
}


function getMessagesCountByPeople(messages) {
    let peoples = getPeoplesByMessages(messages)
    let messagesPerPeopleIds = {}
    let messagesPerPeopleData = []

    messages.forEach(message => {
        if (Object.keys(messagesPerPeopleIds).includes(String(message.from_id))) {
            messagesPerPeopleIds[message.from_id] = messagesPerPeopleIds[message.from_id] + 1
        } else {
            messagesPerPeopleIds[message.from_id] = 1
        }
    });

    messagesPerPeopleData = Object.keys(messagesPerPeopleIds).map(key => ({
        name: peoples[key],
        messages: messagesPerPeopleIds[key]
    }))
   
   messagesPerPeopleData = sortBy(prop('messages'), messagesPerPeopleData)

    return messagesPerPeopleData
}

function normalizeMessage(text){
    if (typeof text === 'string') {
        return text
        .toLowerCase()
        .replace(/[^a-zA-Zа-яА-я\s]+/g, '')
        .replace('  ', ' ')
        .trim()
    }

    return ''
}

function getTopByWords(messages) {
    let words = {}
    let normalMessages = messages
    .map(item => normalizeMessage(item.text))
    .filter(item => item !== '')

    let preparedWords = flatten(normalMessages.map(item => item.split(' ')))

    preparedWords.forEach(word => {
        if (Object.keys(words).includes(word)) {
            words[word] = words[word] + 1
        } else {
            words[word] = 1
        }
    });

    let wordsData = Object.keys(words).map(key => ({
        word: key,
        count: words[key]
    }))

    wordsData = sortBy(prop('count'), wordsData)

    return wordsData
}


module.exports = {
    getPeoplesByMessages,
    getMessagesCountByPeople,
    normalizeMessage,
    getTopByWords
}