/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { BaseCommand } from "../../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import Respect from "../../utils/Models/Respect";

@DefineCommand({
    aliases: ["respects", "f"],
    name: "respect",
    description: "Pay your respects",
    usage: "{prefix}respect <topics>"
})
export class RespectCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        const re = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gi.exec(message.cleanContent);
        if (re !== null) {
            if (!message.member!.hasPermission("MANAGE_GUILD")) return;
            await message.delete().then(msg => {
                void msg.channel.send(new MessageEmbed().setColor("RED").setDescription(`<:error:591629649231216640>  **|**  Sorry <@${message.author.id}>, please **do not advertise any Discord servers** here`)).then(msg => {
                    this.client.logger.info(`[InviteLinkBlocker] ${message.author.tag} [${message.author.id}] was trying to post some invite links, but I have blocked them`);
                    void msg.delete({ timeout: 3500 });
                }).catch();
            });
        }

        const reason = args.join(" ");

        let res = await Respect.findOne({ guild: message.guild!.id });
        if (!res) {
            res = new Respect({
                guild: message.guild!.id
            });
        }
        (res.total as any) += 1;
        await res.save();

        let desc: string;
        if (reason) {
            desc = `Press **F** to pay your respects for \`${reason}\``;
        } else {
            desc = `Press **F** to pay your respects`;
        }

        const embed = new MessageEmbed()
            .setColor(this.client.config.embedColor)
            .setAuthor(`${message.author.username} has started a respect session`, message.author.displayAvatarURL())
            .setDescription(desc)
            .setFooter("This session will be ended at 10 seconds");
        const reactMsg = await message.channel.send(embed);
        void reactMsg.react("🇫");

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const filter = (reaction: { emoji: { name: string } }) => reaction.emoji.name === "🇫";
        await reactMsg.awaitReactions(filter, {
            time: 10000,
            errors: ["time"]
        })
            .then(col => {
                const payed = col.first();
                console.log(payed!.users.cache.map(x => x.username));
            })
            .catch(col => {
                const payed = col.first();
                let desc1: string;
                if (reason) {
                    desc1 = `${payed.users.cache.map((obj: { id: any }) => `<@${obj.id}>`).join(", ")} has paid their respect too for \`${reason}\``;
                } else {
                    desc1 = `${payed.users.cache.map((obj: { id: any }) => `<@${obj.id}>`).join(", ")} has paid their respect too`;
                }

                const editEmbed = new MessageEmbed()
                    .setColor(this.client.config.embedColor)
                    .setAuthor("Respect session has been closed", message.author.displayAvatarURL())
                    .setDescription(desc1)
                    .setFooter(`This command has been used ${res!.total} times`);
                void reactMsg.edit(editEmbed);
                return reactMsg.reactions.removeAll().catch(error => console.error("Failed to clear reactions: ", error));
            });
    }
}
