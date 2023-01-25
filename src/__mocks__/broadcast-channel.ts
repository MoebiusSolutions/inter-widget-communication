export const mockPostMessage = jest.fn()

export const makeBroadcastChannel = jest.fn().mockImplementation(() => {
    return {
        postMessage: mockPostMessage
    }
})
