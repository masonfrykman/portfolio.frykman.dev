import { ict_handle_contact, ict_handle_about, ict_handle_notfound, ict_handle_nonFatalError } from "./content_handlers";
import { ict_handle_project_detail } from "./project_detail_loader";
import { ict_handle_projects } from "./project_summaries_loader";

var presenting: string;

// Tries to put the content for an ict page in the content hook.
export function putContent(forPage: string) {
    if(presenting == forPage || forPage == '') return

    if(forPage.startsWith("projects") && forPage.length != "projects".length) {
        ict_handle_project_detail(forPage.split("/")[1] ?? "");
        return;
    }

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

// Shows an error in the content hook.
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