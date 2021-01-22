import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["node-package-modules", "package", "modules", "packages", "modules"],
    name: "npm",
    description: "See Node Package Module informations",
    usage: "{prefix}npm <package>"
})
export class NpmCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const query = args.join("+");
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const trimArray = (array: any[], length = 10) => {
            const len = array.length - length;
            const temp = array.slice(0, length);
            temp.push(`...${len} more.`);
            return temp;
        };
        if (!query) void message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Please provide the **Node Package Modules** name!"));
        try {
            const body: any = await this.client.request.get(`https://registry.npmjs.com/${query}`).json();
            const version = body.versions[body["dist-tags"].latest];
            let deps = version.dependencies ? Object.keys(version.dependencies) : null;
            let maintainers = body.maintainers.map((user: { name: any }) => user.name);
            if (maintainers.length > 10) maintainers = trimArray(maintainers);
            if (deps && deps.length > 10) deps = trimArray(deps);
            const embed = new MessageEmbed()
                .setColor("RED")
                .setAuthor(body.name, "https://i.imgur.com/ErKf5Y0.png")
                .setDescription(`**\`\`\`${body.description || "No Descriptions"}\`\`\`**
**Version:** ${body["dist-tags"].latest}
**License:** ${body.license}
**Modified:** ${new Date(body.time.modified).toDateString()}
**Author:** ${body.author ? body.author.name : "Unknown"}
**Maintainers:** ${maintainers?.length ? maintainers.map((x: string) => `\`${x}\``).join(", ") : "None"}
**Dependencies:** ${deps?.length ? deps.map(x => `\`${x}\``).join(", ") : "None"}
**Download:** **[${body.name}](https://www.npmjs.com/package/${query})**`);
            return message.channel.send(embed);
        } catch (e) {
            return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`<:no1:783266403776069673>  **|**  Error: \n\`\`\`ini\n${e.stack}\`\`\``));
        }
    }
}
