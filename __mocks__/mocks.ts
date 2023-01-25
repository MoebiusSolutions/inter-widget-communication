declare global {
    interface Window {
        Ozone: any;
    }
}

window.OWF = {
    ready: jest.fn(),
    Eventing: {
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
        publish: jest.fn(),
    },
    Util: {
        isRunningInOWF: jest.fn(),
    },
};


window.ozpIwc = {
    Client: {
        connect: jest.fn(() => Boolean),
        isConnected: jest.fn(),
    },
};

export {};