import { ClientOptions, ClientPresenceStatus, Intents, UserResolvable, WebhookClient } from "discord.js";

export const embedColor = "65C0FF";
export const defaultPrefix = "-";
export const devs: UserResolvable[] = ["390045370240991234"];
export const clientOptions: ClientOptions = {
    allowedMentions: {
        parse: ["users"]
    },
    fetchAllMembers: false,
    messageCacheLifetime: 1800,
    messageCacheMaxSize: Infinity,
    messageEditHistoryMaxSize: Infinity,
    messageSweepInterval: 300,
    restTimeOffset: 300,
    retryLimit: 3,
    ws: {
        intents: [Intents.ALL]
    }
};
export const mongoURL = process.env.MONGO_URL;
export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;
export const prefix = isDev ? "$" : "-";
export const presenceData = {
    activities: [
        `my prefix is ${prefix}`,
        "Hi there, I am Zhycorp's Servant",
        "with {users.size} users",
        "on {guilds.size} servers",
        "Hello world!"
    ],
    status: ["online"] as ClientPresenceStatus[],
    interval: 60000
};
export const shardsCount: number | "auto" = "auto";
export const systemLog = new WebhookClient(process.env.SYSTEMCHANNEL_ID!, process.env.SYSTEMCHANNEL_TOKEN!);
export const queueLog = new WebhookClient(process.env.QUEUECHANNEL_ID!, process.env.QUEUECHANNEL_TOKEN!);
export const memberLog = new WebhookClient(process.env.MEMBERCHANNEL_ID!, process.env.MEMBERCHANNEL_TOKEN!);
export const modsLog = new WebhookClient(process.env.MODCHANNEL_ID!, process.env.MODCHANNEL_TOKEN!);
export const messageLog = new WebhookClient(process.env.MESSAGECHANNEL_ID!, process.env.MESSAGECHANNEL_TOKEN!);
