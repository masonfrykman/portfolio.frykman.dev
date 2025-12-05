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

export function nonfatalError(errDesc: string | undefined) {
    console.warn(errDesc);

    // Show an error on the content hook
    // If the content-hook is undefined, then pass the error to catastrophicError()
    // TODO: implement further
}