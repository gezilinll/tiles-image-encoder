//
// Created by 林炳河 on 2023/3/18.
//

#include "JpegEncoder.hpp"
#include <algorithm>
#include "Jpeg.inl"

JpegEncoder::JpegEncoder(ByteEncoder encoder) : mWriter(BitWriter(encoder)) {}

void JpegEncoder::configure(const JpegConfigure& config) { mConfig = config; }

void JpegEncoder::writeHeader() {
    // number of components
    const auto numComponents = mConfig.isRGB ? 3 : 1;
    // note: if there is just one component (=grayscale), then only luminance needs to be stored in
    // the file thus everything related to chrominance need not to be written to the JPEG
    // I still compute a few things, like quantization tables to avoid a complete code mess

    // grayscale images can't be downsampled (because there are no Cb + Cr channels)
    if (!mConfig.isRGB) {
        mConfig.downSample = false;
    }

    // ////////////////////////////////////////
    // JFIF headers
    const uint8_t HeaderJfif[2 + 2 + 16]
        = {0xFF, 0xD8,  // SOI marker (start of image)
           0xFF, 0xE0,  // JFIF APP0 tag
           0,    16,    // length: 16 bytes (14 bytes payload + 2 bytes for this length field)
           'J',  'F',  'I', 'F', 0,  // JFIF identifier, zero-terminated
           1,    1,                  // JFIF version 1.1
           0,                        // no density units specified
           0,    1,    0,   1,       // density: 1 pixel "per pixel" horizontally and vertically
           0,    0};                 // no thumbnail (size 0 x 0)
    mWriter << HeaderJfif;

    // ////////////////////////////////////////
    // comment (optional)
    if (!mConfig.comment.empty()) {
        auto comment = mConfig.comment.data();
        // look for zero terminator
        auto length = 0;  // = strlen(comment);
        while (comment[length] != 0) {
            length++;
        }

        // write COM marker
        mWriter.addMarker(0xFE, 2 + length);  // block size is number of bytes (without zero
                                              // terminator) + 2 bytes for this length field
        // ... and write the comment itself
        for (auto i = 0; i < length; i++) {
            mWriter << comment[i];
        }
    }

    // ////////////////////////////////////////
    // adjust quantization tables to desired quality

    // quality level must be in 1 ... 100
    auto quality = clamp<uint16_t>(mConfig.quality, 1, 100);
    // convert to an internal JPEG quality factor, formula taken from libjpeg
    quality = quality < 50 ? 5000 / quality : 200 - quality * 2;

    for (auto i = 0; i < 8 * 8; i++) {
        int luminance = (DefaultQuantizeLuminance[ZigZagInv[i]] * quality + 50) / 100;
        int chrominance = (DefaultQuantizeChrominance[ZigZagInv[i]] * quality + 50) / 100;

        // clamp to 1..255
        mQuantizeLuminance[i] = clamp(luminance, 1, 255);
        mQuantizeChrominance[i] = clamp(chrominance, 1, 255);
    }

    // write quantization tables
    mWriter.addMarker(0xDB,
                      // length: 65 bytes per table + 2 bytes for this length field
                      2 + (mConfig.isRGB ? 2 : 1) * (1 + 8 * 8));
    // each table has 64 entries and is preceded by an ID byte

    mWriter << 0x00 << mQuantizeLuminance;  // first  quantization table
    if (mConfig.isRGB) {
        mWriter
            << 0x01
            << mQuantizeChrominance;  // second quantization table, only relevant for color images
    }

    // ////////////////////////////////////////
    // write image infos (SOF0 - start of frame)
    mWriter.addMarker(0xC0, 2 + 6 + 3 * numComponents);  // length: 6 bytes general info + 3 per
                                                         // channel + 2 bytes for this length field

    // 8 bits per channel
    mWriter << 0x08
            // image dimensions (big-endian)
            << (mConfig.height >> 8) << (mConfig.height & 0xFF) << (mConfig.width >> 8)
            << (mConfig.width & 0xFF);

    // sampling and quantization tables for each component
    mWriter << numComponents;  // 1 component (grayscale, Y only) or 3 components (Y,Cb,Cr)
    for (auto id = 1; id <= numComponents; id++) {
        mWriter << id  // component ID (Y=1, Cb=2, Cr=3)
                       // bitmasks for sampling: highest 4 bits: horizontal, lowest 4 bits: vertical
                << (id == 1 && mConfig.downSample
                        ? 0x22
                        : 0x11)  // 0x11 is default YCbCr 4:4:4 and 0x22 stands for YCbCr 4:2:0
                << (id == 1 ? 0 : 1);  // use quantization table 0 for Y, table 1 for Cb and Cr
    }

    // ////////////////////////////////////////
    // Huffman tables
    // DHT marker - define Huffman tables
    mWriter.addMarker(0xC4, mConfig.isRGB ? (2 + 208 + 208) : (2 + 208));
    // 2 bytes for the length field, store chrominance only if needed
    //   1+16+12  for the DC luminance
    //   1+16+162 for the AC luminance   (208 = 1+16+12 + 1+16+162)
    //   1+16+12  for the DC chrominance
    //   1+16+162 for the AC chrominance (208 = 1+16+12 + 1+16+162, same as above)

    // store luminance's DC+AC Huffman table definitions
    mWriter << 0x00  // highest 4 bits: 0 => DC, lowest 4 bits: 0 => Y (baseline)
            << DcLuminanceCodesPerBitSize << DcLuminanceValues;
    mWriter << 0x10  // highest 4 bits: 1 => AC, lowest 4 bits: 0 => Y (baseline)
            << AcLuminanceCodesPerBitSize << AcLuminanceValues;

    // compute actual Huffman code tables (see Jon's code for precalculated tables)
    generateHuffmanTable(DcLuminanceCodesPerBitSize, DcLuminanceValues, mHuffmanLuminanceDC);
    generateHuffmanTable(AcLuminanceCodesPerBitSize, AcLuminanceValues, mHuffmanLuminanceAC);

    // chrominance is only relevant for color images
    if (mConfig.isRGB) {
        // store luminance's DC+AC Huffman table definitions
        mWriter << 0x01  // highest 4 bits: 0 => DC, lowest 4 bits: 1 => Cr,Cb (baseline)
                << DcChrominanceCodesPerBitSize << DcChrominanceValues;
        mWriter << 0x11  // highest 4 bits: 1 => AC, lowest 4 bits: 1 => Cr,Cb (baseline)
                << AcChrominanceCodesPerBitSize << AcChrominanceValues;

        // compute actual Huffman code tables (see Jon's code for precalculated tables)
        generateHuffmanTable(DcChrominanceCodesPerBitSize, DcChrominanceValues,
                             mHuffmanChrominanceDC);
        generateHuffmanTable(AcChrominanceCodesPerBitSize, AcChrominanceValues,
                             mHuffmanChrominanceAC);
    }

    // ////////////////////////////////////////
    // start of scan (there is only a single scan for baseline JPEGs)
    mWriter.addMarker(0xDA,
                      2 + 1 + 2 * numComponents
                          + 3);  // 2 bytes for the length field, 1 byte for number of components,
    // then 2 bytes for each component and 3 bytes for spectral selection

    // assign Huffman tables to each component
    mWriter << numComponents;
    for (auto id = 1; id <= numComponents; id++)
        // highest 4 bits: DC Huffman table, lowest 4 bits: AC Huffman table
        mWriter << id
                << (id == 1 ? 0x00
                            : 0x11);  // Y: tables 0 for DC and AC; Cb + Cr: tables 1 for DC and AC

    // constant values for our baseline JPEGs (which have a single sequential scan)
    static const uint8_t Spectral[3] = {
        0, 63, 0};  // spectral selection: must be from 0 to 63; successive approximation must be 0
    mWriter << Spectral;
}

