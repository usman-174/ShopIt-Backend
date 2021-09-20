import mongoose from 'mongoose'


export default ()=>{

    mongoose.connect(String(process.env.CONNECTION_STRING), { useNewUrlParser:true,useUnifiedTopology:true,
        useCreateIndex:true

    }).then(con=>{
        console.log('DATABASE CONNECTED WITH HOST '+con.connection.host)
        console.log('-----------------------------------------');
    }).catch(err=>{console.log('Failed to connect to database '+err.message)
        console.log('-----------------------------------------');})
}