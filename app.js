const {request} = require('http')
require('dotenv').config()

const{read_file,write_to_file}=require('./api/api')

const TelegramBot = require('node-telegram-bot-api')
let num =3
const bot = new TelegramBot(process.env.TG_TOKEN,{
    polling:true,
})
bot.on('polling_error', msg => console.log(msg))

bot.on ('message', async(msg) => {
    let chatId = msg.chat.id
    let text = msg.text
    
    if(text == '/start'){
       
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
    }else if((text != '👍') && (text != '👍')) {
        bot.sendMessage(chatId, msg.text, {
            reply_markup: JSON.stringify({
             keyboard: [
                 [
                     {
                         text: '👍',
                         callback_data: "liked_photos"
                     },
                     {
                         text: '👎',
                         callback_data: "disliked_photos"
                     } 
 
                 ]
             ],
             resize_keyboard: true
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

        
    }else{
        bot.sendPhoto(chatId)
    }

    
});

    bot.on('callback_query', msg => {
        let newPhoto = msg.message.photo[0].file_id
        let like_photos = read_file('like_photos.json')
        if(msg.data == 'ok'){
            console.log(msg,`<<<ok>>>`);

            let founded_like_photos = like_photos.find(photo => photo.file_id == newPhoto)
            if(!founded_like_photos){
                like_photos.push({
                    file_id: newPhoto,
                    num: like_photos.length +1
                })
                write_to_file('like_photos.json',like_photos)
                return
            }else{
                return
            }  
                  
        }
        

            let dislike_photos = read_file('dislike_photos.json')
            
            if(msg.data == 'nok'){
            let founded_dislike_photos = dislike_photos.find(photo => photo.file_id == newPhoto)
            if(!founded_dislike_photos){
                dislike_photos.push({
                    file_id: newPhoto,
                    num: dislike_photos.length +1
                })
                write_to_file('dislike_photos.json',dislike_photos)
                return
            }else{
                return
            }              
        }
     
        })
    
    


 