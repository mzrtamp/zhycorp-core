/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Client, Collection, ClientOptions } from "discord.js";
import got from "got";
import { resolve } from "path";
import * as config from "../config";
import { CommandManager } from "../utils/CommandManager";
import { createLogger } from "../utils/Logger";
import { formatMS } from "../utils/formatMS";
import { ListenerLoader } from "../utils/ListenerLoader";

export class ZhycorpCore extends Client {
    public readonly config = config;
    public readonly logger = createLogger("bot", this.config.isProd);
    public readonly request = got;
    public readonly commands = new CommandManager(this, resolve(__dirname, "..", "commands"));
    // @ts-expect-error override
    public readonly listeners = new ListenerLoader(this, resolve(__dirname, "..", "listeners"));
    public constructor(opt: ClientOptions) { super(opt); }

    public async build(token: string): Promise<ZhycorpCore> {
        const start = Date.now();
        this.listeners.load();
        this.on("ready", async () => {
            await this.commands.load();
            this.logger.info(`Ready took ${formatMS(Date.now() - start)}`);
        });
        await this.login(token);
        return this;
    }

    public async getGuildsCount(): Promise<number> {
        if (!this.shard) return this.guilds.cache.size;
        const size = await this.shard.broadcastEval("this.guilds.cache.size");
        return size.reduce((p, v) => p + v, 0);
    }

    public async getChannelsCount(filter = true): Promise<number> {
        if (filter) {
            if (!this.shard) return this.channels.cache.filter(c => c.type !== "category" && c.type !== "dm").size;
            const size = await this.shard.broadcastEval("this.channels.cache.filter(c => c.type !== 'category' && c.type !== 'dm').size");
            return size.reduce((p, v) => p + v, 0);
        }
        if (!this.shard) return this.channels.cache.size;
        const size = await this.shard.broadcastEval("this.channels.cache.size");
        return size.reduce((p, v) => p + v, 0);
    }

    public async getUsersCount(filter = true): Promise<number> {
        const temp = new Collection();
        if (filter) {
            if (!this.shard) return this.users.cache.filter(u => !u.equals(this.user!)).size;
            const shards = await this.shard.broadcastEval("this.users.cache.filter(u => !u.equals(this.user))");
            for (const shard of shards) { for (const user of shard) { temp.set(user.id, user); } }
            return temp.size;
        }
        if (!this.shard) return this.users.cache.size;
        const shards = await this.shard.broadcastEval("this.users.cache");
        for (const shard of shards) { for (const user of shard) { temp.set(user.id, user); } }
        return temp.size;
    }

    public async getTotalMemory(type: keyof NodeJS.MemoryUsage): Promise<number> {
        if (!this.shard) return process.memoryUsage()[type];
        return this.shard.broadcastEval(`process.memoryUsage()["${type}"]`).then(data => data.reduce((a, b) => a + b));
    }
}
