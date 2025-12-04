export class Project {
    name;
    date;
    blurb;
    href;

    constructor(name, date, blurb, href) {
        this.name = name;
        this.date = date;
        this.blurb = blurb;
        this.href = href;
    }

    static fromJSON(jsonDict) {
        if(jsonDict == null || !(typeof jsonDict["name"] === "string")) {
            return null;
        }

        // type check each dict entry
        if(!(typeof jsonDict["name"] === "string")
            || !(typeof jsonDict["date"] === "string")
            || !(typeof jsonDict["blurb"] === "string")
            || !(typeof jsonDict["href"] === "string")) {
                return null
            }

        return new Project(jsonDict["name"], jsonDict["date"], jsonDict["blurb"], jsonDict["href"])
    }

    makeInfoTile() {
        // Create individual items.
        var nameElem = document.createElement("span");
        nameElem.innerText = this.name;
        nameElem.classList.add("name");

        var desc = document.createElement("p");
        desc.innerText = this.blurb;
        desc.classList.add("desc");
        
        var dateElem = document.createElement("span");
        dateElem.innerText = this.date;
        dateElem.classList.add("date");

        // Make the root box
        var rootBox = document.createElement("div");
        rootBox.classList.add("proj-item");

        // Put the elements in
        rootBox.appendChild(nameElem);
        rootBox.appendChild(dateElem);
        rootBox.appendChild(desc);

        if(this.href != "") {
            rootBox.addEventListener("click", (ev) => {
                window.location = this.href;
            })
            rootBox.classList.add("show-clickable");
        }

        return rootBox;
    }
}