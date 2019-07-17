
const Discord = require('discord.js');
const bot = new Discord.Client();
const https = require('https');
var cron = require('node-cron');

var cooldown = false;

var servers = [];


bot.on('ready', function () {
    console.log("Je suis connecté !");
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.on('message', message => {
    if (!servers.includes(message.guild.id)) {
        servers.push(message.guild.id);
        console.log("server added to list")
    }
    if (message.content === "meme" && message.channel.name === "meme") {
        if (!message.member.roles.some(role => role.name === 'HydraeTeam')) {
            message.reply("Oopsi tu n'as pas la permission");
        } else {
            if (cooldown === true)
            {
                return message.reply("Je ne peux générer de meme que toutes les 30 secondes (⌐□_□)");
            }

            memeGenerator(message.channel);
            cooldown = true;
            setTimeout(() => {
                // Removes the user from the set after 2.5 seconds
                cooldown = false;
                console.log('cooldown finish')
            }, 30000);
        }
    } else if (message.content === "dev") {
        // console.log(message.member.user);
        console.log(message.channel.name)
    }
});

bot.login('NjAwMzA3MTY1NjgwNTAwNzQ3.XSx4Gw.GPzPe3VIAXTASCn0DQpwbybtvrE');

// function memeGenerator(channel) {
//     var url = 'https://www.reddit.com/r/dankmemes/new.json?sort=hot';

//     https.get(url, function (res) {
//         var body = '';

//         var random = Math.floor(Math.random() * 15) + 1;

//         res.on('data', function (chunk) {
//             body += chunk;
//         });

//         res.on('end', function () {
//             channel.send(JSON.parse(body).data.children[random].data.url);
//         });
//     })
// }