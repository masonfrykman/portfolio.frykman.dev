import { catastrophicError, nonfatalError } from "./error";
import ProjectDetails from "./project_detail";
import { getFromServer } from "./server_comms";

export async function ict_handle_project_detail(id: string) {
    if(document.getElementById("content-hook") == null) { // Check it can display before burdening the server.
        catastrophicError("Couldn't display project details, content hook missing.");
        return;
    }

    let x = await getFromServer("/projects/" + id + ".json");
    if(x == null) {
        nonfatalError("Failed to find project with id '" + id + "'.");
        return;
    }

    var details;
    try {
        details = await JSON.parse(x);
        if(details == null) {
            nonfatalError("Failed to parse project details.");
            return;
        }
    } catch(e) {
        nonfatalError("Failed to load project details, project does not exist.");
        return;
    }

    let detailObj = ProjectDetails.revive(details);
    if(detailObj == null) {
        nonfatalError("Failed to load project details.");
        return;
    }

    document.getElementById("content-hook")!.innerHTML = "";
    document.getElementById("content-hook")!.appendChild(detailObj.fabricate());
}