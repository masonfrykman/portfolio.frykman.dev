export function showError(errDesc: string) {
    console.error(errDesc)

    document.body.innerHTML = `<h1>FATAL ERROR</h1><br>
    <span id='errdesc'></span>`;

    if(document.getElementById("errdesc") != null) {
        document.getElementById("errdesc")!.innerText = errDesc;
    }
}