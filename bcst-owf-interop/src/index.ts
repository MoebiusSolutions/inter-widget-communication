import { initialize, publish, _subscribeAll } from '@moesol/inter-widget-communication'

declare const OWF: any
// Avoid circular dependency, redefine ONR_OWF_INTEROP_SUBSCRIBE locally
const ONR_OWF_INTEROP_SUBSCRIBE = "onr.owf.interop.subscribe";

let senderId: string

function main() {
  if (typeof OWF === 'undefined') {
    alert('Include owf-widget-min.js or owf-widget-debug.js in index.html')
    return
  }
  if (!OWF.Util.isRunningInOWF()) {
    alert('Not running on OWF')
    return
  }

  senderId = initialize({
    /**
     * Uncomment if using cross-origin broadcast bus
     * busUrl: 'https://localhost:7443/',
     */
    provider: 'broadcast'
  })

  OWF.ready(() => {
    _subscribeAll(relay2owf)
  })
}

function relay2owf(sender: string, message: any, channel: string) {
  if (ONR_OWF_INTEROP_SUBSCRIBE === channel) {
    // message contains this topic
    OWF.Eventing.subscribe(message, relay2broadcast)
  } else {
    if (sender === senderId) {
      // Prevent message ringing
      return
    }
    OWF.Eventing.publish(channel, message);
    console.debug('relay2owf', channel, message);
  }
}

function relay2broadcast<T>(sender: string, payload: T, channel: string) {
  const senderOjb = JSON.parse(sender)
  if (senderOjb.id === OWF.getInstanceId()) {
    // Prevent message ringing
    return
  }
  publish(channel, payload as any)
  console.debug('relay2broadcast', { sender, channel, payload });
}

main()

// Force this ts file to be considered a JavaScript module
export {}
