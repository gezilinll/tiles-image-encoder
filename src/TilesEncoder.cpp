//
// Created by gezilinll on 2023/3/18.
//

#include "TilesEncoder.hpp"
#include <algorithm>
#include <chrono>
#include <cmath>

typedef std::chrono::milliseconds ms;
using clk = std::chrono::system_clock;

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
    if (mConfig.tileHeight == 0) {
        mConfig.tileHeight = 8;
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
    float totalTiles = std::ceil(mConfig.height / static_cast<float>(mConfig.tileHeight));
    float processed = 0;
    while (true) {
        if (mProgressCallback) {
            mProgressCallback(std::min(0.99f, processed / totalTiles));
        }
        if (yIndex >= mConfig.height) {
            break;
        }
        uint16_t height
            = std::min(mConfig.tileHeight, static_cast<uint16_t>(mConfig.height - yIndex));
        printf("width:%d, height:%d\n", mConfig.width, height);
        auto pixels = mGenerator(0, yIndex, mConfig.width, height);
        auto beginTime = clk::now();
        mJpegEncoder->compressPixels(pixels.get(), mConfig.width, height);
        yIndex += height;
        processed++;
        auto endTime = clk::now();
        auto duration = std::chrono::duration_cast<ms>(endTime - beginTime);
        printf("compressPixels:%f\n", static_cast<double>(duration.count()));
    }

    mJpegEncoder->writeTail();

    if (mProgressCallback) {
        mProgressCallback(1.0);
    }
}