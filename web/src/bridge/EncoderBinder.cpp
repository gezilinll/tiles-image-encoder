#ifndef INFINITE_CANVAS_BINNDER
#define INFINITE_CANVAS_BINNDER

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include "MemoryFile.hpp"
#include "TilesEncoder.hpp"

using namespace emscripten;

class TilesImageEncoder {
public:
    explicit TilesImageEncoder(emscripten::val generator, emscripten::val progress,
                               emscripten::val compressed)
        : mGeneratorCallback(generator),
          mProgressCallback(progress),
          mCompressedCallback(compressed) {
        mFile = std::make_shared<MemoryFile>();
        mEncoder = std::make_shared<TilesEncoder>(
            std::bind(&TilesImageEncoder::jsCallbackFillPixels, this, std::placeholders::_1,
                      std::placeholders::_2, std::placeholders::_3, std::placeholders::_4),
            std::bind(&TilesImageEncoder::jsCallbackEncodeByte, this, std::placeholders::_1));
        mEncoder->setProgressCallback(
            std::bind(&TilesImageEncoder::jsCallbackProgress, this, std::placeholders::_1));
    }

    ~TilesImageEncoder() {}

    void configJPEG(emscripten::val obj) {
        JpegConfigure configure;
        configure.width = obj["width"].as<uint32_t>();
        configure.height = obj["height"].as<uint32_t>();
        configure.quality = obj["quality"].as<uint8_t>();
        configure.downSample = obj["downSample"].as<bool>();
        configure.isRGB = obj["isRGB"].as<bool>();
        configure.comment = obj["comment"].as<std::string>();
        mEncoder->configure(configure);
    }

    void execute() { mEncoder->execute(); }

    std::shared_ptr<uint8_t> jsCallbackFillPixels(int x, int y, int width, int height) {
        long pixelsPtr = mGeneratorCallback.call<long>("call", 0, x, y, width, height);
        uint8_t* pixels = reinterpret_cast<uint8_t*>(pixelsPtr);
        std::shared_ptr<uint8_t> sharedPixels(pixels, [](uint8_t* data) { free(data); });
        return sharedPixels;
    }

    void jsCallbackProgress(float progress) {
        mProgressCallback(progress);
        if (progress == 1.0) {
            mCompressedCallback(reinterpret_cast<long>(mFile->getBuffer()),
                                static_cast<long>(mFile->getLength()));
        }
    }

    void jsCallbackEncodeByte(uint8_t oneByte) { mFile->writeByte(oneByte); }

private:
    std::shared_ptr<MemoryFile> mFile;
    std::shared_ptr<TilesEncoder> mEncoder;
    emscripten::val mGeneratorCallback;
    emscripten::val mProgressCallback;
    emscripten::val mCompressedCallback;
};

std::shared_ptr<TilesImageEncoder> makeEncoder(emscripten::val generator, emscripten::val progress,
                                               emscripten::val compressed) {
    return std::make_shared<TilesImageEncoder>(generator, progress, compressed);
}

EMSCRIPTEN_BINDINGS(EncoderBinder) {
    function("makeEncoder", select_overload<std::shared_ptr<TilesImageEncoder>(
                                emscripten::val, emscripten::val, emscripten::val)>(&makeEncoder));

    class_<TilesImageEncoder>("TilesImageEncoder")
        .smart_ptr<std::shared_ptr<TilesImageEncoder>>("std::shared_ptr<TilesImageEncoder>")
        .function("configJPEG", &TilesImageEncoder::configJPEG)
        .function("execute", &TilesImageEncoder::execute);
}

#endif  // INFINITE_CANVAS_BINNDER
