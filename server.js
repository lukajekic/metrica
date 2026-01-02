const express = require('express')
const dotenv = require('dotenv')
dotenv.config()







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
    origin: (origin, callback) => {
        // Dozvoli zahteve koji nemaju origin (npr. Postman ili lokalni fajlovi)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [ALLOWED_GET_ORIGIN, 'http://127.0.0.1:5500', 'http://localhost:5500'];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('file://')) {
            return callback(null, true);
        } else {
            return callback(new Error('CORS greška: Ovaj Origin nije dozvoljen.'));
        }
    },
    credentials: true // Ovo ti treba ako šalješ cookije ili auth headere
}));

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


const DEVROUTES = require('./routes/DEVROUTES')
app.use('/metrica/dev', DEVROUTES)


connectDB().then(()=>{
    app.listen(3000)
})

