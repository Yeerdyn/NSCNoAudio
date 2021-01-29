const { sortBy, prop, flatten, head, last, uniq } = require('ramda')
const cliProgress = require('cli-progress');
const natural = require('natural')
const wordsInBlackList = require('stopwords-ru') 
const dayjs = require('dayjs')
const sentimentalVocab = require('./vocab.json')
require('dayjs/locale/ru')

const sentimental = require('Sentimental');

const { WordTokenizer } = natural;
const tokenizer = new WordTokenizer();

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
        .replace(/\n/g, '')
        .replace('  ', ' ')
        .trim()
    }

    return ''
}

function createCliProgressBar(processName) {
    return new cliProgress.SingleBar({
        format: `${processName} | {bar} | {percentage}% || {value}/{total}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });
}

function wordIsTrash(word){
    return wordsInBlackList.includes(word)
}

function tokenizeWords(text){
    return tokenizer.tokenize(text);
}

function getTopByWords(messages) {
    const b1 = createCliProgressBar('Messages normalization')
    const b2 = createCliProgressBar('Analize word count    ')
    const b3 = createCliProgressBar('Format statistic      ')

    let words = {}

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    let normalMessages = messages
    .map((item, index) => { 
        b1.update(index + 1);
        return normalizeMessage(item.text)
    })
    .filter(item => item !== '')

    let preparedWords = flatten(normalMessages.map(tokenizeWords))

    b1.stop();

    b2.start(preparedWords.length, 0, {
        speed: "N/A"
    });
    preparedWords.forEach((word, index) => {
        if (wordIsTrash(word)) {
            return
        }

        if (Object.keys(words).includes(word)) {
            words[word] = words[word] + 1
        } else {
            words[word] = 1
        }
        b2.update(index + 1);
    });
    b2.stop();

    b3.start(Object.keys(words).length, 0, {
        speed: "N/A"
    });

    let wordsData = Object.keys(words).map((key, index) => {
        b3.update(index + 1)
        return {
            word: key,
            count: words[key]
        }
    })

    wordsData = sortBy(prop('count'), wordsData)

    b3.stop();

    return wordsData
}

function getMessagesCountByDate(messages){
    let dates = {}
    let b1 = createCliProgressBar('Analize messages count by date')

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    messages.forEach((message, index) => {
        let date = head(message.date.split('T'))

        if (Object.keys(dates).includes(date)) {
            dates[date] = dates[date] + 1
        } else {
            dates[date] = 1
        }

        b1.update(index + 1)
    })

    b1.stop();

    datesData = Object.keys(dates).map(key => ({
        date: key,
        messages: dates[key]
    }))

    datesData = sortBy(prop('messages'), datesData)

    return datesData
}

function getMessagesCountByHour(messages){
    let hours = {}
    let b1 = createCliProgressBar('Analize messages count by hour')

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    messages.forEach((message, index) => {
        let hour = head(last(message.date.split('T')).split(':'))

        if (Object.keys(hours).includes(hour)) {
            hours[hour] = hours[hour] + 1
        } else {
            hours[hour] = 1
        }

        b1.update(index + 1)
    })

    b1.stop();

    hoursData = Object.keys(hours).map(key => ({
        hour: key,
        messages: hours[key]
    }))

    hoursData = sortBy(prop('messages'), hoursData)

    return hoursData
}

function getMessagesCountByDay(messages){
    let days = {}
    let b1 = createCliProgressBar('Analize messages count by day')

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    messages.forEach((message, index) => {
        let day = dayjs(message.date).locale('ru').format('dddd')

        if (Object.keys(days).includes(day)) {
            days[day] = days[day] + 1
        } else {
            days[day] = 1
        }

        b1.update(index + 1)
    })

    b1.stop();

    daysData = Object.keys(days).map(key => ({
        day: key,
        messages: days[key]
    }))

    daysData = sortBy(prop('messages'), daysData)

    return daysData
}

function analizeWord(word){
    let hasTon = sentimentalVocab.hasOwnProperty(word)

    if (hasTon) {
        return sentimentalVocab[word]
    }

    return 0
}

function getTonByMessage(message) {
    const normilizedMessage = normalizeMessage(message)
    const words = tokenizeWords(normilizedMessage)

    let ton = 0;
    let hits = 0;

    words.forEach(word => {
        let score = analizeWord(word)
        ton += score
        if (score !== 0) {
            hits+=1
        }
    })

    return {
        score: ton,
        hits,
        compatibility: hits/words.length * 100
    }
}

function extractMessagesText(messages) {
    let b1 = createCliProgressBar('Extract messages to raw format')

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    let rawMessages = messages.map((message, index) => {
        b1.update(index + 1)

        if (typeof message.text === 'string') {
            return message.text
        }

        return ''
    }).filter(item => String(item).trim() !== '')

    b1.stop();

    return rawMessages
}

function extractMessagesWordsText(messages) {
    let b1 = createCliProgressBar('Extract messages words to raw format')

    b1.start(messages.length, 0, {
        speed: "N/A"
    });

    let rawMessages = flatten(messages.map((message, index) => {
        b1.update(index + 1)

        if (typeof message.text === 'string') {
            return tokenizeWords(message.text)
        }

        return []
    })).filter(it => !wordIsTrash(it))

    b1.stop();

    return uniq(rawMessages)
}

module.exports = {
    getPeoplesByMessages,
    getMessagesCountByPeople,
    normalizeMessage,
    getTopByWords,
    tokenizeWords,
    wordIsTrash,
    getMessagesCountByDate,
    getMessagesCountByHour,
    getMessagesCountByDay,
    getTonByMessage,
    extractMessagesText,
    extractMessagesWordsText,
}