/**
 * @internal
 */
declare global {
    interface Window {
      OWF: any;
      Ozone: any;
      ozpIwc: any;
    }
  }

export interface IwcClient {
    connect: () => Promise<any>;
    isConnected: () => boolean;
    data: {
        Reference: {
            new (resource: string, config: {} | null): {
                get: () => Promise<any>;
                bulkGet: () => Promise<any[]>;
                list: () => Promise<string[]>;
                set: (value: any) => Promise<void>;
                delete: () => Promise<void>;
                watch: (
                    callback: (
                        change: {
                            newValue: any;
                            oldValue: any;
                            deleted: boolean 
                            },
                        done: () => void
                    ) => void
                ) => Promise<any>;
                unwatch: (value: any) => void;
            };
        };
    };
}

export interface InitializeOptions {
    provider?: 'any' | 'owf' | 'ozp-iwc' | 'broadcast'
    busUrl?: string
    /** Prefix to add to the senderId */
    prefix?: string
    /**
     * The `search` option allows some options
     * to be parsed from the current URL.
     * Typically `search` will be set to `window.location.search` using
     * ```
     * initialize({
     *   search: window.location.search
     * })
     * ```
     * The `provider` and `busUrl` are parsed from the `iwc` and `busUrl`
     * search parameters.
     * These default to 
     * ```
     * {
     *   provider: "broadcast",
     *   busUrl: "bcst-bus/index.html"
     * }```
     */
    search?: string
}

export type MessageHandlerFn = (sender: string, message: any, channel: string) => void

export interface IWCMethods {
    sender: string
    ready: (callback: () => void, options?: InitializeOptions) => void
    subscribe: (topic: string, handler: MessageHandlerFn) => void
    unsubscribe: (topic: string) => void
    publish: (topic: string, message: string) => void
}
