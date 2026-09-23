
import 'dotenv/config'; 
import {app} from './app.js'
import {connect} from './db/database.db.js'
connect()

app.listen(process.env.PORT,()=>{
     console.log(`App  listening  on port ${process.env.PORT}`)
})