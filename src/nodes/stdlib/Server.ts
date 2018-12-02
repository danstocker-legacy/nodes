import * as net from "net";
import {ISource, MSource} from "../../node";
import {TOutBundle} from "../../port";
import {Remote} from "./Remote";

interface IServerOutputs {
  connections: number;
  error: string;
}

const instances = new Map<number, Server>();

/**
 * Handles TCP connections and data traffic.
 * Outputs connection count (`connections`) and `error`. (Both untagged.)
 * There is usually a single instance of it available.
 */
export class Server implements ISource {
  /**
   * Creates OR retrieves Server instance.
   * @param port
   */
  public static instance(port: number): Server {
    let instance = instances.get(port);
    if (!instance) {
      instance = new Server(port);
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
    remote.out.$.send(wrapped.value, wrapped.tag);
  }

  public readonly out: TOutBundle<IServerOutputs>;
  public readonly port: number;
  private readonly connections: Set<net.Socket>;

  private constructor(port: number) {
    MSource.init.call(this, ["connections", "error"]);

    const server = new net.Server();
    server.on("connection",
      (socket: net.Socket) => this.onConnection(socket));
    server.on("error", (err: Error) => this.onServerError(err));
    server.listen(port);

    this.port = port;
    this.connections = new Set();
  }

  /**
   * Handles socket connection.
   * Sends connection count to output.
   * @param socket
   */
  private onConnection(socket: net.Socket): void {
    const remote = Remote.instance(socket.remoteAddress, socket.remotePort);
    socket.on("data",
      (data: Buffer | string) => Server.onData(data, remote));
    socket.on("close", () => this.onSocketClose(socket));
    socket.on("error", (err: Error) => this.onSocketError(err));

    const connections = this.connections;
    connections.add(socket);
    this.out.connections.send(connections.size);
  }

  /**
   * Handles server error.
   * Sends stringified error to output.
   * @param err
   */
  private onServerError(err: Error): void {
    this.out.error.send(String(err));
  }

  /**
   * Handles closing sockets.
   * Sends connection count to output.
   * @param socket
   */
  private onSocketClose(socket: net.Socket): void {
    const connections = this.connections;
    connections.delete(socket);
    this.out.connections.send(connections.size);
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onSocketError(err: Error): void {
    this.out.error.send(String(err));
  }
}
