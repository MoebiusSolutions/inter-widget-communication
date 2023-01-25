import { IWCMethods, MessageHandlerFn } from "./types";

export class OWFImpl implements IWCMethods {
    get sender() {
        return window.OWF.getInstanceId()
    }
    ready(callback: () => void) {
      window.OWF.ready(() => callback())    
    }
    subscribe(topic: string, handler: MessageHandlerFn) {
      window.OWF.Eventing.subscribe(topic, handler);
    }
    unsubscribe(topic: string) {
      window.OWF.Eventing.unsubscribe(topic);
    }
    publish(topic: string, message: string) {
      window.OWF.Eventing.publish(topic, message);
    }
}
