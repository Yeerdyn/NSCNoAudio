const  { Telegraf } = require('telegraf');
require('dotenv').config();
const express = require('express')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })

bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    const from = ctx.message.from.first_name
    console.log('Response from: %s. Response time: %sms', from, ms)
  })

bot.start((ctx) => {})
bot.help((ctx) => {})

bot.on('message', (ctx) => {
    if (Boolean(ctx.update.message.voice)) {
        ctx.deleteMessage(ctx.update.message_id)
    }
})

bot.launch()


const app = express()
const port = process.env.APP_PORT

app.get('/', (req, res) => {
  res.send('Alive')
})

const instanse = app.listen(port)

process.once('SIGINT', () => {
  bot.stop('SIGINT')
  instanse.close();
})

process.once('SIGTERM', () => { 
  bot.stop('SIGTERM')
  instanse.close();
})