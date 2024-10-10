import {connect} from "mongoose";

type connectionObject = {
    isConnected?:number
}

const connection:connectionObject = {}

const dbConnect = async () => {

    if (connection.isConnected) {
        console.log('Database is already connected')
        return
    }
    
    try {
        const db = await connect(process.env.MONGODB_URI || "")

        connection.isConnected = db.connections[0].readyState
        console.log("Connected to database successfully.")

    } catch (error) {
        console.log("Database connection failed: ",error)
        process.exit(0)
    }

}

export default dbConnect;