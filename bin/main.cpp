#include <iostream>

#include "util.hpp"

using namespace std;

int main(int argc, char* argv[]) {
    cout << "portfolio.frykman.dev server software" << endl;

    // Check the webroot exists
    auto webrootEnv = env_var("PFD_WEBROOT");
    if(!webrootEnv.has_value()) {
        cerr << "PFD_WEBROOT must be defined." << endl;
        return 1;
    }

    auto webroot = webrootEnv.value();
    

    return 0;
}