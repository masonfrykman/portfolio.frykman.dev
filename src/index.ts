import { ict_handle_contact, ict_handle_about, ict_handle_notfound } from "./content_handlers";
import { ict_handle_projects } from "./project_loader";

var presenting: string;

function putContent(forPage: string) {
    if(presenting == forPage || forPage == '') return

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

function spawnPageContent(name: string) {
    if(name == '') {
        return
    }

    history.pushState(name, "", "/" + name);
    putContent(name);
}

addEventListener("popstate", (stateevent) => {
    console.log(stateevent);

    putContent(stateevent.state);
});

window.onload = () => {
    let page = location.pathname.substring(1)
    putContent(page);

    if(document.getElementById("sidebar-projects") != null) {
        document.getElementById("sidebar-projects")!.addEventListener("click", function() { spawnPageContent('projects') })
    }

    if(document.getElementById("sidebar-about") != null) {
        document.getElementById("sidebar-about")!.addEventListener("click", function() { spawnPageContent('about') })
    }

    if(document.getElementById("sidebar-contact") != null) {
        document.getElementById("sidebar-contact")!.addEventListener("click", function() { spawnPageContent('contact') })
    }
}