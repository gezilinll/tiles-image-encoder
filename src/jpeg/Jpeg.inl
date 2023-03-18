#include <stdlib.h>

// quantization tables from JPEG Standard, Annex K
// there are a few experts proposing slightly more efficient values,
// e.g. https://www.imagemagick.org/discourse-server/viewtopic.php?t=20333
// btw: Google's Guetzli project optimizes the quantization tables per image
const uint8_t DefaultQuantizeLuminance[8 * 8]
    = {16, 11, 10, 16, 24,  40,  51,  61,  12, 12, 14, 19, 26,  58,  60,  55,
       14, 13, 16, 24, 40,  57,  69,  56,  14, 17, 22, 29, 51,  87,  80,  62,
       18, 22, 37, 56, 68,  109, 103, 77,  24, 35, 55, 64, 81,  104, 113, 92,
       49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99};
const uint8_t DefaultQuantizeChrominance[8 * 8]
    = {17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99,
       99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
       99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99};
// 8x8 blocks are processed in zig-zag order
// most encoders use a zig-zag "forward" table, I switched to its inverse for performance reasons
// note: ZigZagInv[ZigZag[i]] = i
const uint8_t ZigZagInv[8 * 8]
    = {0,  1,  8,  16, 9,  2,  3,  10,   // ZigZag[] =  0, 1, 5, 6,14,15,27,28,
       17, 24, 32, 25, 18, 11, 4,  5,    //             2, 4, 7,13,16,26,29,42,
       12, 19, 26, 33, 40, 48, 41, 34,   //             3, 8,12,17,25,30,41,43,
       27, 20, 13, 6,  7,  14, 21, 28,   //             9,11,18,24,31,40,44,53,
       35, 42, 49, 56, 57, 50, 43, 36,   //            10,19,23,32,39,45,52,54,
       29, 22, 15, 23, 30, 37, 44, 51,   //            20,22,33,38,46,51,55,60,
       58, 59, 52, 45, 38, 31, 39, 46,   //            21,34,37,47,50,56,59,61,
       53, 60, 61, 54, 47, 55, 62, 63};  //            35,36,48,49,57,58,62,63

// static Huffman code tables from JPEG standard Annex K
// - CodesPerBitsize tables define how many Huffman codes will have a certain bitsize (plus 1
// because there nothing with zero bits),
//   e.g. DcLuminanceCodesPerBitsize[2] = 5 because there are 5 Huffman codes being 2+1=3 bits long
// - Values tables are a list of values ordered by their Huffman code bitsize,
//   e.g. AcLuminanceValues => Huffman(0x01,0x02 and 0x03) will have 2 bits, Huffman(0x00) will have
//   3 bits, Huffman(0x04,0x11 and 0x05) will have 4 bits, ...

// Huffman definitions for first DC/AC tables (luminance / Y channel)
const uint8_t DcLuminanceCodesPerBitSize[16]
    = {0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0};                        // sum = 12
const uint8_t DcLuminanceValues[12] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11};  // => 12 codes
const uint8_t AcLuminanceCodesPerBitSize[16]
    = {0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125};  // sum = 162
const uint8_t AcLuminanceValues[162] =                     // => 162 codes
    {0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
     0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,  // 16*10+2 symbols because
     0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0A, 0x16,
     0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,  // upper 4 bits can be 0..F
     0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
     0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,  // while lower 4 bits can be 1..A
     0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
     0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,  // plus two special codes 0x00 and
                                                      // 0xF0
     0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5, 0xA6, 0xA7,
     0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,  // order of these symbols was
                                                      // determined empirically by JPEG
                                                      // committee
     0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2, 0xD3, 0xD4,
     0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA,
     0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA};
// Huffman definitions for second DC/AC tables (chrominance / Cb and Cr channels)
const uint8_t DcChrominanceCodesPerBitSize[16]
    = {0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0};  // sum = 12
const uint8_t DcChrominanceValues[12]
    = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11};  // => 12 codes (identical to DcLuminanceValues)
const uint8_t AcChrominanceCodesPerBitSize[16]
    = {0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119};  // sum = 162
