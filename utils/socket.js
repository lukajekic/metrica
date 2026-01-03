let io = null

const InitiateSocket = (server)=>{
    io = require('socket.io')(server, {
        cors: {
            origin: (origin, callback) =>{
                callback(null, true)
            },

            credentials: true
        }
    })


    io.on('connection', (socket)=>{
        console.log(`Socket je povezan: ${socket.id}`)

        socket.on('joinProjectDashboard', (projectID)=>{
            socket.join(projectID)
            console.log(`Socket sa id-em [${socket.id}] pristupio je real-time prikazu podataka za projekat: [${projectID}]`)
        })


        socket.on('updatePageViewStats', (data)=>{
            console.log('='.repeat(30))
            console.log('New Dashboard Update')
            console.log('-'.repeat(30))
            console.log(`Path: ${data.path}`)
            console.log(`Date: ${data.date}`)
            console.log('-'.repeat(30))
            console.log('Nested in io.on(connection)')
            console.log('='.repeat(30))
        })
    })
}



const getIO = ()=>{
    if (!io) {
        console.log('SOCKET NIJE INICIJALIZOVAN')
    }

    return io
}


module.exports = {InitiateSocket, getIO}