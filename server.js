const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const { InitiateSocket } = require('./utils/socket')






const connectDB = require('./utils/db')

const app = express()

const cookieparser = require('cookie-parser')
app.use(cookieparser())
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
const cors = require('cors')
const ALLOWED_GET_ORIGIN = process.env.FRONTEND_URL
console.log(ALLOWED_GET_ORIGIN)
app.use(cors({
  origin: true,        
  credentials: true
}))


//pronaci nacin samo sa metrice cloud da dozvoli get, a post od svuda (barem ovde, allowedorigin za post resavaju kontroleri)


const http = require('http')
const server = http.createServer(app)
InitiateSocket(server)


const UserRoutes = require('./routes/UserRoutes')
app.use('/metrica/user', UserRoutes)
const ProjectRoutes = require('./routes/ProjectRoutes')
app.use('/metrica/project', ProjectRoutes)
const PageRoutes = require('./routes/PageRoutes')
app.use('/metrica/page', PageRoutes)
const EventRoutes = require('./routes/EventRoutes')
app.use('/metrica/event', EventRoutes)
const LicenseRoutes = require('./routes/LicenseRoutes')
app.use('/metrica/license', LicenseRoutes)
const PageViewRoutes = require('./routes/PageViewRoutes')
app.use('/metrica/pageview', PageViewRoutes)
const EventTriggerRoutes = require('./routes/EventTriggerRoutes')
app.use('/metrica/eventtrigger', EventTriggerRoutes)
const CheckRoutes = require('./routes/CheckRoutes')
app.use('/metrica/check', CheckRoutes)
const WaitlistRoutes = require('./routes/WaitlistRoutes')
app.use('/metrica/waitlist', WaitlistRoutes)


const DEVROUTES = require('./routes/DEVROUTES')
app.use('/metrica/dev', DEVROUTES)


connectDB().then(()=>{
    server.listen(3000)
})

