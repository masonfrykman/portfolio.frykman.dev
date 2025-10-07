import { showError } from "./error.js";
import { Project } from "./project.js";

async function downloadProjectInfo() {
    console.log('x');
    let url = "/projects_info.json";
    var req = await fetch(url);
    if(!req.ok) {
        showError("Failed to load project info");
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
    root.innerHTML = "<h1>" + projects.length + " projects</h1><i class='note'>Note: I'm working on individual pages for each of these! Though, For the time being, they'll link to their respective repositories&mdash;given they exist.</i>";

    root.appendChild(projGridLayout);

    document.getElementById("content-hook").innerHTML = "";
    document.getElementById("content-hook").appendChild(root);
}

export function ict_handle_projects() {
    populateProjects();
}