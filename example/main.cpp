//
// Created by 林炳河 on 2023/3/18.
//
#include <TilesEncoder.hpp>
#include <cstdlib>
#include <jpeglib.h>

struct ImageData {
    ImageData(long _width, long _height, unsigned char* _pixels) {
        width = _width;
        height = _height;
        pixels = _pixels;
    }

    unsigned char* pixels;
    long width;
    long height;
};

std::shared_ptr<ImageData> decode_JPEG_file(char* inJpegName) {
    struct jpeg_decompress_struct cinfo;
    struct jpeg_error_mgr jerr;

    FILE* infile;

    if ((infile = fopen(inJpegName, "rb")) == NULL) {
        fprintf(stderr, "can't open %s\n", inJpegName);
        return nullptr;
    }

    cinfo.err = jpeg_std_error(&jerr);

    jpeg_create_decompress(&cinfo);

    jpeg_stdio_src(&cinfo, infile);

    jpeg_read_header(&cinfo, TRUE);

    printf("image_width = %d\n", cinfo.image_width);
    printf("image_height = %d\n", cinfo.image_height);
    printf("num_components = %d\n", cinfo.num_components);
    printf("enter scale M/N:\n");

    jpeg_start_decompress(&cinfo);

    int row_stride = cinfo.output_width * cinfo.output_components;
    /* Make a one-row-high sample array that will go away when done with image */
    JSAMPARRAY buffer = (JSAMPARRAY)malloc(sizeof(JSAMPROW));
    buffer[0] = (JSAMPROW)malloc(sizeof(JSAMPLE) * row_stride);

    auto imageData = std::make_shared<ImageData>(
        cinfo.image_width, cinfo.image_height,
        static_cast<unsigned char*>(malloc(row_stride * cinfo.image_height)));
    long counter = 0;

    while (cinfo.output_scanline < cinfo.output_height) {
        jpeg_read_scanlines(&cinfo, buffer, 1);
        memcpy(imageData->pixels + counter, buffer[0], row_stride);
        counter += row_stride;
    }

    jpeg_finish_decompress(&cinfo);

    jpeg_destroy_decompress(&cinfo);

    fclose(infile);

    return imageData;
}

int main() {
    auto imageData = decode_JPEG_file("tile.jpg");

    const char* homeDir = getenv("HOME");
    if (!homeDir) {
        printf("[JpegEncoder] can't get HOME path.");
        return -1;
    }

    FILE* file = fopen((std::string(homeDir) + "/Desktop/Tiles_JPEG.jpeg").data(), "wb");
    TilesEncoder encoder(
        [&](uint16_t x, uint16_t y, uint16_t w, uint16_t h) {
            int64_t length = w * h * 3;
            auto pixels = new unsigned char[length];
            uint16_t writtenY = 0;
            while (writtenY < h) {
                uint16_t writtenX = 0;
                while (writtenX < w) {
                    memcpy(pixels + (writtenX * 3) + (writtenY * w * 3),
                           imageData->pixels + (((y % imageData->height) + writtenY) * imageData->width * 3),
                           imageData->width * 3);
                    writtenX += imageData->width;
                }
                writtenY++;
            }
            std::shared_ptr<uint8_t> sharedPixels(pixels, [](uint8_t* data) { delete(data); });
            return sharedPixels;
        },
        [&](uint8_t oneByte) { fputc(oneByte, file); });
    JpegConfigure configure;
    configure.width = imageData->width * 20;
    configure.height = imageData->height * 20;
    configure.format = ImageFormat::JPEG;
    encoder.configure(configure);
    encoder.execute();

    printf("[JpegEncoder] outputPath is %s\n", (std::string(homeDir) + "/Desktop/Tiles_JPEG.jpeg").data());
}