export function showError(errDesc) {
    console.error(errDesc)

    document.body.innerHTML = `<h1>FATAL ERROR</h1><br>
    <span id='errdesc'></span>`;

    document.getElementById("errdesc").innerText = errDesc;
}