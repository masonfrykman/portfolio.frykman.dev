export default class ProjectDetails {
    private name: string;
    private subtitle: string | null;
    private images: Array<string>; // may be empty
    private longDescription: string | null;
    private externalLinks: Map<string, string>; // may be empty

    public constructor(name: string, subtitle: string, images: Array<string>, longDescription: string, externalLinks: Map<string, string>) {
        this.name = name;
        this.subtitle = subtitle;
        this.images = images;
        this.longDescription = longDescription;
        this.externalLinks = externalLinks;
    }

    public static revive(jsonObject: any): ProjectDetails | null {
        if(jsonObject.name == undefined) {
            return null;
        }

        return new ProjectDetails(jsonObject.name, jsonObject.subtitle ?? null, new Array(jsonObject.images) ?? [], jsonObject.longDescription ?? null, new Map(Object.entries(jsonObject.externalLinks)) ?? {});
    }

    // <NAME>
    // <SUBTITLE>
    // --------
    // [IMAGES]
    // <LONG DESCRIPTION>
    // --------
    // <EXTERNAL LINKS>
    public fabricate(): HTMLDivElement {
        let rootDiv = document.createElement("div");
        rootDiv.classList.add("appears-anim");

        let h1Name = document.createElement("h1");
        h1Name.innerText = this.name;
        rootDiv.appendChild(h1Name);

        if(this.subtitle != null) {
            let h4ST = document.createElement("h4");
            h4ST.innerText = this.subtitle;
            rootDiv.appendChild(h4ST);
        }

        for(var imgString of this.images) {
            var img = document.createElement("img");
            img.src = "/img/" + imgString;
            img.classList.add("project-image");
            rootDiv.appendChild(img);
        }

        if(this.longDescription != null) {
            let longDescP = document.createElement("p");
            longDescP.innerText = this.longDescription;
            rootDiv.append(longDescP);
        }

        let externalLinksTitle = document.createElement("h2");
        externalLinksTitle.innerText = "External Links";
        rootDiv.appendChild(externalLinksTitle);

        for(let [linkName, href] of this.externalLinks) {
            var link = document.createElement("a");
            link.innerText = linkName;
            link.href = href;
            rootDiv.appendChild(link);
            rootDiv.appendChild(document.createElement("br"));
        }

        return rootDiv;
    }
}