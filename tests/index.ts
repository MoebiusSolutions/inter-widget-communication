// @ts-expect-error
import { mockPostMessage } from '../src/broadcast-channel';

import IWC from '../src/index'
import '../__mocks__/mocks';

jest.mock('../src/broadcast-channel')

describe('Tests InterWidgetCoummunication', () => {
    describe('OWF is active', () => {
        let iwc = null

        beforeAll(() => {
            (window.OWF.Util.isRunningInOWF as jest.Mock).mockReturnValue(true);

            // Mocks are setup, call constructor
            iwc = new IWC();
        })
    
    
        test('OWF is ready', () => {
            let readyFlag = false;
            window.OWF.ready = jest.fn(callback => callback())
    
            iwc.ready(() => {
                readyFlag = true;
            })
    
            expect(readyFlag).toBe(true);
        });
    
        test('OWF eventing subscribes', () => {
            let handleFlag = false;
            window.OWF.Eventing.subscribe = jest.fn(() => handleFlag = true);
    
            iwc.subscribe('IWC-sub', () => {})
    
            expect(handleFlag).toBe(true);
        });
    
        test('OWF eventing unsubscribes', () => {
            let handleFlag = false;
            window.OWF.Eventing.unsubscribe = jest.fn(() => handleFlag = true);
    
            iwc.unsubscribe('IWC-sub')
    
            expect(handleFlag).toBe(true);
        });
    
        test('OWF eventing publishes', () => {
            let publishFlag = false;
            const topic = 'IWC';
            const message = 'published';
    
            window.OWF.Eventing.publish = jest.fn((topic, message) => {
                publishFlag = true
            });
    
            iwc.publish(topic, message);
    
            expect(publishFlag).toBe(true);
        });
    
    });

    describe('IWC is active', () => {
        let iwc = null

        beforeAll(() => {
            (window.OWF.Util.isRunningInOWF as jest.Mock).mockReturnValue(false);
            (window.ozpIwc.Client.isConnected as jest.Mock).mockRejectedValue(true);

            // Mocks are setup, call constructor
            iwc = new IWC();
        })
    
    
        test('IWC is ready', () => {
            let readyFlag = false;
            iwc.ready = jest.fn(callback => callback())
    
            iwc.ready(() => {
                readyFlag = true;
            })
    
            expect(readyFlag).toBe(true);
        });
    
        test('IWC eventing subscribes', () => {
            let handleFlag = false;
            iwc.subscribe = jest.fn(() => handleFlag = true);
    
            iwc.subscribe('IWC-sub', () => {})
    
            expect(handleFlag).toBe(true);
        });
    
        test('IWC eventing unsubscribes', () => {
            let handleFlag = false;
            iwc.unsubscribe = jest.fn(() => handleFlag = true);
    
            iwc.unsubscribe('IWC-sub')
    
            expect(handleFlag).toBe(true);
        });
    
        test('IWC eventing publishes', () => {
            let publishFlag = false;
            const topic = 'IWC';
            const message = 'published';
    
            iwc.publish = jest.fn((topic, message) => {
                publishFlag = true
            });
    
            iwc.publish(topic, message);
    
            expect(publishFlag).toBe(true);
        });
    
    });

    describe('OWF and IWC are inactive (BroadcastChannel)', () => {
        let iwc = null

        beforeAll(() => {
            (window.OWF.Util.isRunningInOWF as jest.Mock).mockReturnValue(false);
            window.ozpIwc = null

            // Mocks are setup, call constructor
            iwc = new IWC();
        })

        afterEach(() => {
            jest.clearAllMocks()
        })
    
    
        test('BroadcastChannel is ready', () => {
            const handler = jest.fn()
    
            iwc.ready(handler)
    
            expect(handler).toHaveBeenCalledTimes(1)
        });
    
        test('BroadcastChannel eventing subscribes', () => {
            iwc.subscribe('BroadcastChannel-sub', () => {})
    
            expect(mockPostMessage).toHaveBeenCalledTimes(1)
            const m = mockPostMessage as jest.Mock
            expect(m.mock.calls[0][0].channel).toBe('onr.owf.interop.subscribe')
            expect(m.mock.calls[0][0].payload).toBe('BroadcastChannel-sub')
        });
    
        test('BroadcastChannel eventing unsubscribes', () => {
            let handleFlag = false;
            iwc.unsubscribe = jest.fn(() => handleFlag = true);
    
            iwc.unsubscribe('BroadcastChannel-sub')
    
            expect(handleFlag).toBe(true);
        });
    
        test('BroadcastChannel eventing publishes', () => {
            const topic = 'IWC';
            const message = 'published';
    
            iwc.publish(topic, message);

            expect(mockPostMessage).toHaveBeenCalledTimes(1)
        });
    
    });

})

