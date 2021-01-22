import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import Blacklist from "../../utils/Models/Blacklist";

@DefineCommand({
    aliases: ["block"],
    name: "blacklist",
    description: "Blacklist someone from accessing this bot",
    usage: "{prefix}blacklist <@mention|id>"
})
export class BlacklistCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const toBlock = message.mentions.members!.first() ?? message.guild!.members.cache.get(args[0]) ?? this.client.users.cache.get(args[0]);
        if (!toBlock) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Invalid User"));
        if (this.client.config.devs.includes(toBlock.id)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Sorry, but you can't do that to yourself and other developers"));

        let bl = await Blacklist.findOne({ userID: toBlock.id });
        if (bl) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Sorry, but that user is already **blocked**"));

        const msg = await message.channel.send(new MessageEmbed().setColor(this.client.config.embedColor).setDescription(`<a:typing:591630043512569860>  **|**  **Blocking** <@${toBlock.id}>, please wait...`));
        setTimeout(async () => {
            if (!bl) {
                bl = new Blacklist({ userID: toBlock.id });
            }
            await bl.save();
            return msg.edit(new MessageEmbed().setColor("GREEN").setDescription(`<:yes1:783266376752168961>  **|**  Done, <@${toBlock.id}> will no longer able to use my commands.`));
        }, 1000);
    }
}
