import express from 'express';
import path from 'path'


import { PORT, DOMAIN } from './config/config.js' //config


import { conectarDB } from './db/mongoose.js'

// importar middleware de multer
import { uploadImg } from './middleware/upload.middleware.js'



import cors from 'cors' //para q funcione el fetch a un front
import router from './routes/index.routes.js';

//multer
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"

const app = express();


//llamar a la función fuera

app.use(cors()); //conectar desde cualquier conexión
app.use(express.json()) //leer datos que vienen en el body de mi request
app.use(express.urlencoded({ extended: true })) // nos permite leer datos desde formularios HTML
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads'))) // Permite que Express sirva las imágenes almacenadas en 'public/uploads' para que, al usar las URLs guardadas en la base de datos (ej. http://localhost:3000/uploads/nombre-archivo.png), el frontend pueda mostrarlas correctamente.



conectarDB();

//RUTAS FRONT
//limpiar la terminal cada vez que reinicio proyecto
console.clear();
app.get("/", (req, res) => {
    // res.send("Bienvenidos a nuestra API con express y mongo")
    const landingHtml = `
    <h2>Hola </h2>
    <p>Bienvenidos a la prueba del backend para ponerlo en Varcel</p>
    <hr>
    `;
    res.send(landingHtml)

})
//Comentado el upload de imgs
// <h2>Upload de archivos </h2>
// <form action="/api/v1/producto/upload" method="POST" enctype="multipart/form-data">
// <input type="file" name="imgprod" />
// <button type="submit">Subir imagen </button>
// </form>


// ruta para subir imagen de producto
// usamos el middleware de multer para procesar "imgprod"
router.post("/producto/upload", uploadImg.single('imgprod'), (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No se ha proporcionado una imagen" /           })
        }
        //  console.log(req.file)

        // recibir img
        const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`


        //guardar req.file.filename en la base de datos no la url porq puede ser calhost, vercel....

        //response al usuario
        return res.status(200).json({
            success: "ok",
            message: "imagen subida con éxito",
            fileData: req.file,
            data: {
                imageUrl: imageUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                peso: `${Math.round(req.file.size / 1024)} KBytes`
            }
        })
    } catch (e) {
        next(e)
    }
});


app.use("/api/v1", router)

export default app; // para q funcione vercel

//puerto PORT... comentado para q funcione en desarrollo vercel
// app.listen(PORT, () => {
//     //     //  console.log(`Servidor funcionando en ${DOMAIN}:${PORT}`)
// })