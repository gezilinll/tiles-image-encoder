import { JpegConfigure } from "../src/Configure";
import { TilesImageEncoder } from "../src/TilesImageEncoder";

TilesImageEncoder.init().then(() => {
  let encoder = new TilesImageEncoder((x, y, width, height) => {
    console.log("x:" + x + " y:" + y + " w:" + width + " h:" + height)
    var buffer = new ArrayBuffer(width * height * 3);
    var view = new Uint8Array(buffer);
    return view;
  }, (oneByte) => {

  }, (progress) => {
    console.log("progress:" + progress);
  });
  let configure = new JpegConfigure();
  configure.width = 720;
  configure.height = 720;
  encoder.configJPEG(configure);
  encoder.execute();
  console.log("success");
});