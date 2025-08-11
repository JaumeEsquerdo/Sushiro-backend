import mongoose from "mongoose"
import { DB_USER, DB_PASS, DB_CLUSTER, DATABASE } from "../config/config.js"


let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}



export async function conectarDB() {
    if (cached.conn) return cached.conn; // usa conexión activa

    if (!DB_USER || !DB_PASS || !DB_CLUSTER || !DATABASE) {
        throw new Error('Faltan variables de entorno para Mongo');
    }

    const uri = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_CLUSTER}/${DATABASE}?retryWrites=true&w=majority&appName=CEI-VALENCIA-MONGODB-PRACTICAS`;

    if (!cached.promise) {
        mongoose.set('strictQuery', true);
        cached.promise = mongoose.connect(uri, {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 20000,
        }).then(m => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}



// export const conectarDB = async () => {

//     const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}/${DATABASE}?retryWrites=true&w=majority&appName=CEI-VALENCIA-MONGODB-PRACTICAS`


//     try {
//         await mongoose.connect(url)
//         console.log("conectado a mongoDB Atlas")
//         console.log("base de datos actual:", mongoose.connection.db.databaseName)

//         //preguntar que colecciones tengo disponibles
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         console.log('colleciones disponibles', collections.map(c => c.name));
//     } catch (e) {
//         console.error('error al conectarse', e)
//     }

// }