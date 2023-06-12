import swaggerDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import morgan from 'morgan'
import conectDB from './config/db.js'
import testrouter from './routes/testRoutes.js';
import authRouter from './routes/authRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import 'express-async-errors'
dotenv.config()
const app = express()

conectDB();
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Job Portal Application",
        description: "Node Expressjs Job Portal Application",
      },
      servers: [
        {
           url: "http://localhost:8080",
           
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const spec = swaggerDoc(options);
  
app.use(helmet());
app.use(xss());
app.use(mongoSanitize())
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api/v1/test', testrouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/job', jobsRoutes)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(spec));
app.use(errorMiddleware)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`node sever running at ${process.env.Dev_Mode} running at port number ${port}`.blue)
})