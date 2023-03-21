#ifndef INFINITE_CANVAS_BINNDER
#define INFINITE_CANVAS_BINNDER

#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/html5.h>
#include <emscripten/val.h>
#include "TilesEncoder.hpp"

using namespace emscripten;

class TilesImageEncoder {
public:
    explicit TilesImageEncoder(emscripten::val generator, emscripten::val encoder)
        : mGeneratorCallback(generator), mEncodeByteCallback(encoder) {
        mEncoder = std::make_shared<TilesEncoder>(
            std::bind(&TilesImageEncoder::jsCallbackFillPixels, this, std::placeholders::_1,
                      std::placeholders::_2, std::placeholders::_3, std::placeholders::_4),
            std::bind(&TilesImageEncoder::jsCallbackEncodeByte, this, std::placeholders::_1));
    }

    std::shared_ptr<uint8_t> jsCallbackFillPixels(int x, int y, int width, int height) {
        long pixelsPtr = mGeneratorCallback.call<long>("call", x, y, width, height);
        return nullptr;
    }

    void jsCallbackEncodeByte(uint8_t oneByte) { mEncodeByteCallback(oneByte); }

private:
    std::shared_ptr<TilesEncoder> mEncoder;
    emscripten::val mGeneratorCallback;
    emscripten::val mEncodeByteCallback;
};

std::shared_ptr<TilesImageEncoder> makeEncoder(emscripten::val generator, emscripten::val encoder) {
    return std::make_shared<TilesImageEncoder>(generator, encoder);
}

EMSCRIPTEN_BINDINGS(EncoderBinder) {
    function("makeEncoder",
             select_overload<std::shared_ptr<TilesImageEncoder>(emscripten::val, emscripten::val)>(
                 &makeEncoder));

    class_<TilesImageEncoder>("TilesImageEncoder")
        .smart_ptr<std::shared_ptr<TilesImageEncoder>>("std::shared_ptr<TilesImageEncoder>");
}

#endif  // INFINITE_CANVAS_BINNDER
