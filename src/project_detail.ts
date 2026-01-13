export default class ProjectDetails {
    private name: string;
    private subtitle: string | null;
    private date: string | null;
    private images: Array<string> | null; // may be empty
    private longDescription: string | null;
    private externalLinks: Map<string, string> | null; // may be empty

    public constructor(name: string, subtitle: string, date: string | null, images: Array<string> | null, longDescription: string, externalLinks: Map<string, string> | null) {
        this.name = name;
        this.subtitle = subtitle;
        this.date = date;
        this.images = images;
        this.longDescription = longDescription;
        this.externalLinks = externalLinks;
    }

    public static revive(jsonObject: any): ProjectDetails | null {
        if(jsonObject.name == undefined) {
            return null;
        }

        var tl: Array<string> | null;
        if(jsonObject.images == null) {
            tl = null;
        } else {
            tl = jsonObject.images;
        }
        console.log(jsonObject.images);
        return new ProjectDetails(jsonObject.name, jsonObject.subtitle ?? null, jsonObject.date ?? null, tl, jsonObject.longDescription ?? null, jsonObject.externalLinks != undefined ? new Map(Object.entries(jsonObject.externalLinks)) : null);
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
        
        // ## HEADING
        let h1Name = document.createElement("h1");
        h1Name.innerText = this.name;
        rootDiv.appendChild(h1Name);
        
        // ## SUBHEADING
        let subheading = document.createElement("div");
        subheading.classList.add("subheading")

        if(this.subtitle != null) {
            let h4ST = document.createElement("p");
            h4ST.innerText = this.subtitle;
            subheading.appendChild(h4ST);
        }

        if(this.date != null) {
            let dateSpan = document.createElement("i");
            dateSpan.innerText = this.date;
            subheading.appendChild(dateSpan);
        }

        rootDiv.appendChild(subheading);

        // ## IMAGES
        if(this.images != null && this.images!.length != 0) {
            for(let imgString of this.images!) {
                if(imgString.length == 0) continue;
                var img = document.createElement("img");
                img.src = "/img/" + imgString;
                img.classList.add("project-image");
                rootDiv.appendChild(img);
            }
        }
        
        let ldContainer = document.createElement("div");

        // ## LONG DESC
        if(this.longDescription != null) {
            let ldHeader = document.createElement("h2");
            ldHeader.innerText = "Description";
            ldContainer.appendChild(ldHeader);

            let paragraphs = this.longDescription.split("\n");
            for(var paragraphText of paragraphs) {
                let paragraph = document.createElement("p");
                paragraph.innerText = paragraphText;
                ldContainer.appendChild(paragraph);
            }
        }

        rootDiv.appendChild(ldContainer);

        // ## EXTERNAL LINKS
        if(this.externalLinks != null) {
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
        }

        return rootDiv;
    }
}