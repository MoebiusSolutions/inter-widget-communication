import { makeBroadcastChannel } from "./broadcast-channel";
import { InitializeOptions, IWCMethods, MessageHandlerFn } from "./types";
import { ONR_OWF_INTEROP_SUBSCRIBE } from './index'

interface MessageData {
  origin: string
  sender: string
  channel: string
  payload: string
}

export class BcstImpl implements IWCMethods {
  private readonly senderId = `${Date.now()}-${Math.random()}`
  private port1?: MessagePort
  private doneConnecting = false
  private whenConnected: (() => void)[] = []
  private owfDataChannel = makeBroadcastChannel('owf-data')
  private handlerMap = new Map<string, MessageHandlerFn>()
  private allHandlers: MessageHandlerFn[] = []

  constructor(options?: InitializeOptions) {
    if (options?.prefix) {
      this.senderId = `${options.prefix}:${this.senderId}`
    }
    if (options?.busUrl) {
      this.connectToBus(options.busUrl)
    } else {
      this.doneConnecting = true // no, bus, spoof connected
    }
  }
  get sender() {
    return this.senderId
  }
  ready(callback: () => void) {
    if (this.doneConnecting) {
      callback()
    } else {
      this.whenConnected.push(callback)
    }
  }
  subscribe(topic: string, handler: MessageHandlerFn) {
    // in case you have a listener relaying from OWF, alert them that they should subscribe to an OWF topic
    this.publish(ONR_OWF_INTEROP_SUBSCRIBE, topic)

    // add the handler
    this.handlerMap.set(topic, handler);

    // Handle receiving the message
    this.owfDataChannel.onmessage = (e: MessageEvent<MessageData>) => {
      this.deliverBroadcastMessage(e.data)
    }
  }
  _subscribeAll(handler: MessageHandlerFn) {
    this.allHandlers.push(handler)
    this.owfDataChannel.onmessage = (e: MessageEvent<MessageData>) => {
      this.deliverBroadcastMessage(e.data)
    }
  }
  unsubscribe(topic: string) {
    // remove the handler from the map
    this.handlerMap.delete(topic);
  }
  publish(topic: string, message: string) {
    const data: MessageData = {
      origin: window.origin,
      sender: this.sender,
      payload: message,
      channel: topic,
    }
    // Normal BroadcastChannel publish
    this.owfDataChannel.postMessage(data)

    // Cross Origin MessageChannel publish
    const port1 = this.port1
    if (port1) {
      port1.postMessage(data)
    }

    // We do not get our own messages, so fire them locally to be like OWF
    this.deliverBroadcastMessage(data)
  }

  private deliverBroadcastMessage(data: MessageData) {
    const { sender, payload, channel } = data
    const handler = this.handlerMap.get(channel);
    if (handler instanceof Function) {
      try {
        handler(sender, payload, channel)
      } catch (e) {
        console.error('Handler threw exception processing:', data, e)
      }
    }
    this.allHandlers.forEach(handler => {
      try {
        handler(sender, payload, channel)
      } catch (e) {
        console.error('Handler (all) threw exception processing:', data, e)
      }
    })
  }

  private connectToBus(busUrl: string) {
    const channel = new MessageChannel()
    const iframe = document.createElement('iframe')
    const timerId = setTimeout(() => {
      console.error('Cross origin bus failed to load, reverting to same origin')
      this.doDoneConnecting()
    }, 5000)

    this.port1 = channel.port1
    this.port1.onmessage = (e: MessageEvent) => {
      // Relay incoming cross-origin message
      this.deliverBroadcastMessage(e.data)
    }

    iframe.addEventListener('load', () => {
      clearTimeout(timerId)
      iframe.contentWindow.postMessage('init', '*', [channel.port2])
      this.doDoneConnecting()
    })
    iframe.style.height = '0px'
    iframe.style.display = 'none'
    iframe.src = busUrl
    iframe.title = 'Cross origin bus'
    document.body.appendChild(iframe)
  }

  private doDoneConnecting() {
    // Must set `doneConnecting = true` before calling handlers
    // in case a handler recursively calls ready
    this.doneConnecting = true
    this.whenConnected.forEach(handler => handler())
    this.whenConnected = []
  }
}
