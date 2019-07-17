const Discord = require('discord.js');
const client = new Discord.Client();
var apiai = require('apiai');
var config = require('./config');
var app = apiai(config.Dialogflow);
var animal = '';
var nouvelle = '';
//console.log(config);

// Connexion terminal
client.on('ready', function(){
    console.log("Je suis connecté =)");
    //console.log(client.user.username);
});

client.on('message', function(message){
        if((message.cleanContent.startsWith("@" + client.user.username) || message.channel.type == 'dm') && client.user.id != message.author.id){
        var mess = remove(client.user.username, message.cleanContent);
        console.log(mess);
        const user = message.author.id;
        var promise = new Promise(function(resolve, reject) {
            var request = app.textRequest(mess, {
                sessionId: user
            });
            request.on('response', function(response) {
                console.log(response);
                var rep = [response.result.fulfillment.speech,response.result.action,response.result.resolvedQuery]; // ajout des conditions de Dialogflow 
                resolve(rep);
            });

            request.on('error', function(error) {
                resolve(null);
            });

            request.end();
        });

        (async function(){
            var result = await promise;
            if(result){
                if(result[1] == "input.welcome")
                {
                    typingAndReply(message,result[0]+" "+message.author.username);
                }

                else if (result[1] == "input.adoption"){
                    typingAndReply(message,result[0]+" "+ 'https://www.woopets.fr/assets/races/000/006/screen/berger-allemand.jpg ' + ' http://www.lebonchat.fr/pics/chats/chat-potte-13039.jpg'); // affichage photo chien & chat
                }

                else if(result[1] =="input.nouvelle") // Prise de nouvelle
                {
                    typingAndReply(message,result[0]+" "+message.author.username);
                }

                else if(result[1] =="input.bye") // Fin de conversation, salutation
                {
                    typingAndReply(message,result[0]+" "+message.author.username);
                }

                else if(result[1] =="input.chat")
                {
                    typingAndReply(message,result[0]);
                    animal="chat";
                }

                else if(result[1] =="input.chien")
                {
                    typingAndReply(message,result[0]);
                    animal= "chien";
                }

                else {
                    adopter=false;
                    if(result[2]=='confirmer' && animal !== '')
                    {
                        typingAndReply(message,"Félicitation, vous venez d'adopter votre "+animal+' !');
                        animal='';
                        adopter=false;
                    }
                    else if(result[2]=='refuser')
                    {
                        typingAndReply(message,"Malheureusement vous n'adopter pas votre "+animal+ ' !');
                        animal='';
                        adopter=false;
                    }
                    else {
                    typingAndReply(message,result[0]);
                    }
                } 
            } 
            else{
                typingAndReply("nothing here");
            }
        }());

    }
});

function remove(username, text){
    return text.replace("@" + username + " ", "");
}

function typingAndReply(messageChannel, text)
{
    messageChannel.channel.startTyping();
    setTimeout(()=>{
        messageChannel.reply(text)
        messageChannel.channel.stopTyping();
    },2000)
}

client.login(config.Discord);