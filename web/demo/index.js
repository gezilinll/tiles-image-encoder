// import { JpegConfigure } from "../dist/dist/types/Configure";
// import { TilesImageEncoder } from "../dist/dist/types/TilesImageEncoder";

import { JpegConfigure, TilesImageEncoder } from '../src/index';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function downloadFile(data, filename) {
  const blob = new Blob([data], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportImage() {
  TilesImageEncoder.init().then(() => {
    let encoder = new TilesImageEncoder((x, y, width, height) => {
      var buffer = new ArrayBuffer(width * height * 3);
      var view = new Uint8Array(buffer);
      for (let index = 0; index < view.byteLength; index++) {
        view.set([getRandomInt(256)], index);
      }
      return view;
    }, (progress) => {
      console.log("progress:" + progress);
    }, (buffer) => {
      downloadFile(buffer, new Date() + ".jpeg");
    });

    let now = performance.now();
    let configure = new JpegConfigure();
    configure.width = 38400;
    configure.height = 19520;
    encoder.configJPEG(configure);
    encoder.execute();
    console.log("cost:" + (performance.now() - now));
  });
}

document.getElementById('export').onclick = () => {
  exportImage();
}