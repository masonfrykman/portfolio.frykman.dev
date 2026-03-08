import { drawBackground } from "./module/background";
import { putContent, spawnPageContent } from "./module/content_manager";

addEventListener("popstate", (stateevent) => {
    putContent(stateevent.state);
});

window.onload = () => {
    // Try to load an ict page from the page url.
    let page = location.pathname.substring(1)
    putContent(page);

    // onclick listeners for the items in the sidebar.
    if(document.getElementById("sidebar-projects") != null) {
        document.getElementById("sidebar-projects")!.addEventListener("click", function() { spawnPageContent('projects') })
    }

    if(document.getElementById("sidebar-about") != null) {
        document.getElementById("sidebar-about")!.addEventListener("click", function() { spawnPageContent('about') })
    }

    if(document.getElementById("sidebar-contact") != null) {
        document.getElementById("sidebar-contact")!.addEventListener("click", function() { spawnPageContent('contact') })
    }

    document.getElementById("disable-bg")!.addEventListener("click", (ev) => {
        if(window.localStorage.getItem("no-background-v1") == "true") {
            // Switch to DRAW BACKGROUND STATE
            document.getElementById("disable-bg")!.innerText = "disable background"
            window.localStorage.setItem("no-background-v1", "false")
            drawBackground()
        } else {
            // Switch to NO BACKGROUND STATE
            document.getElementById("disable-bg")!.innerText = "enable background"
            window.localStorage.setItem("no-background-v1", "true")
            document.getElementById("background")!.innerHTML = ""
        }
    })

    if(window.localStorage.getItem("no-background-v1") == "true") {
        document.getElementById("disable-bg")!.innerText = "enable background"
    }

    // draw the background
    drawBackground()
}