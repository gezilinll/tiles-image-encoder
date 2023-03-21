#!/bin/bash

set -e

# 编译
export OPTIMIZE="-O0 -DNDEBUG -Wl,--no-check-features"
export LDFLAGS="${OPTIMIZE}"
export CFLAGS="${OPTIMIZE}"
export CPPFLAGS="${OPTIMIZE}"

NAME="tilesimageencoder"
work_path='build-wasm'
rm -fr ${work_path}
mkdir -p ${work_path}
cd ./${work_path}

echo "============================================="
echo "Building..."
echo "============================================="
(
  emcc \
  --bind \
  ${OPTIMIZE} \
  -flto \
  -fexceptions \
  -s ASSERTIONS=0 \
  -s WASM=1 \
  -s ENVIRONMENT=web \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s SAFE_HEAP=0 \
  -s MODULARIZE=1 \
  -s EXPORT_ES6=1 \
  -s EXPORT_NAME=${NAME} \
  -s USE_ES6_IMPORT_META=0 \
  -I ../../src \
  -I ../../src/jpeg \
  -g \
  ../../src/*.cpp \
  ../../src/jpeg/*.cpp \
  ../src/bridge/EncoderBinder.cpp \
  -o ${NAME}.js
)

cd ..

cp build-wasm/${NAME}.wasm src/wasm
cp build-wasm/${NAME}.js src/wasm

cp build-wasm/${NAME}.wasm demo

echo "============================================="
echo "DONE."
echo "============================================="