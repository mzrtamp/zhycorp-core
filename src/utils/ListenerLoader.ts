import { promises as fs } from "fs";
import { parse, resolve } from "path";
import { IListener } from "../typings";
import { ZhycorpCore } from "../structures/ZhycorpCore";

export class ListenerLoader {
    public constructor(public client: ZhycorpCore, public path: string) {}
    public load(): void {
        fs.readdir(resolve(this.path))
            .then(async listeners => {
                this.client.logger.info(`Trying to load ${listeners.length} listeners...`);
                for (const file of listeners) {
                    const event = await this.import(resolve(this.path, file), this.client);
                    if (event === undefined) throw new Error(`File ${file} is not a valid listener file`);
                    this.client.logger.info(`Listener on event ${event.name.toString()} has been added`);
                    this.client.addListener(event.name, (...args) => event.execute(...args));
                }
            })
            .catch(err => this.client.logger.error("LISTENER_LOADER_ERR:", err))
            .finally(() => this.client.logger.info("Every listeners has been loaded."));
    }

    private async import(path: string, ...args: any[]): Promise<IListener | undefined> {
        const file = (await import(resolve(path)).then(m => m[parse(path).name]));
        return file ? new file(...args) : undefined;
    }
}
