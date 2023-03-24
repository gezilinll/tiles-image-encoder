//@ts-ignore
import { CompressedCallback, JpegConfigure, ProgressCallback, TileGenerator } from "./Configure";
import Module from "./wasm/tilesimageencoder";

export class TilesImageEncoder {
    private _encoder: any = undefined;
    private _generator: TileGenerator;
    private _compressed: CompressedCallback;
    private static module: any = undefined;

    static async init(locateFile?: string) {
        return new Promise(async (resolve, reject) => {
            const instance = await Module({
                locateFile: (path: string) => {
                    if (locateFile) {
                        return locateFile;
                    }
                    return path;
                },
            }).then((module: typeof Module) => {
                return module;
            }).catch((err: any) => {
                console.error(err);
                return undefined;
            });

            if (instance) {
                TilesImageEncoder.module = instance;
                // @ts-ignore
                window.mainModule = instance;
            }
            if (TilesImageEncoder.module) {
                resolve(this.module);
            } else {
                reject("!!!Load Wasm Error!!!");
            }
        });
    }

    constructor(generator: TileGenerator, progress: ProgressCallback, compressed: CompressedCallback) {
        this._generator = generator;
        this._compressed = compressed;
        this._encoder = TilesImageEncoder.module.makeEncoder(
            this._fillPixelsCallback.bind(this), progress, this._allCompressedCallback.bind(this));
    }

    configJPEG(config: JpegConfigure) {
        this._encoder.configJPEG(config);
    }

    execute() {
        this._encoder.execute();
    }

    private _fillPixelsCallback(x: number, y: number, width: number, height: number) {
        let buffer = this._generator(x, y, width, height);
        let ptr = TilesImageEncoder.module._malloc(buffer.length);
        TilesImageEncoder.module.HEAPU8.set(buffer, ptr);
        return ptr;
    }

    private _allCompressedCallback(bufferPtr: number, bufferLength: number) {
        let imageBuffer = new Uint8Array(TilesImageEncoder.module.HEAPU8.subarray(bufferPtr, bufferPtr + bufferLength));
        this._encoder.delete();
        this._compressed(imageBuffer);
    }
}