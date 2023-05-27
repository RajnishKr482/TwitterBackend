import express from 'express'
import userRouter from './routes/userRoutes';
import tweetRoutes from './routes/tweetRoutes'
const app = express()
app.use(express.json());
app.use('/user',userRouter)
app.use('/tweet',tweetRoutes)
app.get('/', (req,res)=>{
    res.send("Hello Word updated")
})

// app.METHOD (PATH,HANDLER)
// 

app.listen(3000,()=>{
    console.log("Server ready at localhost :3000 ")
})