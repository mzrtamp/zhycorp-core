/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import moment from "moment";
require("moment-duration-format");

@DefineCommand({
    aliases: ["infoserver", "server", "servers", "sinfo"],
    name: "serverinfo",
    description: "Check the server information",
    usage: "{prefix}serverinfo [roles|avatar]"
})
export class ServerInfoCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        type verificationLevelsType = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
        const verificationLevels: Record<verificationLevelsType, string> = {
            HIGH: "High (Must also be a member of this server for longer than 10 minutes)",
            LOW: "Low (Must have a verified email on their Discord account)",
            MEDIUM: "Medium (Must also be registered on Discord for longer than 5 minutes)",
            NONE: "None (Unrestricted)",
            VERY_HIGH: "Highest (Must have a verified phone on their Discord account)"
        };
        type regionsName = "brazil" | "eu-central" | "eu-west" | "hongkong" | "japan" | "london" | "russia" | "singapore" | "sydney" | "us-central" | "us-east" | "us-south" | "us-west";
        const regions: Record<regionsName, string> = {
            brazil: "Brazil",
            "eu-central": "Central Europe",
            "eu-west": "Western Europe",
            hongkong: "Hongkong",
            japan: "Japan",
            london: "London",
            russia: "Russian",
            singapore: "Singapore",
            sydney: "Sydney",
            "us-central": "U.S. Central",
            "us-east": "U.S. East",
            "us-south": "U.S. South",
            "us-west": "U.S. West"
        };

        const TextChannels = message.guild!.channels.cache.filter(e => e.type !== "voice").size;
        const VoiceChannels = message.guild!.channels.cache.filter(e => e.type === "voice").size;
        const CategoryChannels = message.guild!.channels.cache.filter(e => e.type === "category").size;

        // const onlinem = message.guild.members.cache.filter(m => m.presence.status === "online").size.toLocaleString();
        const offlinem = message.guild!.members.cache.filter(m => m.presence.status === "offline").size.toLocaleString();
        const unique = message.guild!.members.cache.filter(m => m.presence.status !== "offline" && m.presence.status !== "online").size.toLocaleString();
        const idlem = message.guild!.members.cache.filter(m => m.presence.status === "idle").size;
        const disturbm = message.guild!.members.cache.filter(m => m.presence.status === "dnd").size;

        const sicon = message.guild!.iconURL({
            format: "png",
            dynamic: true,
            size: 2048
        });
        if (!args[0]) {
            const serverembed = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setThumbnail(sicon!)
                .setAuthor(`${message.guild!.name} - Discord Server`)
                .setDescription("You can type **`server roles`** to list the **server roles**,\nAnd also **`server avatar`** to show the **server icon**")
                .addField("**• OVERVIEW**", `\`\`\`asciidoc
• Name     :: ${message.guild!.name}
• ID       :: ${message.guild!.id}
• Region   :: ${regions[message.guild!.region as regionsName]}
• V. Level :: ${verificationLevels[message.guild!.verificationLevel]}\`\`\``)
                .addField("**• STATUS**", `\`\`\`asciidoc
• Roles    :: ${message.guild!.roles.cache.size}
• Channels :: [${message.guild!.channels.cache.size}]
           :: ${CategoryChannels} Category
           :: ${TextChannels} Text
           :: ${VoiceChannels} Voice
• Members  :: [${message.guild!.memberCount}]
           :: ${unique} Online
           :: ${idlem} Idle
           :: ${disturbm} Do Not Disturb
           :: ${offlinem} Invisible\`\`\``)
                .addField("**• ABOUT**", `\`\`\`asciidoc
• Owner    :: ${message.guild!.owner!.user.tag}
           :: ${message.guild!.owner!.user.id}
• Created  :: ${moment.utc(message.guild!.createdAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}\`\`\``)
                .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(serverembed);
        }

        if (args[0] === "roles") {
            const serverrolesembed = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setThumbnail(sicon!)
                .setAuthor(`${message.guild!.name} - Discord Server`)
                .addField(`**Server roles** [**${message.guild!.roles.cache.size}**]`, `${message.guild!.roles.cache.map(roles => roles).join("\n• ")}`, true)
                .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp();
            return message.channel.send(serverrolesembed);
        }

        if (args[0] === "avatar") {
            const avaServer = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setAuthor(`${message.guild!.name} - Server Icon`)
                .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL())
                .setImage(`${message.guild!.iconURL({ format: "png", dynamic: true, size: 2048 })}`)
                .setTimestamp();
            return message.channel.send(avaServer);
        }
    }
}
