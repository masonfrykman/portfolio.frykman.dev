function makeTree(iter: number, ceil: number, n: number, degreeRange: [number, number], lineLength: number, origin: [number, number], surface: CanvasRenderingContext2D) {
    console.log("makeTree -> iter: " + iter + " ceil: " + ceil + " n: " + n + " range: " + degreeRange + " line: " + lineLength + " origin: " + origin)
    
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
        surface.moveTo(origin[0], origin[1])
        surface.strokeStyle = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")"
        surface.lineTo(origin[0] + b, origin[1] + a)
        surface.stroke()

        makeTree(iter + 1, ceil, n, degreeRange, lineLength, [origin[0] + b, origin[1] + a], surface)
    }
}

export function drawBackground() {
    let surface = (document.getElementById("background")! as HTMLCanvasElement).getContext("2d")!

    makeTree(0, 5, 2, [270, 90], 50, [0, 0], surface)
}