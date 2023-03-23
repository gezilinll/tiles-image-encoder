// import { JpegConfigure } from "../dist/dist/types/Configure";
// import { TilesImageEncoder } from "../dist/dist/types/TilesImageEncoder";

import { JpegConfigure, TilesImageEncoder } from '../dist/tiles-image-encoder';


function downloadFile(data, filename) {
  const blob = new Blob([data], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function exportImage() {
  TilesImageEncoder.init().then(() => {
    const chunks = [];
    const writable = new WritableStream({
      // Implement the sink
      write(chunk) {
        return new Promise((resolve, reject) => {
          chunks.push(chunk);
          resolve();
        });
      },
      close() {
      },
      abort(err) {
        console.log("Sink error:", err);
      }
    });
    const writer = writable.getWriter();

    let encoder = new TilesImageEncoder((x, y, width, height) => {
      var buffer = new ArrayBuffer(width * height * 3);
      var view = new Uint8Array(buffer);
      return view;
    }, (oneByte) => {
      writer.ready
        .then(() => {
          return writer.write(oneByte);
        })
        .then(() => {
          console.log("Chunk written to sink.");
        })
        .catch((err) => {
          console.log("Chunk error:", err);
        });
    }, (progress) => {
      console.log("progress:" + progress);
      if (progress != 1.0) {
        return;
      }
      writer.ready
        .then(() => {
          return writer.close();
        })
        .then(() => {
          const concatenatedData = new Uint8Array(chunks.length);
          let offset = 0;
          chunks.forEach((chunk) => {
            var buffer = new ArrayBuffer(1);
            var view = new Uint8Array(buffer);
            view[0] = chunk;
            concatenatedData.set(view, offset);
            offset++;
          });
          downloadFile(concatenatedData, "Tiles.jpeg");
          console.log("All success!");
        })
        .catch((err) => {
          console.log("Stream error:", err);
        });
    });

    let configure = new JpegConfigure();
    configure.width = 72000;
    configure.height = 72000;
    configure.tileHeight = 536;
    encoder.configJPEG(configure);
    encoder.execute();
  });
}

document.getElementById("export").onclick = () => {
  exportImage();
}