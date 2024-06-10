import express from 'express';
import { create } from 'express-handlebars';
import expressFileUpload from 'express-fileupload';
import jwt from 'jsonwebtoken';

// Creación de variables de entorno
import { fileURLToPath } from 'url'
import { 
    getSkaters,
    newSkater,
    getSkater
} from './consultas.js';
import { dirname } from "path";

// Variables que me permiten mostrar el path donde estoy en el proyecto
const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

//Crear una constante app para pasarle la funcion express y asi hacer referencia a app
const app = express ();
const puerto = 3000;
const secretKey ="clavesecreta2030";
console.clear()

//Hacer la apertura de los distintos middlewares
app.use(express.urlencoded({ extended: false}))
app.use(express.json())
app.use(express.static( `${__dirname}/public`))
app.use('/css' , express.static( `${__dirname}/public/css`))
app.use('/bootstrap' , express.static( `${__dirname}/node_modules/bootstrap/dist/css`))
app.use('/axios' , express.static( `${__dirname}/node_modules/axios/dist`))
app.use('/js' , express.static( `${__dirname}/public/js`))


//Hacer la apertura de middlewares de FileUpLoad
app.use( expressFileUpload({
    limits : 5000000,
    abortOnLimit : true,
    responseOnLimit : "El peso del archivo supera los 5 megas"
}))

//Vamos a configurar nuestro motor de plantilla Handlebars

const hbs = create({
    partialsDir:[
        "views/"
    ]
})

//Configurar motor de plantilla que renderize Handlebars

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


//Creamos nuestras rutas

app.get ('/', async( req, res)=> {
    try{
        const skaters = await getSkaters()
        res.render("Home",{
            layout : 'main',
            skaters
        })
    } catch (error){
        res.status(500).send({
            error:`Algo salio mal ${error}`,
            code:500
        })
    }
})


app.get('/registro', (req, res)=>{
    res.render('Registro')
        layout:'main'
})

app.post('/skaters', (req, res)=>{
    
        // console.log('Salida de req.body', req.body)
        // console.log('Salida de req.files', req.files)
        const skater = req.body;
        if(Object.keys(req.files).length == 0){
            return res.status(400).send('No viene ninguna imagen')
        }
        
        const { files } = req;
        const { foto } = files;
        const { name } = foto;
        const urlFoto = `/uploads/${name}`

        // console.log('Salida de name-->', name)
        foto.mv(`${__dirname}/public${urlFoto}`, async (err)=>{
            try{
                if(err){
                    console.error()
                }else{
                    skater.foto = urlFoto
                    await newSkater(skater)
                    res.status(201).redirect('/login')
                }
                
            } catch (error){
                console.error ('Algo salio mal', error)
            }   
        })


})

app.get('/login', (req, res)=>{
    res.render('Login')
        layout:'main'
})

app.post("/login",async  (req, res)=>{
    console.log('XXXXXX--->', req.body)
    const { email, password} = req.body
    
    try {
        const skater =await getSkater(email, password)
        if(skater){
            const token = jwt.sign(
                {
                    exp : Math.floor(Date.now() / 1000) + 240, // Dura 4 minutos
                },
                secretKey
            )
            res.send({token})
        }else{
            res.status(401).send({msg:"Usuario y contraseña inavalida"})
        }
    } catch (error) {
        console.error ('Algo salio mal', error)
    }

    // res.send({email, password})
})

// Habilitamos un puerto para que el server escuche y responda a traves de un puerto en especifico
app.listen( puerto , () => console.log(`Servidor arriba en el puerto ${puerto}`))

