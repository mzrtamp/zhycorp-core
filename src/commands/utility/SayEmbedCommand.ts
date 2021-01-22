/* eslint-disable no-negated-condition */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed, MessageAttachment, TextChannel } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import moment from "moment";

@DefineCommand({
    aliases: ["saidembed", "saysembed", "bilangembed"],
    name: "sayembed",
    description: "Makes the bot say something in embed",
    usage: "{prefix}sayembed <message>"
})
export class SayEmbedCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        if (!message.member!.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`<:no1:783266403776069673>  **|**  <@${message.author.id}> Sorry, but you can't do that`));
        if (!message.guild!.me!.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`<:no1:783266403776069673>  **|**  <@${message.author.id}> Sorry, but I don't have a **\`MANAGE MESSAGES\`** permission`));

        const re = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gi.exec(message.cleanContent);
        if (re !== null) {
            if (!message.member!.hasPermission("MANAGE_GUILD")) return;
            await message.delete().then(msg => msg.channel.send(new MessageEmbed().setColor("RED").setDescription(`<:error:591629649231216640>  **|**  Sorry <@${message.author.id}>, please **do not advertise any Discord servers** here`)).then(msg => {
                this.client.logger.info(`[InviteLinkBlocker] ${message.author.tag} [${message.author.id}] was trying to post some invite links, but I have blocked them`);
                return msg.delete({ timeout: 3500 });
            }).catch());
        }

        const botmessage = args.join(" ");

        if ((message.attachments.first() as any) !== undefined) {
            const attachment = new MessageAttachment((message.attachments.first() as any).url);
            const attachmentCache = (this.client.channels.cache.get("592006547182452757") as TextChannel)!.send(`**${message.author.tag} [\`${message.author.id}\`]** at: ${moment().format("dddd, MMMM Do YYYY, h:mm A")} | GMT+0000 (Coordinated Universal Time) runs Say Embed Command with attachments`, attachment);
            const gambar = attachmentCache ? `${((await attachmentCache).attachments.first() as any).url}` : undefined;

            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(botmessage);
            if (botmessage) embed.setDescription(botmessage);
            if (gambar !== undefined) embed.setImage(gambar);
            void message.channel.send(embed);
        } else {
            void message.channel.send(new MessageEmbed().setColor("RANDOM").setDescription(botmessage));
        }
        return message.delete();
    }
}
