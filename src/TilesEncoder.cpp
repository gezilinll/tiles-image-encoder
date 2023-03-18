//
// Created by gezilinll on 2023/3/18.
//

#include "TilesEncoder.hpp"
#include <algorithm>

TilesEncoder::TilesEncoder(TileGenerator generator, ByteEncoder encoder)
    : mGenerator(generator), mEncoder(encoder) {}

void TilesEncoder::configure(JpegConfigure config) {
    mConfig = config;
    if (mConfig.width <= 0 || mConfig.height <= 0) {
        throw std::string("Invalid image size.");
    }
    if (config.format == ImageFormat::JPEG) {
        mJpegEncoder = std::unique_ptr<JpegEncoder>(new JpegEncoder(mEncoder));
        mJpegEncoder->configure(config);
    }
}

void TilesEncoder::execute() {
    if (mConfig.width <= 0 || mConfig.height <= 0) {
        throw std::string("Invalid image size.");
    }
    if (mJpegEncoder == nullptr) {
        throw std::string("Jpeg encoder is invalid.");
    }

    mJpegEncoder->writeHeader();

    uint16_t yIndex = 0;
    while (true) {
        int height = std::min(8, mConfig.height - yIndex);
        auto pixels = mGenerator(0, yIndex, mConfig.width, height);
        mJpegEncoder->compressPixels(pixels.get(), mConfig.width, height);
        yIndex += height;
        if (yIndex >= mConfig.height) {
            break;
        }
    }

    mJpegEncoder->writeTail();
}