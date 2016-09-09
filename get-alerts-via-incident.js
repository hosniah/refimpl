const https = require('https')

const apiID = '1457d13e'
const apiKey = '96953ea86f134be98ffcbd99bd5ec146'

const httpOptions = {
    protocol: 'https:',
    hostname: 'stapi.victorops.com',
    method: 'GET',
    headers: {
        'X-VO-Api-Id': apiID,
        'X-VO-Api-Key': apiKey,
        'Content-type': 'application/json'
    }
}

function doRequest(options, body) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (response) => {
            let payload = ''
            response.setEncoding('utf8')
            response.on('data', (d) => {
                payload += d;
            })
            response.on('end', () => {
                resolve(payload)
            })
            response.on('error', (e) => {
                console.log(e)
                reject(e)
            })
        })
        req.end();
    })
}

doRequest(Object.assign({path: '/api-public/v1/incidents'}, httpOptions))
.then((response) => {
    const alertIds = JSON.parse(response).incidents.map((incident) => {
        return [incident.lastAlertId]
    })

    alertIds.map((alertId) => {
        doRequest(Object.assign({path: '/api-public/v1/alerts/' + alertId}, httpOptions))
        .then((response) => {
            console.log(JSON.parse(response))
        })
    })
})
