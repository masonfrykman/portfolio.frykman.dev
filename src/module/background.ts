function makeTree(iter: number, ceil: number, n: number, degreeRange: [number, number], lineLength: number, origin: [number, number], surface: SVGSVGElement) {
    //console.log("makeTree -> iter: " + iter + " ceil: " + ceil + " n: " + n + " range: " + degreeRange + " line: " + lineLength + " origin: " + origin)
    
    if(iter == ceil || n < 1) {
        return
    }

    // Randomly generate a degree within the allowed range.
    // This should hopefully cover [0] > [1] and [1] > [0]
    let deg = Math.random() * Math.abs(degreeRange[1] - degreeRange[0])
    let degFloor = deg + degreeRange[0]

    while(deg >= 360) {
        deg -= 360;
    }

    // We're growing by n per iteration, so split up the deg
    let degGrowthFactor = deg / n

    for(let i = 0; i <= n; i++) {
        let degI = degFloor + degGrowthFactor * i
        while(degI > 360) {
            degI -= 360
        }

        // Use Law of Sines & Cosines to find the x & y extensions
        let theta = (degI * Math.PI) / 180 // convert degrees to radians
        let a = lineLength * Math.sin(theta) // this will be the y extension
        let b = lineLength * Math.cos(theta) // this will be the x extension

        // Draw a line from the current origin to the new origin.
        let d = "M" + origin[0] + " " + origin[1] + " L" + (origin[0] + a) + " " + (origin[1] + b)

        let line = document.createElementNS("http://www.w3.org/2000/svg", "path")
        line.setAttribute("d", d)
        line.setAttribute("stroke", "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")")
        line.setAttribute("stroke-width", "1")

        surface.appendChild(line)

        makeTree(iter + 1, ceil, n, degreeRange, lineLength, [origin[0] + b, origin[1] + a], surface)
    }
}

export function drawBackground() {
    if(window.localStorage.getItem("no-background-v1") == "true") {
        return
    }

    let surface = document.getElementById("background") as unknown as SVGSVGElement

    makeTree(0, 6, 3, [0, 180], window.innerWidth / 3, [0, 0], surface)
    makeTree(0, 6, 3, [0, 180], window.innerWidth / 3, [window.innerWidth / 2, 0], surface)
}