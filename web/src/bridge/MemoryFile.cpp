//
// Created by gezilinll on 2023/3/24.
//

#include "MemoryFile.hpp"
#include <stdio.h>
#include <stdlib.h>
#include <cstring>

MemoryFile::MemoryFile() {
    mMemory = static_cast<unsigned char*>(malloc(100 * 1024 * 1024));
    mSize = 100 * 1024 * 1024;
    mCurrent = 0;
}

MemoryFile::~MemoryFile() { free(mMemory); }

void MemoryFile::writeByte(unsigned char oneByte) {
    if (mCurrent == mSize) {
        mMemory = static_cast<unsigned char*>(realloc(mMemory, mSize * 2));
        mSize *= 2;
    }
    memset(mMemory + mCurrent, oneByte, 1);
    mCurrent++;
}

uint64_t MemoryFile::getLength() { return mCurrent; }

unsigned char* MemoryFile::getBuffer() { return mMemory; }