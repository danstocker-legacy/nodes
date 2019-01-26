import {Server, Socket} from "net";
import {INode} from "../../node";
import {OutPorts$, Outputs$, TOutputs} from "../../utils";

export interface IOutputs<V> {
  d_val: V;
  ev_err: string;
}

export type TRemoteIn<V> = INode<{}, IOutputs<V>>;

const serverCache: Map<string, Server> = new Map();
const outputCache: Map<string, TOutputs<IOutputs<any>>> = new Map();

export function RemoteIn$<V>(host: string, port: number, id: string): TRemoteIn<V> {
  const o = OutPorts$(["d_val", "ev_err"]);
  outputCache.set(id, Outputs$(o));

  const serverId = `${host}:${port}`;
  if (!serverCache.get(serverId)) {
    serverCache.set(serverId, tcpServer$(host, port));
  }

  return {i: {}, o};
}

function tcpServer$(host: string, port: number): Server {
  const server = new Server();
  server.listen(port, host);
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
  return server;
}
