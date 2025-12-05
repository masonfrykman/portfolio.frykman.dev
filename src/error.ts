export function showError(errDesc: string) {
    console.error(errDesc)

    document.body.innerHTML = `<h1 style='font-size: 72pt !important;'>FATAL ERROR</h1>
    <p id='errdesc'></p>`;

    document.body.style = "background-color: #7b0000ff; color: yellow !important; flex-direction: column;"

    if(document.getElementById("errdesc") != null) {
        document.getElementById("errdesc")!.innerHTML = errDesc;
    }
}