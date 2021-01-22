import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed, version } from "discord.js";
import os, { uptime as osUptime } from "os";
import path from "path";
import { formatMS } from "../../utils/formatMS";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";

@DefineCommand({
    aliases: ["statistic", "status"],
    name: "stats",
    description: "Shows the bot statistic",
    usage: "{prefix}stats"
})
export class StatsCommand extends BaseCommand {
    public async execute(message: IMessage): Promise<any> {
        const embed = new MessageEmbed()
            .setColor(this.client.config.embedColor)
            .setThumbnail("https://api.zhycorp.com/assets/images/logo.png")
            .setAuthor(`${this.client.user?.username as string} - Zhycorp Nation's Servant Bot`, this.client.user?.displayAvatarURL())
            .addField("**• STATIC**", `
***\`\`\`asciidoc
Users           :: ${await this.client.getUsersCount()}
Servers         :: ${await this.client.getChannelsCount()}
Channels        :: ${await this.client.getGuildsCount()}
Shards          :: ${this.client.shard ? `${this.client.shard.count}` : "N/A"} - ID ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"}
Node.JS         :: ${process.version}
Discord.JS      :: v${version}
Bot Version     :: v${(await import(path.join(process.cwd(), "package.json"))).version}
\`\`\`***`)
            .addField("**• ENGINES**", `
***\`\`\`asciidoc
WS Ping         :: ${this.client.ws.ping.toFixed(0)} ms
CPU Usage       :: N/A
Mem. Usage      :: ${this.bytesToSize(await this.client.getTotalMemory("rss"))}
Platform - Arch :: ${process.platform} - ${process.arch}
Processor       :: ${os.cpus().length}x ${os.cpus()[0].model}
\`\`\`***`)
            .addField("**• UPTIMES**", `
***\`\`\`asciidoc
Bot             :: ${formatMS(this.client.uptime!)}
Process         :: ${formatMS(process.uptime() * 1000)}
O/S             :: ${formatMS(osUptime() * 1000)}
\`\`\`***`)
            .setFooter(`Replying to: ${message.author.tag}`, message.author.displayAvatarURL());
        return message.channel.send(embed)
            .catch(e => this.client.logger.error("ABOUT_CMD_ERR:", e));
    }

    private bytesToSize(bytes: number): string {
        if (isNaN(bytes) && bytes !== 0) throw new Error(`[bytesToSize] (bytes) Error: bytes is not a Number/Integer, received: ${typeof bytes}`);
        const sizes: string[] = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
        if (bytes < 2 && bytes > 0) return `${bytes} Byte`;
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
        if (i === 0) return `${bytes} ${sizes[i]}`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (sizes[i] === undefined) return `${bytes} ${sizes[sizes.length - 1]}`;
        return `${Number(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
}
