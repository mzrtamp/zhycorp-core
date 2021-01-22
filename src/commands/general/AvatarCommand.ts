import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["ava", "icon", "pfp", "pp"],
    name: "avatar",
    description: "Check someone's avatar",
    usage: "{prefix}avatar [@mention|id]"
})
export class AvatarCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        if (args[0] === "server") {
            const avaServer = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setAuthor(`${message.guild!.name} - Server Icon`)
                .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                .setImage(`${message.guild!.iconURL({ format: "png", dynamic: true, size: 2048 })}`);
            void message.channel.send(avaServer);
        } else {
            const member = message.mentions.members!.first() ?? message.guild!.members.cache.get(args[0]) ?? message.member;
            const ava = member!.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 });
            const embed = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setAuthor(`${member!.user.username}'s avatar`)
                .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
                .setImage(ava);
            if (ava.split(".").pop() === "gif") {
                embed.setImage(`${ava}?size=2048`);
                message.channel.send(embed).catch(e => this.client.logger.error("PROMISE_ERR:", e));
            }
            return message.channel.send(embed).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        }
    }
}
