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
    let userId = msg.from.id
    console.log(msg);
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
    }else if(text == '👍'){
        let all_liked_photos = read_file('like_photos.json')
        let liked_photos = all_liked_photos.filter(like => like.userId == userId)
        if(liked_photos.length>10){
            for(; liked_photos.length>10;){
                bot.sendMediaGroup(chatId,liked_photos.slice(0,9))
                liked_photos.splice(0,9)
            }
            bot.sendMediaGroup(chatId,liked_photos)
        }else{

            bot.sendMediaGroup(chatId,liked_photos)
        }
    }else if(text == '👎'){
        let all_disliked_photos = read_file('dislike_photos.json')
        let disliked_photos = all_disliked_photos.filter(dislike => dislike.userId == userId)
        console.log(disliked_photos.length)
        if(disliked_photos.length>10){
            for(; disliked_photos.length>10;){
                bot.sendMediaGroup(chatId,disliked_photos.slice(0,9))
                disliked_photos.splice(0,9)
            }
            console.log(disliked_photos.length)
            bot.sendMediaGroup(chatId,disliked_photos)
        }else{

            bot.sendMediaGroup(chatId,disliked_photos)
        }
    }else{
  

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

        
    }

    
});

    bot.on('callback_query', msg => {
        console.log(msg);
        let userId = msg.from.id
        let newPhoto = msg.message.photo[0].file_id
        let like_photos = read_file('like_photos.json')
        let dislike_photos = read_file('dislike_photos.json')
        let founded_dislike_photos = dislike_photos.find(photo => (photo.media == newPhoto && photo.userId == userId))
        let founded_like_photos = like_photos.find(photo => (photo.media == newPhoto && photo.userId == userId))
        if(msg.data == 'ok'){          

            if(!founded_like_photos){
                if(founded_dislike_photos){
                    dislike_photos.forEach((el,inx) => {
                        
                        if(el.media == newPhoto && el.userId == userId){

                            dislike_photos.splice(inx,1)
                        }
                        
                    });

                    write_to_file('dislike_photos.json',dislike_photos)
                    return

                }
                like_photos.push({
                    media: newPhoto,
                    type: 'photo',
                    userId 
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
                        
                        if(el.media == newPhoto && el.userId == userId){

                            like_photos.splice(inx,1)
                        }
                        
                    });

                    write_to_file('like_photos.json',like_photos)
                    return

                }
                dislike_photos.push({
                    media: newPhoto,
                    type: 'photo',
                    userId 
                })
                write_to_file('dislike_photos.json',dislike_photos)
                return
            }else{
                return
            }              
        }
     
        })
    
    


 