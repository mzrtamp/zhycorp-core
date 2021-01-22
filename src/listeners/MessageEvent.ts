import { MessageEmbed, User } from "discord.js";
import { IMessage } from "../typings";
import { DefineListener } from "../utils/decorators/DefineListener";
import { BaseListener } from "../structures/BaseListener";
import Blacklist from "../utils/Models/Blacklist";

@DefineListener("message")
export class MessageEvent extends BaseListener {
    public async execute(message: IMessage): Promise<any> {
        const bl = await Blacklist.find();
        for (const black of bl as any) {
            if (black.userID === message.author.id) return;
        }

        if (message.author.bot || message.channel.type === "dm") return message;

        if (message.content.startsWith(this.client.config.prefix)) return this.client.commands.handle(message);

        if ((await this.getUserFromMention(message.content))?.id === this.client.user?.id) {
            message.channel.send(
                new MessageEmbed()
                    .setAuthor(this.client.user?.username, this.client.user?.displayAvatarURL())
                    .setColor(this.client.config.embedColor)
                    .setDescription(`<a:blobWave:666135462020382721>  **|**  Hi ${message.author.username}, my prefix is **\`${this.client.config.prefix}\`**`)
                    .setTimestamp()
            ).catch(e => this.client.logger.error("PROMISE_ERR:", e));
        }
    }

    private getUserFromMention(mention: string): Promise<User | undefined> {
        const matches = /^<@!?(\d+)>$/.exec(mention);
        if (!matches) return Promise.resolve(undefined);

        const id = matches[1];
        return this.client.users.fetch(id);
    }
}
