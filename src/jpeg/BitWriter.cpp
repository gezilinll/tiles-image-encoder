//
// Created by gezilinll on 2023/3/18.
//

#include "BitWriter.hpp"

BitWriter::BitWriter(ByteEncoder encoder) : mEncoder(encoder) {}

BitWriter& BitWriter::operator<<(const BitCode& data) {
    // append the new bits to those bits leftover from previous call(s)
    mBuffer.numBits += data.numBits;
    mBuffer.data <<= data.numBits;
    mBuffer.data |= data.code;

    // write all "full" bytes
    while (mBuffer.numBits >= 8) {
        // extract highest 8 bits
        mBuffer.numBits -= 8;
        auto oneByte = uint8_t(mBuffer.data >> mBuffer.numBits);
        mEncoder(oneByte);

        if (oneByte == 0xFF)  // 0xFF has a special meaning for JPEGs (it's a block marker)
        {
            // therefore pad a zero to indicate "nope, this one ain't a marker,
            // it's just a coincidence"
            mEncoder(0);
        }

        // note: I don't clear those written bits, therefore buffer.bits may contain garbage in the
        // high bits if you really want to "clean up" (e.g. for debugging purposes) then uncomment
        // the following line buffer.bits &= (1 << buffer.numBits) - 1;
    }
    return *this;
}

BitWriter& BitWriter::operator<<(uint8_t oneByte) {
    mEncoder(oneByte);
    return *this;
}

void BitWriter::addMarker(uint8_t id, uint16_t length) {
    mEncoder(0xFF);
    // ID, always preceded by 0xFF
    mEncoder(id);
    // length of the block (big-endian, includes the 2 length bytes as well)
    mEncoder(uint8_t(length >> 8));
    mEncoder(uint8_t(length & 0xFF));
}

void BitWriter::flush() { *this << BitCode(0x7F, 7); }
