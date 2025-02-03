let requestNumber = 1
let showLogs = true

export function setShowLogs(newShowLogs) {
    showLogs = newShowLogs
}

export default function showRequests(req, res, next) {
    if (showLogs) {
        console.log('#' + requestNumber + " - " + req.method +" " + req.path)
    }
    requestNumber++
    next()
}

