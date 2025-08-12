import mongoose from "mongoose"
import { DB_USER, DB_PASS, DB_CLUSTER, DATABASE } from "../config/config.js"

/* “Si ya estoy conectado, uso eso; si ya me estoy conectando, espero; si no, inicio la conexión”. */
/* global._mongoose garantiza que “estar lista” no significa “abrir conexión nueva cada vez”. */
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}
/* crea un objeto almacen sobreviva aunque se vuelva a ejecutar el archivo
- conn: la conexión ya abierta a Mongo.
- promise: la promesa de conexión mientras se está abriendo.
*/

/* en Vercel cada request puede arrancar un “nuevo” proceso, y sin esto tendrías una conexión nueva por cada request →  Mongo se llenaría de conexiones abiertas hasta fallar. */

export async function conectarDB() {
    if (cached.conn) return cached.conn; // usa conexión activa

    if (!DB_USER || !DB_PASS || !DB_CLUSTER || !DATABASE) {
        throw new Error('Faltan variables de entorno para Mongo');
    }

    const uri = `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASS)}@${DB_CLUSTER}/${DATABASE}?retryWrites=true&w=majority&appName=CEI-VALENCIA-MONGODB-PRACTICAS`;

    if (!cached.promise) {
        // strictQuery true: hace que Mongoose ignore campos no definidos en los filtros
        mongoose.set('strictQuery', true);

        // Inicia la conexión y guarda la promesa. Las opciones ayudan en serverless:
        // - maxPoolSize: limita conexiones simultáneas en el pool
        // - serverSelectionTimeoutMS: tiempo máximo para encontrar un servidor
        // - socketTimeoutMS: tiempo máximo de inactividad del socket (respuesta del servidor a mongoose, para q no se quede pensando indefinidamente si no llega)
        cached.promise = mongoose.connect(uri, {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 20000,
        }).then(m => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}


/*  --- Versión antigua (comentada) ---
    Esta versión funcionaba en local, pero en Vercel puede abrir conexiones nuevas
    en cada invocación (no hay proceso "siempre vivo"), lo que acaba saturando el pool
    de Mongo Atlas. */
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