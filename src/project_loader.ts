import { catastrophicError } from "./error";
import { Project } from "./project";

async function downloadProjectInfo() {
    let url = "/projects_info.json";
    var req = await fetch(url);
    if(!req.ok) {
        catastrophicError("Failed to load project info");
        return;
    }

    return JSON.parse(await req.text());
}

async function populateProjects() {
    var json = await downloadProjectInfo();

    var projects = [];
    for(const dictionary of json) {
        var proj = Project.fromJSON(dictionary);
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