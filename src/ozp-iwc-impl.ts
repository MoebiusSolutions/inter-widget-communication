import { InitializeOptions, IwcClient, IWCMethods, MessageHandlerFn } from "./types";

export class OzpIwcImpl implements IWCMethods {
  private readonly senderId = `${Date.now()}`
  private readonly iwcClient: IwcClient | null;

  // Arguments are backward compatible to released version
  constructor(iwcClient?: IwcClient, options?: InitializeOptions) {
    if (iwcClient) {
      this.iwcClient = iwcClient
    } else if (options?.busUrl) {
      this.iwcClient = new window.ozpIwc.Client(options.busUrl)
    } else {
      this.iwcClient = null
    }
  }
  get sender() {
    return this.senderId
  }
  ready(callback: () => void) {
    this.verifyClient()

    if (this.iwcClient.isConnected()) {
      callback();
    }
    else {
      const id = setTimeout(() => console.error('Timeout waiting for iwc-bus server'), 5000)
      this.iwcClient.connect().then(() => {
        clearTimeout(id)
        callback();
      }).catch(err => console.log(err))
    }
  }
  subscribe(topic: string, handler: MessageHandlerFn) {
    this.verifyClient()

    var ref = new this.iwcClient.data.Reference(topic, { fullResponse: true });
    ref.watch((change) => {
      handler(topic, change.newValue, topic)
    });
  }
  unsubscribe(topic: string) {
    this.verifyClient()

    var ref = new this.iwcClient.data.Reference(topic, null);
    ref.unwatch(topic);
  }
  publish(topic: string, message: string) {
    this.verifyClient()

    var ref = new this.iwcClient.data.Reference(topic, null);
    ref.set(message);
  }

  private verifyClient() {
    if (!this.iwcClient) {
      throw new Error("No ozpIwc client was given")
    }
  }
}

