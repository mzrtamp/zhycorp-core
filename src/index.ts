import "dotenv/config";
import { ShardingManager } from "discord.js";
import { resolve } from "path";
import { isProd, shardsCount } from "./config";
import { createLogger } from "./utils/Logger";

const log = createLogger(`shardingmanager`, isProd);

const manager = new ShardingManager(resolve(__dirname, "bot.js"), {
    totalShards: shardsCount,
    respawn: true,
    token: process.env.DISCORD_TOKEN,
    mode: "process"
});

manager.on("shardCreate", shard => {
    log.info(`[ShardManager] Shard #${shard.id} has been spawned`);
    shard.on("disconnect", () => {
        log.warn("SHARD_DISCONNECTED: ", { stack: `[ShardManager] Shard #${shard.id} was disconnected` });
    }).on("reconnecting", () => {
        log.info(`[ShardManager] Shard #${shard.id} has been reconnected`);
    });
    if (manager.shards.size === manager.totalShards) log.info("[ShardManager] All shards are spawned successfully");
}).spawn(shardsCount).catch(e => log.error("SHARD_SPAWN_ERR: ", e));