const uint8_t AcChrominanceValues[162] =                   // => 162 codes
    {0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
     0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,  // same number of symbol, just different
                                                      // order
     0xA1, 0xB1, 0xC1, 0x09, 0x23, 0x33, 0x52, 0xF0, 0x15, 0x62, 0x72, 0xD1, 0x0A, 0x16, 0x24, 0x34,
     0xE1, 0x25, 0xF1, 0x17, 0x18, 0x19, 0x1A, 0x26,  // (which is more efficient for AC
                                                      // coding)
     0x27, 0x28, 0x29, 0x2A, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
     0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
     0x69, 0x6A, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7A, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
     0x88, 0x89, 0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3, 0xA4, 0xA5,
     0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6, 0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3,
     0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9, 0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA,
     0xE2, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8,
     0xF9, 0xFA};
const int16_t CodeWordLimit = 2048;  // +/-2^11, maximum value after DCT

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// restrict a value to the interval [minimum, maximum]
template <typename Number, typename Limit>
Number clamp(Number value, Limit minValue, Limit maxValue) {
    if (value <= minValue) return minValue;  // never smaller than the minimum
    if (value >= maxValue) return maxValue;  // never bigger  than the maximum
    return value;                            // value was inside interval, keep it
}

// convert from RGB to YCbCr, constants are similar to ITU-R, see
// https://en.wikipedia.org/wiki/YCbCr#JPEG_conversion
float rgb2y(float r, float g, float b) { return +0.299f * r + 0.587f * g + 0.114f * b; }
float rgb2cb(float r, float g, float b) { return -0.16874f * r - 0.33126f * g + 0.5f * b; }
float rgb2cr(float r, float g, float b) { return +0.5f * r - 0.41869f * g - 0.08131f * b; }

// forward DCT computation "in one dimension" (fast AAN algorithm by Arai, Agui and Nakajima: "A
// fast DCT-SQ scheme for images")
// stride must be 1 (=horizontal) or 8 (=vertical)
void DCT(float block[8 * 8], uint8_t stride) {
    // sqrt((2 + sqrt(2)) / 2) = cos(pi * 1 / 8) * sqrt(2)
    const auto SqrtHalfSqrt = 1.306562965f;
    // 1 / sqrt(2) = cos(pi * 2 / 8)
    const auto InvSqrt = 0.707106781f;
    // sqrt(2 - sqrt(2)) / 2  = cos(pi * 3 / 8)
    const auto HalfSqrtSqrt = 0.382683432f;
    // 1 / sqrt(2 - sqrt(2))      = cos(pi * 3 / 8) * sqrt(2)
    const auto InvSqrtSqrt = 0.541196100f;

    // modify in-place
    auto& block0 = block[0];
    auto& block1 = block[1 * stride];
    auto& block2 = block[2 * stride];
    auto& block3 = block[3 * stride];
    auto& block4 = block[4 * stride];
    auto& block5 = block[5 * stride];
    auto& block6 = block[6 * stride];
    auto& block7 = block[7 * stride];

    // based on https://dev.w3.org/Amaya/libjpeg/jfdctflt.c , the original variable names can be
    // found in my comments
    auto add07 = block0 + block7;
    auto sub07 = block0 - block7;  // tmp0, tmp7
    auto add16 = block1 + block6;
    auto sub16 = block1 - block6;  // tmp1, tmp6
    auto add25 = block2 + block5;
    auto sub25 = block2 - block5;  // tmp2, tmp5
    auto add34 = block3 + block4;
    auto sub34 = block3 - block4;  // tmp3, tmp4

    auto add0347 = add07 + add34;
    auto sub07_34 = add07 - add34;  // tmp10, tmp13 ("even part" / "phase 2")
    auto add1256 = add16 + add25;
    auto sub16_25 = add16 - add25;  // tmp11, tmp12

    block0 = add0347 + add1256;
    block4 = add0347 - add1256;  // "phase 3"

    // all temporary z-variables kept their original names
    auto z1 = (sub16_25 + sub07_34) * InvSqrt;
    block2 = sub07_34 + z1;
    block6 = sub07_34 - z1;  // "phase 5"

    auto sub23_45 = sub25 + sub34;  // tmp10 ("odd part" / "phase 2")
    auto sub12_56 = sub16 + sub25;  // tmp11
    auto sub01_67 = sub16 + sub07;  // tmp12

    auto z5 = (sub23_45 - sub01_67) * HalfSqrtSqrt;
    auto z2 = sub23_45 * InvSqrtSqrt + z5;
    auto z3 = sub12_56 * InvSqrt;
    auto z4 = sub01_67 * SqrtHalfSqrt + z5;
    auto z6 = sub07 + z3;  // z11 ("phase 5")
    auto z7 = sub07 - z3;  // z13
    block1 = z6 + z4;
    block7 = z6 - z4;  // "phase 6"
    block5 = z7 + z2;
    block3 = z7 - z2;
}

