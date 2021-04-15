import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["h", "command", "commands", "cmd", "cmds"],
    name: "help",
    description: "Show the bot commands list",
    usage: "{prefix}help [command]"
})
export class HelpCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const command = message.client.commands.get(args[0]) ?? message.client.commands.get(message.client.commands.aliases.get(args[0])!);
        if (command) {
            message.channel.send(new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setAuthor(`Information of ${command.meta.name} command`, "https://hzmi.xyz/assets/images/question_mark.png")
                .addFields({ name: "Name", value: `**\`${command.meta.name}\`**`, inline: false },
                    { name: "Description", value: command.meta.description, inline: true },
                    { name: "Aliases", value: `${Number(command.meta.aliases?.length) > 0 ? command.meta.aliases?.map(c => `**\`${c}\`**`).join(", ") as string : "None."}`, inline: false },
                    { name: "Usage", value: `**\`${command.meta.usage?.replace(/{prefix}/g, message.client.config.prefix) as string}\`**`, inline: true })
                .setFooter(`<> = required | [] = optional ${command.meta.devOnly ? "(only my developers can use this command)" : ""}`, "https://cdn.discordapp.com/emojis/783266421912109076.png?v=1")).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        } else {
            const embed = new MessageEmbed()
                .setColor(this.client.config.embedColor)
                .setThumbnail("https://api.zhycorp.com/assets/images/logo.png")
                .setAuthor(`Command list of Zhycorp Core`, message.client.user?.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
                .setFooter(`Type ${message.client.config.prefix}help <command> for correct usage`, "https://cdn.discordapp.com/emojis/783266421912109076.png?v=1")
                .setTimestamp();
            for (const category of message.client.commands.categories.array()) {
                const isDev = this.client.config.devs.includes(message.author.id);
                const cmds = category.cmds.filter(c => isDev ? true : !c.meta.devOnly).map(c => `**\`${c.meta.name}\`**`);
                if (cmds.length === 0) continue;
                if (category.hide && !isDev) continue;
                embed.addField(`**${category.name}**`, cmds.join(", "));
            }
            return message.channel.send(embed).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        }
    }
}
