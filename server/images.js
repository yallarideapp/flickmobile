// Bounded container validation, not image decoding or re-encoding. Uploaded bytes
// stay unchanged. The browser editor resizes/re-encodes before uploading.
const tag = (bytes, start, length = 4) =>
  String.fromCharCode(...bytes.subarray(start, start + length));
const dimensions = (w, h) =>
  w > 0 && h > 0 && w <= 8192 && h <= 8192 && w * h <= 16000000;
export function detectedImage(data) {
  if (!(data instanceof Uint8Array) || data.length < 12) return null;
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => data[i] === v)) {
    let at = 8,
      first = true,
      image = false;
    while (at + 12 <= data.length) {
      const length = view.getUint32(at),
        name = tag(data, at + 4);
      if (!/^[A-Za-z]{4}$/.test(name) || length > data.length - at - 12)
        return null;
      if (first) {
        if (
          name !== "IHDR" ||
          length !== 13 ||
          !dimensions(view.getUint32(at + 8), view.getUint32(at + 12))
        )
          return null;
        const depth = data[at + 16],
          color = data[at + 17];
        if (
          !{
            0: [1, 2, 4, 8, 16],
            2: [8, 16],
            3: [1, 2, 4, 8],
            4: [8, 16],
            6: [8, 16],
          }[color]?.includes(depth) ||
          data[at + 18] !== 0 ||
          data[at + 19] !== 0 ||
          data[at + 20] > 1
        )
          return null;
        first = false;
      } else if (name === "IHDR") return null;
      if (name === "IDAT" && length > 0) image = true;
      at += length + 12;
      if (name === "IEND")
        return image && length === 0 && at === data.length ? "image/png" : null;
    }
    return null;
  }
  if (data[0] === 0xff && data[1] === 0xd8) {
    let at = 2,
      frame = false,
      scan = false;
    while (at < data.length) {
      if (data[at++] !== 0xff) return null;
      while (data[at] === 0xff) at++;
      const marker = data[at++];
      if (marker === 0xd9)
        return frame && scan && at === data.length ? "image/jpeg" : null;
      if (
        marker === undefined ||
        marker === 0 ||
        marker === 0xd8 ||
        at + 2 > data.length
      )
        return null;
      if (marker >= 0xd0 && marker <= 0xd7) continue;
      const length = view.getUint16(at);
      if (length < 2 || at + length > data.length) return null;
      if (
        [
          0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd,
          0xce, 0xcf,
        ].includes(marker)
      ) {
        if (
          length < 8 ||
          !dimensions(view.getUint16(at + 5), view.getUint16(at + 3))
        )
          return null;
        frame = true;
      }
      at += length;
      if (marker === 0xda) {
        if (!frame) return null;
        scan = true;
        while (at < data.length) {
          if (data[at] !== 0xff) {
            at++;
            continue;
          }
          const next = data[at + 1];
          if (next === 0 || (next >= 0xd0 && next <= 0xd7)) {
            at += 2;
            continue;
          }
          break;
        }
      }
    }
    return null;
  }
  if (
    tag(data, 0) === "RIFF" &&
    tag(data, 8) === "WEBP" &&
    view.getUint32(4, true) + 8 === data.length
  ) {
    let at = 12,
      image = false;
    while (at + 8 <= data.length) {
      const name = tag(data, at),
        length = view.getUint32(at + 4, true),
        body = at + 8;
      if (!length || length > data.length - body) return null;
      if (name === "VP8 ") {
        if (
          length < 10 ||
          tag(data, body + 3, 3) !== "\x9d\x01\x2a" ||
          !dimensions(
            view.getUint16(body + 6, true) & 0x3fff,
            view.getUint16(body + 8, true) & 0x3fff,
          )
        )
          return null;
        image = true;
      } else if (name === "VP8L") {
        if (length < 5 || data[body] !== 0x2f) return null;
        const bits = view.getUint32(body + 1, true);
        if (!dimensions((bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1))
          return null;
        image = true;
      } else if (name === "VP8X") {
        if (length !== 10) return null;
        const w =
            1 + data[body + 4] + (data[body + 5] << 8) + (data[body + 6] << 16),
          h =
            1 + data[body + 7] + (data[body + 8] << 8) + (data[body + 9] << 16);
        if (!dimensions(w, h)) return null;
      }
      at = body + length + (length & 1);
    }
    return image && at === data.length ? "image/webp" : null;
  }
  return null;
}
