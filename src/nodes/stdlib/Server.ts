import * as net from "net";
import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {IMuxed, ValueOf} from "../../utils";

interface IServerPorts<V> {
  [key: string]: V;
}

interface IConnectionInfo {
  lhost: string;
  lport: number;
  rhost: string;
  rport: number;
}

interface IServerInputs {
  /** Values to be sent through sockets. */
  d_mux: IMuxed<IServerPorts<Buffer | string>>;

  /** Whether the server *should be* listening. */
  st_lis: boolean;
}

interface IServerOutputs {
  /** Values received through sockets. */
  d_mux: IMuxed<IServerPorts<Buffer | string>>;

  /** Connection count. */
  st_connc: number;

  /** Whether server *is* listening. */
  st_lis: boolean;

  /** Bounced inputs. */
  b_d_mux: IMuxed<IServerPorts<Buffer | string>>;

  /** Information re. new connection. */
  ev_conn: IConnectionInfo;

  /** Information re. closed connection. */
  ev_disc: IConnectionInfo;

  /** Error message. */
  ev_err: string;
}

/**
 * Handles TCP connections and data traffic.
 */
export class Server implements ISink, ISource {
  public readonly i: TInBundle<IServerInputs>;
  public readonly o: TOutBundle<IServerOutputs>;
  private readonly server: net.Server;
  private readonly host: string;
  private readonly port: number;
  private readonly sockets: Map<string, net.Socket>;

  constructor(host: string, port: number) {
    MSink.init.call(this, ["d_mux", "st_lis"]);
    MSource.init.call(this, [
      "d_mux", "st_connc", "st_lis", "b_d_mux", "ev_conn", "ev_disc", "ev_err"
    ]);

    const server = new net.Server();
    server.on("listening", () => this.onListen());
    server.on("connection",
      (socket: net.Socket) => this.onConnection(socket));
    server.on("close", () => this.onServerClose());
    server.on("error", (err: Error) => this.onServerError(err));

    this.server = server;
    this.host = host;
    this.port = port;
    this.sockets = new Map();
  }

  public send(
    port: IInPort<ValueOf<IServerInputs>>,
    value: ValueOf<IServerInputs>,
    tag?: string
  ): void {
    const i = this.i;
    switch (port) {
      case i.d_mux:
        const mux = value as IMuxed<IServerPorts<Buffer | string>>;
        const sockets = this.sockets;
        const id = mux.name as string;
        if (sockets.has(id)) {
          const socket = sockets.get(id);
          socket.write(mux.val);
        } else {
          this.o.b_d_mux.send(mux, tag);
        }
        break;

      case i.st_lis:
        this.server.listen(this.port, this.host);
        break;
    }
  }

  private onListen(): void {
    this.o.st_lis.send(true);
  }

  /**
   * Handles socket connection.
   * Emits connection event and connection count.
   * @param socket
   */
  private onConnection(socket: net.Socket): void {
    const info = {
      lhost: socket.localAddress,
      lport: socket.localPort,
      rhost: socket.remoteAddress,
      rport: socket.remotePort
    };
    const id = `${info.rhost}:${info.rport}`;

    socket.on("data",
      (data: Buffer | string) => this.onData(data, id));
    socket.on("close", () => this.onSocketClose(socket, info, id));
    socket.on("error", (err: Error) => this.onSocketError(err));

    const connections = this.sockets;
    connections.set(id, socket);

    const o = this.o;
    o.ev_conn.send(info);
    o.st_connc.send(connections.size);
  }

  private onServerClose(): void {
    this.o.st_lis.send(false);
  }

  /**
   * Handles server error.
   * Emits stringified error.
   * @param err
   */
  private onServerError(err: Error): void {
    this.o.ev_err.send(String(err));
  }

  /**
   * Handles data received from socket.
   * Emits multiplexed data.
   * @param data
   * @param id
   */
  private onData(data: Buffer | string, id: string): void {
    this.o.d_mux.send({
      name: id,
      val: data
    });
  }

  /**
   * Handles closing sockets.
   * Emits disconnect event and connection count.
   * @param socket
   * @param info
   * @param id
   */
  private onSocketClose(socket: net.Socket, info: IConnectionInfo, id: string): void {
    const connections = this.sockets;
    connections.delete(id);
    const o = this.o;
    o.ev_disc.send(info);
    o.st_connc.send(connections.size);
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onSocketError(err: Error): void {
    this.o.ev_err.send(String(err));
  }
}
