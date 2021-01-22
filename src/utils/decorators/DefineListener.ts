import { IListener } from "../../typings";
import { ZhycorpCore } from "../../structures/ZhycorpCore";

export function DefineListener(name: IListener["name"]): any {
    return function decorate<T extends IListener>(target: new (...args: any[]) => T): new (client: ZhycorpCore) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, name)
        });
    };
}
