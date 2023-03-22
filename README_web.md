# tiles-image-encoder

When we encode super size image, for example 65536x65536, we will face OOM issue at the most, THIS LIBRARY CAN SOLVE THIS!

The encoder just support encode image tile by tile, no more than that, but I found libjpeg or jpeg-turbo or any other jpeg encoder library no support this directly, so I develop this project based on simple JPEG encoder and PNG encoder(TBD), and there is still a lot of work to do, bu it can work anyway.

# Usage

```c++
#include "JpegEncoder.hpp"

// write to file
FILE* file = fopen(targetPath, "wb");

TilesEncoder encoder(
  [&](uint16_t x, uint16_t y, uint16_t w, uint16_t h) {
      ...generate target tile pixels
      return pixels;
  },
  [&](uint8_t oneByte) { 
    // write byte to file
    fputc(oneByte, file);
  });
// config jpeg info
JpegConfigure configure;
configure.width = targetW;
configure.height = targetH;
configure.format = ImageFormat::JPEG;
encoder.configure(configure);
// start to work
encoder.execute();
// wait for the process to finish
```

You can run the example by CMake toolchain, just pay attention to the following:

* config jpeg-turbo library to decode image
  * example/CMakeLists.txt or modify code in example/main.cpp
* tile.jpg must copy to correct directory
  * copy command in example/CMakeLists.txt or modify image path in example/main.cpp

# Next Steps

* PNG
* better ompression ratio
* better performance