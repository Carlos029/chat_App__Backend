const jwt = require('jsonwebtoken');
const {Usuario} = require('../models')


//Genera un JWT
const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { //utiliza el payload/data y usa la secret key para crear el JWT
            expiresIn: '10min'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })

    })
}



const comprobarJWT = async (token = '') => {

    try {

        if (token.length < 10) {
            return null
        }

        //comprobar que el JWT haya sido creado con la misma contraseña secreta
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await Usuario.findById(uid)

        if(usuario && usuario.estado === true){
            return usuario
        }else{
            return null
        }

    } catch (error) {
        return null
    }

}



module.exports = {
    generarJWT,
    comprobarJWT
}

