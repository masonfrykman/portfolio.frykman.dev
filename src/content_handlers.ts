import { catastrophicError, nonfatalError } from "./error";
import { getFromServer } from "./server_comms";

// Requests the HTML file for an ict page from the server and displays it in the content hook.
async function ict_loadAndPlace(name: string) {
    if(document.getElementById("content-hook") == null) {
        catastrophicError("Failed to display content for '" + name + "', missing content hook.");
        return;
    }

    let reqName = "/ict_" + name + ".html";
    let resp: string | null = await getFromServer(reqName);
    if(resp == null) {
        nonfatalError("Failed to get content for '" + name + "' from server.");
        return;
    }

    document.getElementById("content-hook")!.innerHTML = resp;
}

export async function ict_handle_contact() {
    await ict_loadAndPlace('contact');
}

export async function ict_handle_about() {
    await ict_loadAndPlace('about');
}

export async function ict_handle_notfound() {
    await ict_loadAndPlace('nf');
    if(document.getElementById("pnf") != null) {
        document.getElementById("pnf")!.innerText = document.location.pathname;
    }
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