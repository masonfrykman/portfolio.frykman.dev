import { catastrophicError } from "./error";

// TODO: split this function into different functions to show it on the page and do the callback.
function grab(name: string, onloadCallback: Function | null) {
    if(window.document.getElementById("content-hook") == null) {
        catastrophicError("Failed to display content, missing hook.")
        return
    }

    let reqURL = "/ict_" + name + ".html";
    let req = new XMLHttpRequest();

    req.onloadend = (ev) => {
        if(document.getElementById("content-hook") != null) {
            document.getElementById("content-hook")!.innerHTML = req.responseText;
        } else {
            // TODO: show an error
        }
        if(onloadCallback != null) {
            onloadCallback();
        }
    }

    req.open("GET", reqURL);
    req.send()
}

export function ict_handle_contact() {
    grab('contact', null);
}

export function ict_handle_about() {
    grab('about', null);
}

export function ict_handle_notfound() {
    grab('nf', function() {
        if(document.getElementById("pnf") != null) {
            document.getElementById("pnf")!.innerText = document.location.pathname;
        }
    });
}

export function ict_handle_nonFatalError(errDesc: string) {
    let hook = document.getElementById("content-hook");
    if(hook == null) {
        catastrophicError("<i>We tried to display a non-fatal error, but in displaying that error, we encountered a fatal error! (content hook is missing)</i><p>Original non-fatal error:</p><p>" + errDesc + "</p>");
        return;
    }

    hook.innerHTML = `<h1>oops!</h1>
    <p>` + errDesc + `</p>`;
}