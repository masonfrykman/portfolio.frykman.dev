import { showError } from "./error.js";

function grab(name, onloadCallback) {
    if(window.document.getElementById("content-hook") == null) {
        showError("Failed to display content, missing hook.")
        return
    }

    let reqURL = "/ict_" + name + ".html";
    let req = new XMLHttpRequest();

    req.onloadend = (ev) => {
        document.getElementById("content-hook").innerHTML = req.responseText;
        if(onloadCallback != null) {
            onloadCallback();
        }
    }

    req.open("GET", reqURL);
    req.send()
}

export function ict_handle_contact() {
    grab('contact');
}

export function ict_handle_about() {
    grab('about');
}

export function ict_handle_notfound() {
    grab('nf', function() {
        if(document.getElementById("pnf") != null) {
            document.getElementById("pnf").innerText = document.location.pathname;
        }
    });
}