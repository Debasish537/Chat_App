import mongoose from "mongoose";

//Function to connect to the mongodb database
export const connectDB = async () =>{
    try {
       const db= mongoose.connection;
       db.on('connected', () => console.log("Database connected successfully"));
    //    db.on('disconnected',()=> {
    //     console.log("Database disconnected")
    //    });
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error);
    }

}

