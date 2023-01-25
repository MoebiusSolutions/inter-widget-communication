import { BcstImpl } from '../src/bcst-impl'

jest.mock('../src/broadcast-channel')

describe('Tests BcstImpl', () => {
    test('construction with prefix option', () => {
        const b = new BcstImpl({
            prefix: 'test-prefix'
        })
        const s = b.sender.startsWith('test-prefix:')
        expect(s).toBe(true)
    })
    test('construction without prefix option', () => {
        const b = new BcstImpl({
        })
        const s = b.sender.startsWith('test-prefix:')
        expect(s).toBe(false)
    })
})
