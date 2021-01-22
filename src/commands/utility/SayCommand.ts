/* eslint-disable no-negated-condition */
import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed, MessageAttachment } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["said", "says", "bilang"],
    name: "say",
    description: "Makes the bot say something",
    usage: "{prefix}say <message>"
})
export class SayCommand extends BaseCommand {
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
            if (!botmessage) {
                void message.channel.send(attachment);
            } else {
                void message.channel.send(botmessage, attachment);
            }
        } else {
            void message.channel.send(botmessage);
        }
        return message.delete();
    }
}
