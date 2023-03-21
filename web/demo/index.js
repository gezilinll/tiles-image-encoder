import { TilesImageEncoder } from "../src/TilesImageEncoder";

TilesImageEncoder.init().then(() => {
  console.log("AAAA");
  let encoder = new TilesImageEncoder((x, y, width, height) => {
    console.log("x:" + x + " y:" + y + " w:" + width + " h:" + height)
    var buffer = new ArrayBuffer(1);
    var view = new Uint8Array(buffer);
    return view;
  }, (oneByte) => {
    console.log("oneByte:" + oneByte);
  });
  console.log("success");
});