void JpegEncoder::compressPixels(const uint8_t* pixels, const uint16_t width,
                                 const uint16_t height) {
    // adjust quantization tables with AAN scaling factors to simplify DCT
    float scaledLuminance[8 * 8];
    float scaledChrominance[8 * 8];
    for (auto i = 0; i < 8 * 8; i++) {
        auto row = ZigZagInv[i] / 8;     // same as ZigZagInv[i] >> 3
        auto column = ZigZagInv[i] % 8;  // same as ZigZagInv[i] &  7

        // scaling constants for AAN DCT algorithm: AanScaleFactors[0] = 1, AanScaleFactors[k=1..7]
        // = cos(k*PI/16) * sqrt(2)
        static const float AanScaleFactors[8] = {1, 1.387039845f, 1.306562965f, 1.175875602f,
                                                 1, 0.785694958f, 0.541196100f, 0.275899379f};
        auto factor = 1 / (AanScaleFactors[row] * AanScaleFactors[column] * 8);
        scaledLuminance[ZigZagInv[i]] = factor / mQuantizeLuminance[i];
        scaledChrominance[ZigZagInv[i]] = factor / mQuantizeChrominance[i];
        // if you really want JPEGs that are bitwise identical to Jon Olick's code then you need
        // slightly different formulas (note: sqrt(8) = 2.828427125f)
        // static const float aasf[] = { 1.0f * 2.828427125f, 1.387039845f
        // * 2.828427125f, 1.306562965f * 2.828427125f, 1.175875602f * 2.828427125f, 1.0f
        // * 2.828427125f, 0.785694958f * 2.828427125f, 0.541196100f * 2.828427125f, 0.275899379f
        // * 2.828427125f }; // line 240 of jo_jpeg.cpp scaledLuminance  [ZigZagInv[i]] = 1 /
        // (quantLuminance  [i] * aasf[row] * aasf[column]); // lines 266-267 of jo_jpeg.cpp
        // scaledChrominance[ZigZagInv[i]] = 1 / (quantChrominance[i] * aasf[row] * aasf[column]);
    }

    // precompute JPEG codewords for quantized DCT
    BitCode codewordsArray[2 * CodeWordLimit];  // note: quantized[i] is found at
                                                // codewordsArray[quantized[i] + CodeWordLimit]
    BitCode* codewords = &codewordsArray[CodeWordLimit];  // allow negative indices, so quantized[i]
                                                          // is at codewords[quantized[i]]
    uint8_t numBits = 1;  // each codeword has at least one bit (value == 0 is undefined)
    int32_t mask = 1;     // mask is always 2^numBits - 1, initial value 2^1-1 = 2-1 = 1
    for (int16_t value = 1; value < CodeWordLimit; value++) {
        // numBits = position of highest set bit (ignoring the sign)
        // mask    = (2^numBits) - 1
        if (value > mask)  // one more bit ?
        {
            numBits++;
            mask = (mask << 1) | 1;  // append a set bit
        }
        // note that I use a negative index =>
        // codewords[-value] = codewordsArray[CodeWordLimit  value]
        codewords[-value] = BitCode(mask - value, numBits);
        codewords[+value] = BitCode(value, numBits);
    }

    // the next two variables are frequently used when checking for image borders
    const auto maxWidth = width - 1;    // "last row"
    const auto maxHeight = height - 1;  // "bottom line"

    // process MCUs (minimum codes units) => image is subdivided into a grid of 8x8 or 16x16 tiles
    const auto sampling = mConfig.downSample ? 2 : 1;  // 1x1 or 2x2 sampling
    const auto mcuSize = 8 * sampling;

    // convert from RGB to YCbCr
    float Y[8][8], Cb[8][8], Cr[8][8];

    for (auto mcuY = 0; mcuY < height; mcuY += mcuSize)  // each step is either 8 or 16 (=mcuSize)
        for (auto mcuX = 0; mcuX < width; mcuX += mcuSize) {
            // YCbCr 4:4:4 format: each MCU is a 8x8 block - the same applies to grayscale images,
            // too YCbCr 4:2:0 format: each MCU represents a 16x16 block, stored as 4x 8x8 Y-blocks
            // plus 1x 8x8 Cb and 1x 8x8 Cr block)
            for (auto blockY = 0; blockY < mcuSize;
                 blockY += 8)  // iterate once (YCbCr444 and grayscale) or twice (YCbCr420)
                for (auto blockX = 0; blockX < mcuSize; blockX += 8) {
                    // now we finally have an 8x8 block ...
                    for (auto deltaY = 0; deltaY < 8; deltaY++) {
                        // must not exceed image borders, replicate last row/column if needed
                        auto column = std::min(mcuX + blockX, maxWidth);
                        auto row = std::min(mcuY + blockY + deltaY, maxHeight);
                        for (auto deltaX = 0; deltaX < 8; deltaX++) {
                            // find actual pixel position within the current image
                            // the cast ensures that we don't run into multiplication overflows
                            auto pixelPos = row * width + column;
                            if (column < maxWidth) {
                                column++;
                            }

                            // grayscale images have solely a Y channel which can be easily derived
                            // from the input pixel by shifting it by 128
                            if (!mConfig.isRGB) {
                                Y[deltaY][deltaX] = pixels[pixelPos] - 128.f;
                                continue;
                            }

                            // RGB: 3 bytes per pixel (whereas grayscale images have only 1 byte per
                            // pixel)
                            auto r = pixels[3 * pixelPos];
                            auto g = pixels[3 * pixelPos + 1];
                            auto b = pixels[3 * pixelPos + 2];

                            // again, the JPEG standard requires Y to be shifted by 128
                            Y[deltaY][deltaX] = rgb2y(r, g, b) - 128;
                            // YCbCr444 is easy - the more complex YCbCr420 has to be computed about
                            // 20 lines below in a second pass
                            if (!mConfig.downSample) {
                                // standard RGB-to-YCbCr conversion
                                Cb[deltaY][deltaX] = rgb2cb(r, g, b);
                                Cr[deltaY][deltaX] = rgb2cr(r, g, b);
                            }
                        }
                    }

                    // encode Y channel
                    mLastYDC = encodeBlock(mWriter, Y, scaledLuminance, mLastYDC,
                                           mHuffmanLuminanceDC, mHuffmanLuminanceAC, codewords);
                    // Cb and Cr are encoded about 50 lines below
                }

            // grayscale images don't need any Cb and Cr information
            if (!mConfig.isRGB) {
                continue;
            }

            // ////////////////////////////////////////
            // the following lines are only relevant for YCbCr420:
            // average/downsample chrominance of four pixels while respecting the image borders
            if (mConfig.downSample)
                // iterating loop in reverse increases cache read efficiency
                for (short deltaY = 7; mConfig.downSample && deltaY >= 0; deltaY--) {
                    // each deltaX/Y step covers a 2x2 area column is updated inside next loop
                    auto row = std::min(mcuY + 2 * deltaY, maxHeight);
                    auto column = mcuX;
                    auto pixelPos = (row * width + column) * 3;  // numComponents = 3

                    // deltas (in bytes) to next row / column, must not exceed image borders
                    auto rowStep = (row < maxHeight)
                                       ? 3 * width
                                       : 0;  // always numComponents*width except for bottom    line
                    auto columnStep = (column < maxWidth)
                                          ? 3
                                          : 0;  // always numComponents except for rightmost pixel

                    for (short deltaX = 0; deltaX < 8; deltaX++) {
                        // let's add all four samples (2x2 area)
                        auto right = pixelPos + columnStep;
                        auto down = pixelPos + rowStep;
                        auto downRight = pixelPos + columnStep + rowStep;

                        // note: cast from 8 bits to >8 bits to avoid overflows when adding
                        auto r = short(pixels[pixelPos]) + pixels[right] + pixels[down]
                                 + pixels[downRight];
                        auto g = short(pixels[pixelPos + 1]) + pixels[right + 1] + pixels[down + 1]
                                 + pixels[downRight + 1];
                        auto b = short(pixels[pixelPos + 2]) + pixels[right + 2] + pixels[down + 2]
                                 + pixels[downRight + 2];

                        // convert to Cb and Cr
                        // I still have to divide r,g,b by 4 to get their average values
                        Cb[deltaY][deltaX] = rgb2cb(r, g, b) / 4;
                        // it's a bit faster if done AFTER CbCr conversion
                        Cr[deltaY][deltaX] = rgb2cr(r, g, b) / 4;

                        // step forward to next 2x2 area
                        pixelPos += 2 * 3;  // 2 pixels => 6 bytes (2*numComponents)
                        column += 2;

                        // reached right border ?
                        if (column >= maxWidth) {
                            columnStep = 0;
                            pixelPos = ((row + 1) * width - 1)
                                       * 3;  // same as (row * width + maxWidth) * numComponents =>
                                             // current's row last pixel
                        }
                    }
                }  // end of YCbCr420 code for Cb and Cr

            // encode Cb and Cr
            mLastCbDC = encodeBlock(mWriter, Cb, scaledChrominance, mLastCbDC,
                                    mHuffmanChrominanceDC, mHuffmanChrominanceAC, codewords);
            mLastCrDC = encodeBlock(mWriter, Cr, scaledChrominance, mLastCrDC,
                                    mHuffmanChrominanceDC, mHuffmanChrominanceAC, codewords);
        }
}

void JpegEncoder::writeTail() {
    mWriter.flush();  // now image is completely encoded, write any bits still left in the buffer

    // ///////////////////////////
    // EOI marker
    mWriter << 0xFF << 0xD9;  // this marker has no length, therefore I can't use addMarker()
}