import { catastrophicError, nonfatalError } from "./error";
import { ProjectSummaryTile } from "./project_summary_tile";

// Gets the project sumamries from the server and parses them.
async function downloadProjectInfo() {
    var req;
    try {
        req = await fetch("/projects_info.json");
    } catch(e) {
        throw e; // Rethrow and prevent parsing it.
    }

    if(req == null) return;

    if(!req.ok) {
        nonfatalError("Couldn't load the project data from the server. (2)");
        return;
    }

    return JSON.parse(await req.text());
}

// Constructs the /projects page in the content hook.
async function populateProjects(): Promise<void> {
    var json;
    try {
        json = await downloadProjectInfo();
    } catch(e) {
        nonfatalError("Couldn't load the project data from the server. (1)");
        return;
    }

    var projects = [];
    for(const dictionary of json) {
        var proj = ProjectSummaryTile.fromJSON(dictionary);
        if(proj == null) continue;
        projects.push(proj);
    }

    var projGridLayout = document.createElement("div");
    projGridLayout.id = "proj-grid-layout";
    projGridLayout.style = "margin-top: 10pt;"
    
    for(const project of projects) {
        projGridLayout.appendChild(project.makeInfoTile());
    }

    var root = document.createElement("div");
    root.classList.add("appear-anim");
    root.innerHTML = "<h1>" + projects.length + " projects</h1>";

    root.appendChild(projGridLayout);

    if(document.getElementById("content-hook") != null) {
        document.getElementById("content-hook")!.innerHTML = "";
        document.getElementById("content-hook")!.appendChild(root);
    } else {
        catastrophicError("Failed to display the project content at the content hook, content hook doesn't exist.");
        return;
    }
}

export function ict_handle_projects() {
    populateProjects();
}