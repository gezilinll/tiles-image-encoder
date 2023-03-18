//
// Created by gezilinll on 2023/3/18.
//

#ifndef TILESIMAGEENCODER_JPEGENCODER_HPP
#define TILESIMAGEENCODER_JPEGENCODER_HPP

#include "BitWriter.hpp"

/**
 * @brief
 *
 */
class JpegEncoder {
public:
    /**
     * Create encoder
     * @param encoder callback that stores a single byte
     */
    JpegEncoder(ByteEncoder encoder);

    /**
     * Config encoder before everything
     * @param config configure info
     */
    void configure(const JpegConfigure& config);

    /**
     * Write header of file first
     */
    void writeHeader();

    /**
     * Compress input pixels after header written
     * note: width * height must can be separate by 8x8 block, if (width % 8 != 0) then height
     * should % 8 = 0, unless input pixels is the last batch note: pixels must fill width first,
     * because JPEG compress data is from left to right first
     * @param pixels
     * @param width
     * @param height
     */
    void compressPixels(const uint8_t* pixels, const uint16_t width, const uint16_t height);

    /**
     * Write tal of file after all
     */
    void writeTail();

private:
    JpegConfigure mConfig;
    BitWriter mWriter;

    uint8_t mQuantizeLuminance[8 * 8] = {0};
    uint8_t mQuantizeChrominance[8 * 8] = {0};

    BitCode mHuffmanLuminanceDC[256];
    BitCode mHuffmanLuminanceAC[256];
    BitCode mHuffmanChrominanceDC[256];
    BitCode mHuffmanChrominanceAC[256];

    int16_t mLastYDC = 0, mLastCbDC = 0, mLastCrDC = 0;
};

#endif  // TILESIMAGEENCODER_JPEGENCODER_HPP
