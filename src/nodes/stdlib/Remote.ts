import * as net from "net";
import {IBouncer, ISink, ISource, MBouncer, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IRemoteInputs {
  $: any;
}

interface IRemoteOutputs {
  $: any;
  connected: boolean;
  error: string;
}

const instances = new Map<string, Remote>();

export class Remote implements ISink, ISource, IBouncer {
  /**
   * Retrieves OR creates a new Remote instance.
   * @param host
   * @param port
   */
  public static instance(host: string, port: number): Remote {
    // retrieving / storing instance in cache
    const key = `${host}:${port}`;
    let instance = instances.get(key);
    if (!instance) {
      instance = new Remote(host, port);
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

  public readonly in: TInBundle<IRemoteInputs>;
  public readonly out: TOutBundle<IRemoteOutputs>;
  public readonly bounced: TOutBundle<IRemoteInputs>;
  public readonly host: string;
  public readonly port: number;
  private readonly socket: net.Socket;
  private readonly buffer: Map<string, any>;
  private connected: boolean;

  /**
   * @param host
   * @param port
   */
  private constructor(host: string, port: number) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this,
      ["$", "connected", "error"]);
    MBouncer.init.call(this, ["$"]);

    const socket = new net.Socket();
    socket.on("connect", () => this.onConnect());
    socket.on("close", () => this.onClose());
    socket.on("error", (err: Error) => this.onError(err));

    this.host = host;
    this.port = port;
    this.socket = socket;
    this.buffer = new Map();
    this.connected = false;
  }

  public send(port: IInPort<any>, value: any, tag?: string): void {
    if (port === this.in.$) {
      const socket = this.socket;
      if (this.connected) {
        const buffer = this.buffer;
        buffer.set(tag, value);
        socket.write(
          JSON.stringify({value, tag}),
          (err: Error) => this.onWrite(err, tag));
      } else {
        // socket is not connected
        // attempting to open connection
        if (!socket.connecting) {
          socket.connect(this.port, this.host);
        }

        // bouncing inputs
        this.bounced.$.send(value, tag);
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
    this.out.connected.send(connected);
  }

  /**
   * Handles socket closure.
   * Sets connected state, sends false `connected` flag to output, and
   * bounces all buffered inputs.
   */
  private onClose(): void {
    const connected = false;
    this.connected = connected;
    this.out.connected.send(connected);

    // bouncing all inputs remaining in buffer
    const buffer = this.buffer;
    if (buffer.size > 0) {
      const bounced = this.bounced.$;
      for (const [tag, value] of this.buffer.entries()) {
        bounced.send(value, tag);
      }
    }
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onError(err: Error): void {
    this.out.error.send(String(err));
  }

  /**
   * Handles socket write outcome.
   * Removes affected input from buffer when successful.
   * @param err
   * @param tag
   */
  private onWrite(err: Error, tag?: string): void {
    if (!err) {
      this.buffer.delete(tag);
    }
  }
}
