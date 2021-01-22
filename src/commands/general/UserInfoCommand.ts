/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["infouser", "user", "users", "uinfo"],
    name: "userinfo",
    description: "Check the user information",
    usage: "{prefix}userinfo [@mention|id]"
})
export class UserInfoCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const status = {
            dnd: "(Do Not Disturb)",
            idle: "(Idle)",
            invisible: "(Invisible)",
            offline: "(Invisible)",
            online: "(Online)"
        };
        const member = message.mentions.members!.first() ?? message.guild!.members.cache.get(args[0]) ?? message.member;
        const game = member!.presence.activities.find(x => x.type === "PLAYING");
        const embed = new MessageEmbed()
            .setColor(this.client.config.embedColor)
            .setThumbnail(member!.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
            .setAuthor(`${member!.user.username} - Discord User`)
            .addField("**• DETAILS**", `\`\`\`asciidoc
• Username :: ${member!.user.tag}
• ID       :: ${member!.user.id}
• Created  :: ${member!.user.createdAt}
• Joined   :: ${member!.joinedAt}\`\`\``)
            .addField("**• STATUS**", `\`\`\`asciidoc
• Type     :: ${member!.user.bot ? "Beep Boop, Boop Beep?" : "I'm Human."}
• Presence :: ${status[member!.user.presence.status]} ${game ? game.name : "No game detected."}\`\`\``)
            .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
        return message.channel.send(embed);
    }
}
