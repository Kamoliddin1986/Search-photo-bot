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
    }else if((text != '👍') && (text != '👎')) {
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

        
    }else if(text == '👍'){
        let liked_photos = read_file('like_photos.json')

        if(liked_photos.length>10){
            for(; liked_photos.length>10;){
                bot.sendMediaGroup(chatId,liked_photos.splice(0,9))
                liked_photos.splice(0,9)
            }
            bot.sendMediaGroup(chatId,liked_photos)
        }
        bot.sendMediaGroup(chatId,liked_photos)
    }else if(text == '👎'){
        let disliked_photos = read_file('dislike_photos.json')
        if(disliked_photos.length>10){
            for(; disliked_photos.length>10;){
                bot.sendMediaGroup(chatId,disliked_photos.splice(0,9))
                disliked_photos.splice(0,9)
            }
            bot.sendMediaGroup(chatId,disliked_photos)
        }
        bot.sendMediaGroup(chatId,disliked_photos)
    }

    
});

    bot.on('callback_query', msg => {
        let newPhoto = msg.message.photo[0].file_id
        let like_photos = read_file('like_photos.json')
        let dislike_photos = read_file('dislike_photos.json')
        let founded_dislike_photos = dislike_photos.find(photo => photo.media == newPhoto)
        let founded_like_photos = like_photos.find(photo => photo.media == newPhoto)
        if(msg.data == 'ok'){          

            if(!founded_like_photos){
                if(founded_dislike_photos){
                    dislike_photos.forEach((el,inx) => {
                        
                        if(el.media == newPhoto){
                            console.log("IF>>>>");
                            dislike_photos.splice(inx,1)
                        }
                        
                    });

                    write_to_file('dislike_photos.json',dislike_photos)

                }
                like_photos.push({
                    media: newPhoto,
                    type: 'photo'
                })
                write_to_file('like_photos.json',like_photos)
                return
            }else{
                
                return
            }  
                  
        }
        

            
            if(msg.data == 'nok'){
            if(!founded_dislike_photos){
                if(founded_like_photos){
                    like_photos.forEach((el,inx) => {
                        
                        if(el.media == newPhoto){
                            console.log("IF>>>>");
                            like_photos.splice(inx,1)
                        }
                        
                    });

                    write_to_file('like_photos.json',like_photos)

                }
                dislike_photos.push({
                    media: newPhoto,
                    type: 'photo'
                })
                write_to_file('dislike_photos.json',dislike_photos)
                return
            }else{
                return
            }              
        }
     
        })
    
    


 