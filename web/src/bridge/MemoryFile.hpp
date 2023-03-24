//
// Created by gezilinll on 2023/3/24.
//

#ifndef TILESIMAGEENCODER_MEMORYFILE_HPP
#define TILESIMAGEENCODER_MEMORYFILE_HPP

#include <cstdint>

class MemoryFile {
public:
    MemoryFile();

    ~MemoryFile();

    void writeByte(unsigned char oneByte);

    unsigned char* getBuffer();

    uint64_t getLength();

private:
    unsigned char* mMemory;
    uint64_t mSize;
    uint64_t mCurrent;
};

#endif  // TILESIMAGEENCODER_MEMORYFILE_HPP
