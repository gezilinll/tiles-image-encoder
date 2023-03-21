//@ts-ignore
import { ByteEncoder, TileGenerator } from "./Configure";
import Module from "./wasm/tilesimageencoder";

export class TilesImageEncoder {
    private _encoder: any = undefined;
    private static module: any = undefined;
    private static _wasmPath = "http://rqm1nmwwk.hn-bkt.clouddn.com/InfiniteCanvas.wasm";

    static async init() {
        return new Promise(async (resolve, reject) => {
            const instance = await Module({
                locateFile: (path: string) => {
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

    constructor(generator: TileGenerator, encoder: ByteEncoder) {
        this._encoder = TilesImageEncoder.module.makeEncoder(generator, encoder);
    }
}