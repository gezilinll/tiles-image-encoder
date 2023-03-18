//
// Created by gezilinll on 2023/3/18.
//

#ifndef TILES_IMAGE_ENCODER_CONFIGURE_HPP
#define TILES_IMAGE_ENCODER_CONFIGURE_HPP

#include <stdlib.h>
#include <functional>
#include <memory>
#include <string>

// callback that stores a single byte (writes to disk, memory, ...)
using ByteEncoder = std::function<void(uint8_t oneByte)>;
// callback that request for new tile's pixels to compress
// returned pixels stored in RGB format or grayscale, stored from upper-left to lower-right
using TileGenerator
    = std::function<std::shared_ptr<uint8_t>(uint16_t x, uint16_t y, uint16_t w, uint16_t h, uint64_t current,)>;

enum class ImageFormat {
    JPEG,
    PNG  // TODO
};

struct Configure {
    ImageFormat format = ImageFormat::JPEG;  // target format
    uint16_t width = 0;                      // target width, must > 0
    uint16_t height = 0;                     // target height, must > 0
};

struct JpegConfigure : Configure {
    // compress quality, range:[1, 100]
    uint8_t quality = 100;
    // if true then YCbCr 4:2:0 format is used (smaller size, minor quality loss) instead of 4:4:4,
    // not relevant for grayscale
    bool downSample = false;
    // true if RGB format (3 bytes per pixel); false if grayscale (1 byte per pixel)
    bool isRGB = true;
    // optional JPEG comment (0/NULL if no comment), must not contain ASCII code 0xFF
    std::string comment;
};

#endif  // TILES_IMAGE_ENCODER_CONFIGURE_HPP
