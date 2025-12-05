export async function getFromServer(path: string): Promise<string | null> {
    var req: Response;
    try {
        var req = await fetch(path);
    } catch(e) {
        return null;
    }

    if(!req.ok) return null;

    return await req.text()
}