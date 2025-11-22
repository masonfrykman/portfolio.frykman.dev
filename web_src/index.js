import { ict_handle_contact, ict_handle_about, ict_handle_notfound } from "./content_handlers.js";
import { ict_handle_projects } from "./project_loader.js";

var presenting;

function putContent(forPage) {
    if(forPage == null || presenting == forPage || forPage == '') return

    switch(forPage) {
        case 'contact':
            ict_handle_contact();
            break;
        case 'about':
            ict_handle_about();
            break;
        case 'projects':
            ict_handle_projects();
            break;
        default:
            ict_handle_notfound();
            break;
    }

    presenting = forPage;
}

function spawnPageContent(name) {
    if(name == null || name == '') {
        return
    }

    history.pushState(name, null, "/" + name);
    putContent(name);
}

addEventListener("popstate", (stateevent) => {
    console.log(stateevent);

    putContent(stateevent.state);
});

window.onload = () => {
    let page = location.pathname.substring(1)
    putContent(page);

    document.getElementById("sidebar-projects").addEventListener("click", function() { spawnPageContent('projects') })
    document.getElementById("sidebar-about").addEventListener("click", function() { spawnPageContent('about') })
    document.getElementById("sidebar-contact").addEventListener("click", function() { spawnPageContent('contact') })
}