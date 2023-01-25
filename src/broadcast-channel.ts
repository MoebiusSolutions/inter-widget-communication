// Separated out into a small file so that Jest can mock this implementation

export function makeBroadcastChannel(name: string) {
    return new BroadcastChannel(name);
}
