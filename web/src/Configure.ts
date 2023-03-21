export declare type TileGenerator = (x: number, y: number, width: number, height: number) => Uint8Array;
export declare type ByteEncoder = (oneByte: number) => void;
export declare type ProgressCallback = (progress: number) => void;

export class Configure {
    width: number = 0;
    height: number = 0;
}

export class JpegConfigure extends Configure {
    // compress quality, range:[1, 100]
    quality: number = 100;
    // if true then YCbCr 4:2:0 format is used (smaller size, minor quality loss) instead of 4:4:4,
    // not relevant for grayscale
    downSample: boolean = false;
    // true if RGB format (3 bytes per pixel); false if grayscale (1 byte per pixel)
    isRGB: boolean = true;
    // optional JPEG comment (0/NULL if no comment), must not contain ASCII code 0xFF
    comment: string = "";
}