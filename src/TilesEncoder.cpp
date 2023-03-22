//
// Created by gezilinll on 2023/3/18.
//

#include "TilesEncoder.hpp"
#include <algorithm>
#include <cmath>

TilesEncoder::TilesEncoder(TileGenerator generator, ByteEncoder encoder)
    : mGenerator(generator), mEncoder(encoder), mProgressCallback(nullptr) {
    if (mGenerator == nullptr || mEncoder == nullptr) {
        throw std::string("Invalid generator or encoder.");
    }
}

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

void TilesEncoder::setProgressCallback(ProgressCallback callback) { mProgressCallback = callback; }

void TilesEncoder::execute() {
    if (mConfig.width <= 0 || mConfig.height <= 0) {
        throw std::string("Invalid image size.");
    }
    if (mJpegEncoder == nullptr) {
        throw std::string("Jpeg encoder is invalid.");
    }

    mJpegEncoder->writeHeader();

    uint16_t yIndex = 0;
    float totalTiles = std::ceil(mConfig.height / 8.0);
    float processed = 0;
    while (true) {
        if (mProgressCallback) {
            mProgressCallback(processed / totalTiles);
        }
        if (yIndex >= mConfig.height) {
            break;
        }
        int height = std::min(8, mConfig.height - yIndex);
        auto pixels = mGenerator(0, yIndex, mConfig.width, height);
        mJpegEncoder->compressPixels(pixels.get(), mConfig.width, height);
        yIndex += height;
        processed++;
    }

    mJpegEncoder->writeTail();
}