export async function getFromServer(path: string): Promise<string | null> {
    let req = await requestServer(path)
    if(req == null || !req.ok) return null;
    
    return await req.text();
}

export async function requestServer(path: string, method: string = "GET", body: string | null = null): Promise<Response | null> {
    var req = new Request(path, {
        method: method,
        body: body
    });
    
    var res: Response;
    try {
        res = await fetch(req)
    } catch(err) {
        console.error(err);
        return null;
    }

    return res;
}