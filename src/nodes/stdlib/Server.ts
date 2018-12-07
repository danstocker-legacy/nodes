import * as net from "net";
import {IEvented, IStateful, MEvented, MStateful} from "../../node";
import {TOutBundle} from "../../port";
import {Remote} from "./Remote";

interface IServerStateOut {
  connections: number;
}

interface IServerEvents {
  err: string;
}

const instances = new Map<number, Server>();

/**
 * Handles TCP connections and data traffic.
 * Outputs connection count (`connections`) and `error`. (Both untagged.)
 * There is usually a single instance of it available.
 */
export class Server implements IStateful, IEvented {
  /**
   * Creates OR retrieves Server instance.
   * @param host
   * @param port
   */
  public static instance(host: string, port: number): Server {
    let instance = instances.get(port);
    if (!instance) {
      instance = new Server(host, port);
      instances.set(port, instance);
    }
    return instance;
  }

  /**
   * Clears instance cache. For testing purposes only.
   */
  public static clear() {
    instances.clear();
  }

  private static onData(data: Buffer | string, remote: Remote) {
    const wrapped = JSON.parse(String(data));
    remote.o.$.send(wrapped.value, wrapped.tag);
  }

  public readonly so: TOutBundle<IServerStateOut>;
  public readonly e: TOutBundle<IServerEvents>;
  private readonly host: string;
  private readonly port: number;
  private readonly connections: Set<net.Socket>;

  private constructor(host: string, port: number) {
    MStateful.init.call(this, ["connections"]);
    MEvented.init.call(this, ["err"]);

    const server = new net.Server();
    server.on("connection",
      (socket: net.Socket) => this.onConnection(socket));
    server.on("error", (err: Error) => this.onServerError(err));
    server.listen(port, host);

    this.host = host;
    this.port = port;
    this.connections = new Set();
  }

  /**
   * Handles socket connection.
   * Sends connection count to output.
   * @param socket
   */
  private onConnection(socket: net.Socket): void {
    const remote = Remote.instance(
      socket.remoteAddress, socket.remotePort, this.host, this.port);
    socket.on("data",
      (data: Buffer | string) => Server.onData(data, remote));
    socket.on("close", () => this.onSocketClose(socket));
    socket.on("error", (err: Error) => this.onSocketError(err));

    const connections = this.connections;
    connections.add(socket);
    this.so.connections.send(connections.size);
  }

  /**
   * Handles server error.
   * Sends stringified error to output.
   * @param err
   */
  private onServerError(err: Error): void {
    this.e.err.send(String(err));
  }

  /**
   * Handles closing sockets.
   * Sends connection count to output.
   * @param socket
   */
  private onSocketClose(socket: net.Socket): void {
    const connections = this.connections;
    connections.delete(socket);
    this.so.connections.send(connections.size);
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onSocketError(err: Error): void {
    this.e.err.send(String(err));
  }
}
