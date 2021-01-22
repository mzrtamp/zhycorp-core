import { BaseCommand } from "../../structures/BaseCommand";
import { exec } from "child_process";
import { IMessage } from "../../typings";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { MessageEmbed } from "discord.js";

@DefineCommand({
    aliases: ["execute", "bash", "$"],
    cooldown: 0,
    description: "Execute a bash command",
    devOnly: true,
    name: "exec",
    usage: "{prefix}exec <bash>"
})
export class ExecCommand extends BaseCommand {
    public async execute(message: IMessage, args: string[]): Promise<any> {
        if (!args[0]) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("<:no1:783266403776069673>  **|**  Please provide a bash command to execute"));

        const m: any = await message.channel.send(`❯_ ${args.join(" ")}`);
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        exec(args.join(" "), async (e: any, stdout: any, stderr: any) => {
            if (e) return m.edit(`\`\`\`js\n${e.message}\`\`\``);
            if (!stderr && !stdout) return m.edit(new MessageEmbed().setColor("GREEN").setDescription("<:yes1:783266376752168961>  **|**  Executed without result"));
            if (stdout) {
                const pages = this.paginate(stdout, 1950);
                for (const page of pages) {
                    await message.channel.send(`\`\`\`\n${page}\`\`\``);
                }
            }
            if (stderr) {
                const pages = this.paginate(stderr, 1950);
                for (const page of pages) {
                    await message.channel.send(`\`\`\`\n${page}\`\`\``);
                }
            }
        });
    }

    private paginate(text: string, limit = 2000): any[] {
        const lines = text.trim().split("\n");
        const pages = [];
        let chunk = "";

        for (const line of lines) {
            if (chunk.length + line.length > limit && chunk.length > 0) {
                pages.push(chunk);
                chunk = "";
            }

            if (line.length > limit) {
                const lineChunks = line.length / limit;

                for (let i = 0; i < lineChunks; i++) {
                    const start = i * limit;
                    const end = start + limit;
                    pages.push(line.slice(start, end));
                }
            } else {
                chunk += `${line}\n`;
            }
        }

        if (chunk.length > 0) {
            pages.push(chunk);
        }

        return pages;
    }
}
