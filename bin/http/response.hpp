#include <string>
#include <sstream>
#include <unordered_map>

using namespace std;

namespace http {
    class Response final {
        private:
            int _statusCode;
            unordered_map<string, string> _headers;
            std::string _body;
        
        public:
            Response(int statusCode, string body) {
                _statusCode = statusCode;
                _body = body;
            }

            void setHeader(std::string const& key, std::string const& val) {
                _headers[key] = val;
            }

            void deleteHeader(string const& key) {
                _headers.erase(key);
            }

            string fabricate() {
                unordered_map<string, string> h(_headers);
                h["Content-Length"] = _body.length();
                h["Server"] = "mvf";

                string msg = statusMessage(_statusCode);

                stringstream ret("HTTP/1.1 " + to_string(_statusCode) + " " + msg + "\n");
                for(auto [k,v] : _headers) {
                    ret << k << ": " << v << "\n";
                }
                ret << "\n";
                ret << _body;

                return ret.str();
            }

            static string statusMessage(int code) {
                switch(code) {
                    case 100: return "Continue";
                    case 101: return "Switching Protocols";
                    case 103: return "Early Hints";

                    case 200: return "OK";
                    case 201: return "Created";
                    case 202: return "Accepted";
                    case 203: return "Non-Authoritative Information";
                    case 204: return "No Content";
                    case 205: return "Reset Content";
                    case 206: return "Partial Content";
                    
                    case 300: return "Multiple Choices";
                    case 301: return "Moved Permanently";
                    case 302: return "Found";
                    case 303: return "See Other";
                    case 304: return "Not Modified";
                    case 307: return "Temporary Redirect";
                    case 308: return "Permanent Redirect";
                    
                    case 400: return "Bad Request";
                    case 401: return "Unauthorized";
                    case 402: return "Payment Required";
                    case 403: return "Forbidden";
                    case 404: return "Not Found";
                    case 405: return "Method Not Allowed";
                    case 406: return "Not Acceptable";
                    case 407: return "Proxy Authentication Required";
                    case 408: return "Request Timeout";
                    case 409: return "Conflict";
                    case 410: return "Gone";
                    case 411: return "Length Required";
                    case 412: return "Precondition Failed";
                    case 413: return "Content Too Large";
                    case 414: return "URI Too Long";
                    case 415: return "Unsupported Media Type";
                    case 416: return "Range Not Satisfiable";
                    case 417: return "Expectation Failed";
                    case 418: return "I'm a teapot";
                    case 421: return "Misdirected Request";
                    case 426: return "Upgrade Required";
                    case 429: return "Too Many Requests";
                    case 431: return "Request Header Fields Too Large";
                    case 451: return "Unavailable For Legal Reasons";

                    case 500: return "Internal Server Error";
                    case 501: return "Not Implemented";
                    case 502: return "Bad Gateway";
                    case 503: return "Service Unavailable";
                    case 504: return "Gateway Timeout";
                    case 505: return "HTTP Version Not Supported";
                    case 506: return "Variant Also Negotiates";
                    case 510: return "Not Extended";
                    case 511: return "Network Authentication Required";
                }

                throw runtime_error("Invalid status code.");
            }

    };
}

#pragma once