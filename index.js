const  { Telegraf } = require('telegraf');

const bot = new Telegraf('1588623310:AAEU4qS16CbQP74alYxWTL706MUSiQo0ncM');

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })

bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
  })

bot.start((ctx) => {})
bot.help((ctx) => {})

bot.on('message', (ctx) => {
    if (Boolean(ctx.update.message.voice)) {
        ctx.deleteMessage(ctx.update.message_id)
    }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))