// run DCT, quantize and write Huffman bit codes
int16_t encodeBlock(BitWriter& writer, float block[8][8], const float scaled[8 * 8], int16_t lastDC,
                    const BitCode huffmanDC[256], const BitCode huffmanAC[256],
                    const BitCode* codewords) {
    // "linearize" the 8x8 block, treat it as a flat array of 64 floats
    auto block64 = (float*)block;

    // DCT: rows
    for (auto offset = 0; offset < 8; offset++) {
        DCT(block64 + offset * 8, 1);
    }
    // DCT: columns
    for (auto offset = 0; offset < 8; offset++) {
        DCT(block64 + offset * 1, 8);
    }

    // scale
    for (auto i = 0; i < 8 * 8; i++) {
        block64[i] *= scaled[i];
    }

    // encode DC (the first coefficient is the "average color" of the 8x8 block)
    // C++11's nearbyint() achieves a similar effect
    auto DC = int(block64[0] + (block64[0] >= 0 ? +0.5f : -0.5f));

    // quantize and zigzag the other 63 coefficients
    auto posNonZero = 0;  // find last coefficient which is not zero (because trailing zeros are
                          // encoded differently)
    int16_t quantized[8 * 8];
    for (auto i = 1; i < 8 * 8; i++) {  // start at 1 because block64[0]=DC was already processed
        auto value = block64[ZigZagInv[i]];
        // round to nearest integer
        // C++11's nearbyint() achieves a similar effect
        quantized[i] = int(value + (value >= 0 ? +0.5f : -0.5f));
        // remember offset of last non-zero coefficient
        if (quantized[i] != 0) {
            posNonZero = i;
        }
    }

    // same "average color" as previous block ?
    auto diff = DC - lastDC;
    if (diff == 0) {
        writer << huffmanDC[0x00];  // yes, write a special short symbol
    } else {
        // nope, encode the difference to previous block's average color
        auto bits = codewords[diff];
        writer << huffmanDC[bits.numBits] << bits;
    }

    // encode ACs (quantized[1..63])
    auto offset = 0;  // upper 4 bits count the number of consecutive zeros
    // quantized[0] was already written, skip all trailing zeros, too
    for (auto i = 1; i <= posNonZero; i++) {
        // zeros are encoded in a special way
        while (quantized[i] == 0) {  // found another zero ?
            offset += 0x10;          // add 1 to the upper 4 bits split into blocks of at most 16
                                     // consecutive zeros
            if (offset > 0xF0) {     // remember, the counter is in the upper 4 bits, 0xF = 15
                writer << huffmanAC[0xF0];  // 0xF0 is a special code for "16 zeros"
                offset = 0;
            }
            i++;
        }

        auto encoded = codewords[quantized[i]];
        // combine number of zeros with the number of bits of the next non-zero value
        writer << huffmanAC[offset + encoded.numBits] << encoded;  // and the value itself
        offset = 0;
    }

    // send end-of-block code (0x00), only needed if there are trailing zeros
    if (posNonZero < 8 * 8 - 1) {  // = 63
        writer << huffmanAC[0x00];
    }

    return DC;
}

// Jon's code includes the pre-generated Huffman codes
// I don't like these "magic constants" and compute them on my own :-)
void generateHuffmanTable(const uint8_t numCodes[16], const uint8_t* values, BitCode result[256]) {
    // process all bitsizes 1 thru 16, no JPEG Huffman code is allowed to exceed 16 bits
    auto huffmanCode = 0;
    for (auto numBits = 1; numBits <= 16; numBits++) {
        // ... and each code of these bitsizes
        // note: numCodes array starts at zero, but smallest bitsize is 1
        for (auto i = 0; i < numCodes[numBits - 1]; i++) {
            result[*values++] = BitCode(huffmanCode++, numBits);
        }

        // next Huffman code needs to be one bit wider
        huffmanCode <<= 1;
    }
}