import { ict_handle_contact, ict_handle_about, ict_handle_notfound, ict_handle_nonFatalError } from "./content_handlers";
import { ict_handle_projects } from "./project_loader";

var presenting: string;

export function putContent(forPage: string) {
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

export function putError(errDesc: string) {
    presenting = 'error';
    ict_handle_nonFatalError(errDesc);
}

export function spawnPageContent(name: string) {
    if(name == '') {
        return
    }

    history.pushState(name, "", "/" + name);
    putContent(name);
}