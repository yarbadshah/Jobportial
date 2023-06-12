import mongoose  from "mongoose";
import colors from 'colors'

const conectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connect to DataBase `.bgMagenta.red)
    } catch(error){
        console.log(`mongoDB ${error}`.bgRed)
    }
}

export default conectDB;