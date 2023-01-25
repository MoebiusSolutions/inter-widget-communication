import { OWFImpl } from './owf-impl';
import { OzpIwcImpl } from './ozp-iwc-impl';
import { BcstImpl } from './bcst-impl';
import { InitializeOptions, IwcClient, MessageHandlerFn } from './types'

function isOWFActive() {
  if (
    window.OWF &&
    window.OWF.Util &&
    window.OWF.Util.isRunningInOWF &&
    window.OWF.Util.isRunningInOWF()
  )
    return true;

  return false;
}

function isIWCActive() {
  if (
    window.ozpIwc &&
    window.ozpIwc.Client
  ) {
    return true;
  }
  return false;
}

function resolveProviderName(options?: InitializeOptions) {
  let provider = options?.provider ?? 'any'
  // Old behavior is to compute the provider based on what was loaded into index.html
  // However, if provider is set to one of the other strings we use that provider
  if (provider === 'any') {
    if (isOWFActive()) {
      provider = 'owf'
    } else if (isIWCActive()) {
      provider = 'ozp-iwc'
    } else {
      provider = 'broadcast'
    }
  }
  return provider
}

function parseSearchParams(options?: InitializeOptions) {
  if (!options) {
    return options
  }

  // Below is ok if options.search is undefined or null
  const searchParams = new URLSearchParams(options.search)
  const provider = searchParams.get('iwc') ?? 'broadcast' as any
  const busUrl = searchParams.get('busUrl') ?? 'bcst-bus/index.html'

  return {
    provider,
    busUrl,
    ...options
  }
}

export default class IWC {
  private readonly provider

  constructor(iwcClient?: IwcClient, options?: InitializeOptions) {
    options = parseSearchParams(options)
    const providerName = resolveProviderName(options)
    switch (providerName) {
      case 'owf':
        this.provider = new OWFImpl()
        break

      case 'ozp-iwc':
        this.provider = new OzpIwcImpl(iwcClient, options)
        break

      case 'broadcast':
        this.provider = new BcstImpl(options)
        break

      default:
        throw new Error(`Unknown provider name ${providerName}`)
    }
  }
  get sender() {
    return this.provider.sender
  }
  subscribe(topic: string, handler: MessageHandlerFn) {
    this.provider.subscribe(topic, handler)
  }
  _subscribeAll(handler: MessageHandlerFn) {
    if (this.provider instanceof BcstImpl) {
      this.provider._subscribeAll(handler)
    } else {
      throw new Error('Only BcstImpl supports this feature')
    }
  }
  unsubscribe(topic: string) {
    this.provider.unsubscribe(topic)
  }
  publish(topic: string, message: string) {
    this.provider.publish(topic, message)
  }
  ready(callback: () => void, options?: InitializeOptions) {
    return this.provider.ready(callback)
  }
}

/*
 * Below is a simplified API.

 * Clients do not need to manage the IWC instance.
 * Also, publish and subscribe are wrapped in `ready`.
 * 
 * ```typescript
 * import { initialize } from '@moesol/inter-widget-communication'
 * 
 * const senderId = initialize({
 *   busUrl: 'http://bus-host/bus/js'
 * })
 * subscribe('topic', (sender, message) => { ... })
 * 
 * publish('topic', 'message'))
 * ```
 */

let globalClient: IWC | undefined

function accessClient() {
  if (globalClient) {
    return globalClient
  }
  throw new Error('The function `initialize` was never called')
}

export function initialize(options?: InitializeOptions): string {
  if (globalClient) {
    return globalClient.sender
  }
  globalClient = new IWC(null, options)
  return globalClient.sender
}

export function ready(callback: () => void) {
  accessClient().ready(callback)
}

export function subscribe(topic: string, handler: MessageHandlerFn) {
  ready(() => {
    accessClient().subscribe(topic, handler)
  })
}
export function subscribeJson<T>(topic: string, handler: (sender: string, message: T, topic: string) => void) {
  subscribe(topic, (sender, message) => {
    let parsed: T
    if (message) { // some topics don't require a message
      parsed = JSON.parse(message)
    }
    handler(sender, parsed, topic)
  })
}
/**
 * Exposed to support building the bcst-owf-interop
 * @param handler 
 */
export function _subscribeAll(handler: MessageHandlerFn) {
   ready(() => {
     accessClient()._subscribeAll(handler)
   })
}
export function _accessClient() {
  return accessClient()
}
  
export function publish(topic: string, message: string) {
  ready(() => {
    accessClient().publish(topic, message)
  })
}
export function publishJson(topic: string, message: any) {
  publish(topic, (typeof message !== 'string') ? JSON.stringify(message) : message)
}

export function unsubscribe(topic: string) {
  ready(() => {
    accessClient().unsubscribe(topic)
  })
}

export const ONR_OWF_INTEROP_SUBSCRIBE = 'onr.owf.interop.subscribe'
