import mongoose from 'mongoose'


export default ()=>{

    mongoose.connect(String(process.env.CONNECTION_STRING), { useNewUrlParser:true,useUnifiedTopology:true,
        useCreateIndex:true

    }).then(con=>{
        console.log('DATABASE CONNECTED WITH HOST '+con.connection.host)
        console.log('-----------------------------------------');
    })
}