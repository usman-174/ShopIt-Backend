import "reflect-metadata"
import { createConnection } from "typeorm"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import User from "./entities/User"
dotenv.config()
const app = express()
const PORT = 4000

app.use(express.static("public"))
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
)
app.use(express.static("public"))

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`)

  try {
    await createConnection()
    console.log("Database connected!")
    const user = await User.create({
      username:'New2',
      email:'New2',
      password:'New2',
    }).save()
    console.log(user);
    
  } catch (err) {
    console.log(err)
  }
})
