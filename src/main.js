const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')


const ContenedorMensajes = require('../containers/ContenedorMensajes.js')
const ContenedorProductos = require('../containers/ContenedorProductos.js')

//--------------------------------------------
// instancio servidor, socket y api
const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const contenedorProductos = new ContenedorProductos();
const contenedorMensajes = new ContenedorMensajes()
//--------------------------------------------
// configuro el socket

io.on('connection', socket => {
    //productos
    products = contenedorProductos.listarAll()
    socket.emit('productos', products)
    
    socket.on('producto', datat =>{
        contenedorProductos.guardar(datat)

        io.sockets.emit('productos', products)
    })
      

    
    //mensajes
    socket.emit('mensajes', contenedorMensajes.listarAll())
    
    socket.on('message', data =>{
        contenedorMensajes.guardar(data)
       
        io.sockets.emit('mensajes', contenedorMensajes.listarAll())
    })

    
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
