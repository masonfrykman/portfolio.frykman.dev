#include <string>
#include <cstdlib>
#include <optional>

std::optional<std::string> env_var(std::string const& key) {
    if(key.empty()) return std::optional<std::string>(nullptr);
    char* syscall = std::getenv(key.c_str());
    if(syscall != NULL && strlen(syscall) > 0) {
        std::string x = syscall;
        return std::optional<std::string>(x);
    }
    return std::optional<std::string>(nullptr);
}

#pragma once