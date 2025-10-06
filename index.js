function spawnPageContent(name) {
    if(name == null || name == '') {
        return;
    }

    console.log(name);
}

window.onload = () => {
    let page = location.pathname.substring(1);
    spawnPageContent(page);
}