import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["documentation", "discord.js", "discordjs", "djs", "djsdocs"],
    name: "docs",
    description: "View the Discord.JS documentations",
    usage: "{prefix}docs [branch]"
})
export class DocsCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const sources = ["stable", "master", "rpc", "commando", "akairo", "akairo-master", "collection", "11.5.1", "11.6.4"];
        try {
            if (!args.length) {
                return message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Please provide a query!"));
            }
            const query = args[0];
            let source = args[1] ? args[1].toLowerCase() : "stable";
            if (!sources.includes(source)) void message.channel.send(new MessageEmbed().setColor(this.client.config.embedColor).setDescription(`<:info1:783266421912109076>  **|**  Valid sources are: ${sources.map(x => `\`${x}\``).join(", ")}`));
            if (source === "11.5.1" || source === "11.6.4") {
                source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
            }
            const embed = await this.client.request.get("https://djsdocs.sorta.moe/v2/embed", { searchParams: { src: source, q: query } }).json();
            return message.channel.send({ embed });
        } catch (err) {
            return message.channel.send(err.message);
        }
    }
}
