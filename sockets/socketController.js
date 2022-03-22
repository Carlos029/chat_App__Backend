const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


const socketController = async (socket, io) => {

    //validar en el socket, el usuario con el q se tiene la comunicacion
    const token = socket.handshake.headers['x-token']  //lo q me envio el socket cliente con el extraHeaders // ver carpeta public/js/chat funcion conectarSocket

    const usuario = await comprobarJWT(token)

    if (!usuario) {
        return socket.disconnect();  //desconecta la coneccion con el socket
    }

    //Agregar al usuario conectado
    chatMensajes.conectarUsuario(usuario)
    io.emit('usuarios-conectados', chatMensajes.usuariosArr)

    socket.emit('recibir-mensajes', chatMensajes.ultimos10)


    //Eliminar usuario del chat al desconectarse
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-conectados', chatMensajes.usuariosArr)
    })


    //crear una nueva sala  / ya sea privada (entre 2 usuarios), o más
    //en este caso, conectarlo a sala: usuario.id (ejemplo: conectarlo a sala "234uib4987b2")
    // En este caso, cada usuario esta conectado a una sala la cual tiene el id del usuario
    // https://socket.io/docs/v4/rooms/#joining-and-leaving¡
    socket.join(usuario.id)


    socket.on('enviar-mensaje', (payload) => {

        const { uid, mensaje } = payload

        if (uid) { //es un mensaje privado

            /* manda un msj a cada persona que se encuentre en el grupo o sala uid (en este caso como cada usuario se encuentra
             en una sala con su id, en la cual dichos usuarios son los unicos en dicha sala, se envia el msj privado) */
            io.to(uid).emit("mensaje-privado", { de: usuario.nombre, mensaje});

        } else { //mensaje publico

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })

}

module.exports = {
    socketController
}