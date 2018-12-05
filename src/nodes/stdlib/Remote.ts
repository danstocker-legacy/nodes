import * as net from "net";
import {
  IBouncer,
  IControllable,
  IEvented,
  ISink,
  ISource,
  IStateful,
  MBouncer,
  MControllable,
  MEvented,
  MSink,
  MSource,
  MStateful
} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {TJson, ValueOf} from "../../utils";

interface IRemoteInputs {
  $: TJson;
}

interface IRemoteOutputs {
  $: TJson;
}

interface IRemoteStateIn {
  touch: any;
}

interface IRemoteStateOut {
  connected: boolean;
}

interface IRemoteEvents {
  err: string;
}

const instances = new Map<string, Remote>();

export class Remote implements ISink, ISource, IStateful, IControllable, IBouncer, IEvented {
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

  public readonly i: TInBundle<IRemoteInputs>;
  public readonly o: TOutBundle<IRemoteOutputs>;
  public readonly si: TInBundle<IRemoteStateIn>;
  public readonly so: TOutBundle<IRemoteStateOut>;
  public readonly re: TOutBundle<IRemoteInputs>;
  public readonly e: TOutBundle<IRemoteEvents>;
  private readonly host: string;
  private readonly port: number;
  private readonly socket: net.Socket;
  private readonly buffer: Map<string, any>;
  private connected: boolean;

  /**
   * @param host
   * @param port
   */
  private constructor(host: string, port: number) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    MControllable.init.call(this, ["touch"]);
    MStateful.init.call(this, ["connected"]);
    MBouncer.init.call(this, ["$"]);
    MEvented.init.call(this, ["err"]);

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

  public send(
    port: IInPort<ValueOf<IRemoteInputs>>,
    value: ValueOf<IRemoteInputs>,
    tag?: string
  ): void {
    const socket = this.socket;
    const connected = this.connected;
    switch (port) {
      case this.i.$:
        if (connected) {
          const buffer = this.buffer;
          buffer.set(tag, value);
          socket.write(
            JSON.stringify({value, tag}),
            (err: Error) => this.onWrite(err, value, tag));
        } else {
          // socket is not connected
          // bouncing inputs
          this.re.$.send(value, tag);
        }
        break;

      case this.si.touch:
        if (!connected && !socket.connecting) {
          // socket is not connected and is not in the process of connecting
          // attempting to open connection
          socket.connect(this.port, this.host);
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
      const re = this.re.$;
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
    this.so.connected.send(connected);
  }

  /**
   * Handles socket closure.
   * Sets connected state, sends false `connected` flag to output, and
   * bounces all buffered inputs.
   */
  private onClose(): void {
    const connected = false;
    this.connected = connected;
    this.so.connected.send(connected);
    this.bounceAll();
  }

  /**
   * Handles socket errors.
   * Sends stringified error to output.
   * @param err
   */
  private onError(err: Error): void {
    this.e.err.send(String(err));
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
      this.e.err.send(String(err));
      this.re.$.send(value, tag);
    }
    this.buffer.delete(tag);
  }
}
