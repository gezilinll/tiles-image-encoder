cmake_minimum_required(VERSION 3.19)
project(TilesImageEncoder_EXAMPLE)

set(CMAKE_CXX_STANDARD 11)

# MacOS: brew install jpeg-turbo
include_directories(/usr/local/Cellar/jpeg-turbo/2.1.4/include)
add_library(libjpeg SHARED IMPORTED)
set_target_properties(
        libjpeg
        PROPERTIES IMPORTED_LOCATION
        /usr/local/Cellar/jpeg-turbo/2.1.4/lib/libjpeg.dylib
)

add_executable(TilesImageEncoder_EXAMPLE main.cpp)
target_link_libraries(
        TilesImageEncoder_EXAMPLE
        TilesImageEncoder
        libjpeg
)

file(COPY ${CMAKE_SOURCE_DIR}/example/tile.jpg DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
