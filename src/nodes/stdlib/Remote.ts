import * as net from "net";
import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {TJson, ValueOf} from "../../utils";

interface IRemoteInputs {
  d_wrap: TJson;
  st_conn: boolean;
}

interface IRemoteOutputs {
  d_wrap: TJson;
  st_conn: boolean;
  ev_err: string;
}

const instances = new Map<string, Remote>();

export class Remote implements ISink, ISource, IBouncer {
  /**
   * Retrieves OR creates a new Remote instance.
   * @param remoteHost Remote server address
   * @param remotePort Remote server port
   * @param localHost Local server address
   * @param localPort Local server port
   */
  public static instance(
    remoteHost: string,
    remotePort: number,
    localHost: string,
    localPort: number
  ): Remote {
    // retrieving / storing instance in cache
    const key = `${remoteHost}:${remotePort}-${localHost}:${localPort}`;
    let instance = instances.get(key);
    if (!instance) {
      instance = new Remote(remoteHost, remotePort, localHost, localPort);
      instances.set(key, instance);
    }
    return instance;
  }

  /**
   * Clears instance cache. For testing purposes only.
   */
  public static clear() {
    instances.clear();
  }

  public readonly i: TInBundle<IRemoteInputs>;
  public readonly o: TOutBundle<IRemoteOutputs>;
  public readonly re: TOutBundle<IRemoteInputs>;
  private readonly remoteHost: string;
  private readonly remotePort: number;
  private readonly socket: net.Socket;
  private readonly buffer: Map<string, any>;
  private connected: boolean;

  /**
   * @param remoteHost
   * @param remotePort
   * @param localHost
   * @param localPort
   */
  private constructor(
    remoteHost: string,
    remotePort: number,
    localHost: string,
    localPort: number
  ) {
    MSink.init.call(this, ["d_wrap", "st_conn"]);
    MSource.init.call(this, ["d_wrap", "st_conn", "ev_err"]);
    MBouncer.init.call(this, ["d_wrap"]);

    const socket = new net.Socket();
    socket.on("connect", () => this.onConnect());
    socket.on("close", () => this.onClose());
    socket.on("error", (err: Error) => this.onError(err));

    this.remoteHost = remoteHost;
    this.remotePort = remotePort;
    this.socket = socket;
    this.buffer = new Map();
    this.connected = false;
  }

  public send(
    port: IInPort<ValueOf<IRemoteInputs>>,
    value: ValueOf<IRemoteInputs>,
    tag?: string
  ): void {
    const socket = this.socket;
    const connected = this.connected;
    switch (port) {
      case this.i.d_wrap:
        if (connected) {
          const buffer = this.buffer;
          buffer.set(tag, value);
          socket.write(
            JSON.stringify({value, tag}),
            (err: Error) => this.onWrite(err, value, tag));
        } else {
          // socket is not connected
          // bouncing inputs
          this.re.d_wrap.send(value, tag);
        }
        break;

      case this.i.st_conn:
        if (value && !connected && !socket.connecting) {
          // socket is not connected and is not in the process of connecting
          // attempting to open connection
          socket.connect(this.remotePort, this.remoteHost);
        } else if (!value && (connected || socket.connecting)) {
          // TODO: Can we call end() while connecting?
          // socket is connected or is in the process of connecting
          // closing connection
          socket.end();
        }
        break;
    }
  }

  /**
   * Bounces all buffered inputs.
   */
  private bounceAll() {
    const buffer = this.buffer;
    if (buffer.size > 0) {
      const re = this.re.d_wrap;
      for (const [tag, value] of this.buffer.entries()) {
        re.send(value, tag);
      }
    }
  }

  /**
   * Handles socket connection.
   * Sets connected state and sends true `connected` flag to output.
   */
  private onConnect(): void {
    const connected = true;
    this.connected = connected;
    this.o.st_conn.send(connected);
  }

  /**
   * Handles socket closure.
   * Sets connected state, sends false `connected` flag to output, and
   * bounces all buffered inputs.
   */
  private onClose(): void {
    const connected = false;
    this.connected = connected;
    this.o.st_conn.send(connected);
    this.bounceAll();
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onError(err: Error): void {
    this.o.ev_err.send(String(err));
    this.bounceAll();
  }

  /**
   * Handles socket write outcome.
   * Removes affected input from buffer when successful.
   * @param err
   * @param value
   * @param tag
   */
  private onWrite(err: Error, value: TJson, tag?: string): void {
    if (err) {
      this.o.ev_err.send(String(err));
      this.re.d_wrap.send(value, tag);
    }
    this.buffer.delete(tag);
  }
}
