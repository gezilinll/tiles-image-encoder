//
// Created by gezilinll on 2023/3/18.
//

#ifndef TILES_IMAGE_ENCODER_TILESENCODER_HPP
#define TILES_IMAGE_ENCODER_TILESENCODER_HPP

#include "JpegEncoder.hpp"

/**
 * Encode JPEG and PNG tile by tile, support super size image to encode, avoid issues like OOM.
 */
class TilesEncoder {
public:
    /**
     * Create encoder
     * @param generator callback that request for new tile's pixels to compress
     * @param encoder callback that stores a single byte
     */
    TilesEncoder(TileGenerator generator, ByteEncoder encoder);

    /**
     * Config jpeg before #execute
     * @param config configure info
     */
    void configure(JpegConfigure config);

    /**
     * Register progress callback
     */
    void setProgressCallback(ProgressCallback callback);

    /**
     * Start to do work, this whole process will run synchronize and use callback to communicate
     * with caller constantly.
     */
    void execute();

private:
    Configure mConfig;
    TileGenerator mGenerator;
    ByteEncoder mEncoder;
    ProgressCallback mProgressCallback;

    std::unique_ptr<JpegEncoder> mJpegEncoder;  // TODO
};

#endif  // TILES_IMAGE_ENCODER_TILESENCODER_HPP
