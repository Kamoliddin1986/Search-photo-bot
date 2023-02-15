const {request} = require('http')
require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
let num =3
const bot = new TelegramBot(process.env.TG_TOKEN,{
    polling:true,
})
bot.on('polling_error', msg => console.log(msg))

bot.on ('message', async(msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    if(msg.text == '/start'){
        bot.sendMessage(chatId, `Salom, Ingliz tilida so'z kiriting!!!`, {
           reply_markup: JSON.stringify({
            keyboard: [
                [
                    {
                        text: '👍'
                    },
                    {
                        text: '👎'
                    } 

                ]
            ],
            resize_keyboard: true
           }) 
        })
    }else{
        bot.sendMessage(chatId, msg.txt, {
            reply_markup: JSON.stringify({
             keyboard: [
                 [
                     {
                         text: '👍'
                     },
                     {
                         text: '👎'
                     } 
 
                 ]
             ]
            }) 
         })

         let result = await fetch(`https://api.pexels.com/v1/search?query=${text}&per_page=5`)
         let obj = await result.json()
         let {photos} = obj
         for(let one of photos){
             bot.sendPhoto(chatId, one.url, {
                reply_markup: {
                    inline_keyboard:
                    [
                        [
                            {
                                text: '👍',
                                callback_data: 'ok'
                            },
                            {
                                text: '👎',
                                callback_data: 'nok'
                            }   
                        ]
                    ]
                }
                
            })
        }
        
        console.log(photos);
    }
})


// if(msg.text == 'Lavash'){
//     bot.sendPhoto(msg.chat.id, 'https://static.1000.menu/res/640/img/content-v2/43/f0/42850/farshirovannyi-lavash-v-duxovke_1580382171_10_max.jpg', {
//         caption: `
//          <strong>Lavash</strong>
//          <i class="tg-spoiler">24000</i>
//          <span class="tg-spoiler">Katta va kichik lavash...</span>
//         `,
//         parse_mode: "HTML",
//         reply_markup:{
//             inline_keyboard: [
//                 [
//                     {
//                         text: "Zakaz berish",
//                         callback_data: "zakaz"
//                     },
//                     {
//                         text: "batafsil",
//                         url: 'https://www.npmjs.com/package/node-telegram-bot-api'
//                     }
//                 ]
//             ]
//         }
//     })

// }



// bot.on("callback_query", msg => {
//     if(msg.data == 'zakaz'){
//         bot.sendMessage(msg.message.chat.id, 'Kontaktinggizni ulashing', {
//             reply_markup: JSON.stringify({
//                 keyboard: [
//                     [
//                         {
//                             text: 'Contact berish',
//                             request_contact: true
//                         },
//                         {
//                             text: 'Locatsiyani berish',
//                             request_location: true
//                         }
//                     ]
//                 ],
//                 resize_keyboard: true
//             })
//         })
//     }
// })


