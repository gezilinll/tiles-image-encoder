cmake_minimum_required(VERSION 3.19)
project(TilesImageEncoder)

set(CMAKE_CXX_STANDARD 11)


include_directories(src)
include_directories(src/jpeg)
aux_source_directory(src FILES_SRC)
aux_source_directory(src/jpeg FILES_JPEG)

add_library(TilesImageEncoder ${FILES_SRC} ${FILES_JPEG})

add_subdirectory(example)