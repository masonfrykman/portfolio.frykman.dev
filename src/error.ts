import { putError } from "./content_manager";

// Wipes the page and displays a really big FATAL ERROR with the error description.
export function catastrophicError(errDesc: string) {
    console.error(errDesc)

    document.body.innerHTML = `<h1 style='font-size: 72pt !important;'>FATAL ERROR</h1>
    <p id='errdesc'></p>`;

    document.body.style = "background-color: #7b0000ff; color: yellow !important; flex-direction: column;"

    if(document.getElementById("errdesc") != null) {
        document.getElementById("errdesc")!.innerHTML = errDesc;
    }
}

// Displays an error in the content hook. If it's missing, then it (ict_handle_nonFatalError) will kick the error to catastrophicError().
// This is used when an error occured that shouldn't fully ruin the flow of the site.
export function nonfatalError(errDesc: string | undefined) {
    console.warn(errDesc);

    putError(errDesc ?? "An error occured.");
}