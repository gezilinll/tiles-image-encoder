//@ts-ignore
import { ByteEncoder, JpegConfigure, ProgressCallback, TileGenerator } from "./Configure";
import Module from "./wasm/tilesimageencoder";

export class TilesImageEncoder {
    private _encoder: any = undefined;
    private _generator: TileGenerator;
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

    constructor(generator: TileGenerator, encoder: ByteEncoder, progress: ProgressCallback) {
        this._generator = generator;
        this._encoder = TilesImageEncoder.module.makeEncoder(this._fillPixelsCallback.bind(this), encoder, progress);
    }

    configJPEG(config: JpegConfigure) {
        this._encoder.configJPEG(config);
    }

    execute() {
        this._encoder.execute();
    }

    private _fillPixelsCallback(x: number, y: number, width: number, height: number) {
        let now = performance.now();
        let buffer = this._generator(x, y, width, height);
        let ptr = TilesImageEncoder.module._malloc(buffer.length);
        TilesImageEncoder.module.HEAPU8.set(buffer, ptr);
        console.log("_fillPixelsCallback:" + (performance.now() - now));
        return ptr;
    }
}