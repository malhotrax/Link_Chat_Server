import mongoose from "mongoose";


const connectToDB = async () => {
    try {
        const DB_URI = process.env.DB_URI;
        const DB_NAME = process.env.DB_NAME;
        console.log(DB_URI, DB_NAME);
        console.log("Connecting to database...");   
        const connectionObject = await mongoose.connect(`${DB_URI}/${DB_NAME}`)
        console.log(`Connected to database: ${connectionObject.connection.name}`);

    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

export default connectToDB;