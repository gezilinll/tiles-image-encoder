//
// Created by gezilinll on 2023/3/18.
//

#ifndef TILESIMAGEENCODER_BITWRITER_HPP
#define TILESIMAGEENCODER_BITWRITER_HPP

#include "Configure.hpp"

// represent a single Huffman code
struct BitCode {
    BitCode() = default;  // undefined state, must be initialized at a later time
    BitCode(uint16_t code_, uint8_t numBits_) : code(code_), numBits(numBits_) {}
    uint16_t code = 0;    // JPEG's Huffman codes are limited to 16 bits
    uint8_t numBits = 0;  // number of valid bits
};

// write a single Huffman code/one byte data/file marker
class BitWriter {
public:
    explicit BitWriter(ByteEncoder encoder);

    // write Huffman bits stored in BitCode, keep excess bits in BitBuffer
    BitWriter& operator<<(const BitCode& data);

    BitWriter& operator<<(uint8_t oneByte);

    template <typename T, int Size>
    BitWriter& operator<<(T (&manyBytes)[Size]) {
        for (auto c : manyBytes) {
            mEncoder(c);
        }
        return *this;
    }

    void addMarker(uint8_t id, uint16_t length);

    void flush();
private:
    struct BitBuffer {
        int32_t data = 0;     // actually only at most 24 bits are used
        uint8_t numBits = 0;  // number of valid bits (the right-most bits)
    } mBuffer;

    ByteEncoder mEncoder;
};

#endif  // TILESIMAGEENCODER_BITWRITER_HPP
