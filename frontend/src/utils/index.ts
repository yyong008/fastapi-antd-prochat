export function uint8ArrayToString(uint8Array: Uint8Array) {
    // Create a TextDecoder instance
    const decoder = new TextDecoder();
    // Decode the Uint8Array to a string
    return decoder.decode(uint8Array);
}
