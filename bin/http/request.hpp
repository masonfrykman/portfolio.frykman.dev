#include <sstream>
#include <string>
#include <cstring>
#include <unordered_map>
#include <stdexcept>

using namespace std;

namespace http {
    class Request final {
        private:
            string _method;
            string _path;
            unordered_map<string, string> _headers;

            char* _body = nullptr; // new[]/delete[]
            size_t _bodyAv = 0;
            size_t _bodySz = 0;

        public:
            static size_t maxContentLength; // bytes

            Request(string method, string path) {
                _method = method;
                _path = path;
            }

            ~Request() {
                delete[] _body;
                _body = nullptr;
            }

            void push_back(char c) {
                if(_body == nullptr) {
                    if(_headers.count("Content-Length") == 0) {
                        throw runtime_error("Content-Length header must be present before pushing to the body.");
                    }

                    stringstream lim(_headers.at("Content-Length"));
                    lim >> _bodySz;

                    if(maxContentLength != 0 && _bodySz > maxContentLength) {
                        _bodySz = 0;
                        throw runtime_error("Content-Length is larger than the max content length.");
                    }

                    _body = new char[_bodySz];
                    memset(_body, 0, _bodySz);
                }

                if(_bodyAv >= _bodySz) {
                    throw runtime_error("Out of space.");
                }

                _body[_bodyAv++] = c;
            }
    };
}

#pragma once