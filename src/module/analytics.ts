import { ict_handle_analytics } from './content_handlers'
import { getFromServer, requestServer } from './server_comms'
import { nonfatalError } from './error'

export async function loadAnalyticsPage() {
    await ict_handle_analytics()

    // MARK: Visit totals
    let totalsRes = await requestServer("/api/analytics/v1/totals")
    if(totalsRes == null || !totalsRes.ok) {
        nonfatalError("Failed to fetch analytics totals from the server.")
        return
    }
    
    let totals = (await totalsRes.text()).split(" ")
    if(totals.length != 3) {
        nonfatalError("Failed to parse analytics totals from the server.")
        return
    }

    let tToday = document.querySelector("p[type='visit'][when='today']") as HTMLParagraphElement | null
    let tYesterday = document.querySelector("p[type='visit'][when='yesterday']") as HTMLParagraphElement | null
    let tForever = document.querySelector("p[type='visit'][when='forever']") as HTMLParagraphElement | null
    if(tToday != null) tToday.innerText = tToday.innerText + " " + totals[0]
    if(tYesterday != null) tYesterday.innerText = tYesterday.innerText + " " + totals[1]
    if(tForever != null) tForever.innerText = tForever.innerText + " " + totals[2]
}