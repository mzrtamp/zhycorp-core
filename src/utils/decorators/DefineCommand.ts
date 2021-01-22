import { ICommandComponent } from "../../typings";
import { ZhycorpCore } from "../../structures/ZhycorpCore";

export function DefineCommand(meta: ICommandComponent["meta"]): any {
    return function decorate<T extends ICommandComponent>(target: new (...args: any[]) => T): new (client: ZhycorpCore) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, meta)
        });
    };
}
