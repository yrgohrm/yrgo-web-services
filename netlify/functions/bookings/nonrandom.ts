/* eslint-disable no-bitwise */

function xoshiro128ss(a: number, b: number, c: number, d: number): () => number {
  return () => {
    const t = b << 9;
    let r = b * 5;
    r = (r << 7 | r >>> 25) * 9;
    c ^= a;
    d ^= b;
    b ^= c;
    a ^= d;
    c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0) / 4294967296;
  }
}

// this will give us the very same random-looking sequence every time
const nonRandom = xoshiro128ss(2516329459, 7397229, 3213755023, 2504815977);

export { nonRandom }
