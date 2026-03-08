let colorValues: number[][] = [
    [], // red
    [], // green
    []  // blue
];

function averageLineColor(): [number, number, number] {
    var r = 0,
        g = 0,
        b = 0;

    for(var i = 0; i < colorValues[0]!.length; i++) {
        r += colorValues[0]![i]! / ((Math.random()) + 1)
        g += colorValues[1]![i]! / ((Math.random()) + 1)
        b += colorValues[2]![i]! / ((Math.random()) + 1)
    }

    let len = colorValues[0]!.length
    return [r / len, g / len, b / len]
}

function medianLineColor(): [number, number, number] {
    return [colorValues[0]![Math.floor(colorValues[0]!.length / 2)]!, colorValues[1]![Math.floor(colorValues[0]!.length / 2)]!, colorValues[2]![Math.floor(colorValues[0]!.length / 2)]!]
}

function applyAvgColor(toElem: HTMLElement) {
    let avgs = medianLineColor()

    toElem.setAttribute("style", "background-color:rgba(" + avgs[0] + "," + avgs[1] + "," + avgs[2] + ", 0.8)")
}

async function makeTree(iter: number, ceil: number, n: number, degreeRange: [number, number], lineLength: number, origin: [number, number], surface: SVGSVGElement) {
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

        let red = Math.random() * 255
        let blue = Math.random() * 255
        let green = Math.random() * 255
        colorValues[0]!.push(red)
        colorValues[1]!.push(blue)
        colorValues[2]!.push(green)

        let line = document.createElementNS("http://www.w3.org/2000/svg", "path")

        line.setAttribute("d", d)
        line.setAttribute("stroke", "rgb(" + red + "," + blue + "," + green + ")")
        line.setAttribute("stroke-width", "1")

        surface.appendChild(line)

        await new Promise(res => setTimeout(res, 50))

        makeTree(iter + 1, ceil, n, degreeRange, lineLength, [origin[0] + b, origin[1] + a], surface)
    }
}

export async function drawBackground() {
    if(window.localStorage.getItem("no-background-v1") == "true") {
        return
    }

    let surface = document.getElementById("background") as unknown as SVGSVGElement

    makeTree(0, 6, 3, [0, 180], window.innerWidth / 3, [0, 0], surface)
    makeTree(0, 6, 3, [0, 180], window.innerWidth / 3, [window.innerWidth / 2, 0], surface)
}