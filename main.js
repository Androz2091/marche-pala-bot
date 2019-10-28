/* A simple bot that takes commands */

const Discord = require("discord.js"),
client = new Discord.Client();

const config = require("./config.js");

client.login(config.token);

client.on("ready", () => {
    console.log("[!] Logged in as "+client.user.tag+" in "+client.guilds.size+" servers.");
    client.channels.get(config.cmdChannel).messages.fetch();
});

client.on("message", (message) => {
    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(config.prefix)) return;
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    if(command === "commande"){
        let itemToCommand = args.join(" ");
        let embed = new Discord.MessageEmbed()
        .setAuthor("💎 | Commande")
        .addField(`${message.author.username} souhaite`, itemToCommand)
        .setFooter(`Commande ID: ${message.author.id}`)
        .setColor("#7289DA");
        client.channels.get(config.cmdChannel).send(embed).then((m) => m.react(config.emoji));
        message.channel.send("Votre commande a été prise en compte, vous serez recontacté dans les plus brefs délais");
    }
});

client.on("messageReactionAdd", (reaction, user) => {
    if(reaction.message.channel.id !== config.cmdChannel) return;
    if(user.bot) return;
    let embed = reaction.message.embeds[0];
    if(!embed) return;
    if(embed.fields.length > 1) return;
    let memberID = embed.footer.text.substr("Commande ID: ".length, embed.footer.text.length);
    if(!memberID) return;
    reaction.message.guild.members.fetch(memberID).then((member) => {
        member.send(`Votre commande de ${embed.fields[0].value} a été prise en charge par ${user.tag} !`);
        embed.fields.push({
            name: "pris en charge par",
            value: user.tag
        });
        reaction.message.edit(embed);
        reaction.message.reactions.removeAll();
    }).catch(() => {});
});

/* By Androz2091 */