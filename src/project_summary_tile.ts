export class ProjectSummaryTile {
    private name: string; // required
    private date: string | null;
    private blurb: string | null;
    private href: string | null;

    public constructor(name: string, date: string | null, blurb: string | null, href: string | null) {
        this.name = name;
        this.date = date;
        this.blurb = blurb;
        this.href = href;
    }

    public static fromJSON(jsonDict: any): ProjectSummaryTile | null {
        if(jsonDict.name == undefined) return null;

        return new ProjectSummaryTile(jsonDict.name!, jsonDict.date ?? null, jsonDict.blurb ?? null, jsonDict.href ?? null);
    }


    // ------
    // <NAME>
    // <DATE>
    //
    // <BLURB>
    // ------
    public makeInfoTile(): HTMLDivElement {
        // Make the root box
        var rootBox = document.createElement("div");
        rootBox.classList.add("proj-item");

        // Create individual items.
        var nameElem = document.createElement("span");
        nameElem.innerText = this.name;
        nameElem.classList.add("name");
        rootBox.appendChild(nameElem);

        var dateElem = document.createElement("span");
        if(this.date != null) {
            dateElem.innerText = this.date;
            dateElem.classList.add("date");
            rootBox.appendChild(dateElem);
        }
        
        var desc = document.createElement("p");
        if(this.blurb != null) {
            desc.innerText = this.blurb;
            desc.classList.add("desc");
            rootBox.appendChild(desc);
        }
        
        if(this.href != null && this.href != "") {
            rootBox.addEventListener("click", (ev) => {
                window.location.href = this.href!;
            })
            rootBox.classList.add("show-clickable");
        }

        return rootBox;
    }
}