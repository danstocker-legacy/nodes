import {Server, Socket} from "net";
import {INode} from "../../node";
import {OutPorts$, Outputs$, TOutputs} from "../../utils";

export interface IOutputs<V> {
  d_val: V;
  ev_err: string;
}

export type TRemoteIn<V> = INode<{}, IOutputs<V>>;

let server: Server;
const outputCache: Map<string, TOutputs<IOutputs<any>>> = new Map();

export function RemoteIn$<V>(id: string): TRemoteIn<V> {
  const o = OutPorts$(["d_val", "ev_err"]);
  outputCache.set(id, Outputs$(o));

  if (!server) {
    setupTcp();
  }

  return {i: {}, o};
}

function setupTcp() {
  server = new Server();
  server.listen(8888, "localhost");
  server.on("connection", (socket: Socket) => {
    socket.on("data", (data: string) => {
      // tslint:disable
      try {
        const {id, tag, value} = JSON.parse(data);
        const outputs = outputCache.get(id);
        if (outputs) {
          outputs.d_val(value, tag);
        }
      } catch (err) {
        for (const outputs of outputCache.values()) {
          outputs.ev_err(String(err));
        }
      }
    });
  });
}
