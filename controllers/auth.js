const { response, request } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { firebaseVerify } = require('../helpers/index');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Email or Password incorrect'//correo
            });
        }

        // SI el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'User blocked. Talk to the administrator ' //estado: false
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Email or Password incorrect' //password incorrect
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Talk to the administrator'
        });
    }

}



//Google log in / sign in
const googleSignin = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const googleUser = await firebaseVerify(id_token); //verifica si es un token valido de google que se genero por medio de firebase 

        const { name, picture, email } = googleUser

        let usuario = await Usuario.findOne({ correo: email });


        /*si se realiza un login con cuenta de google, si se realiza login en la 
        pagina por 1era vez, se crea un nuevo usuario en la base de datos */
        if (!usuario) {
            const data = {
                nombre: name,
                correo: email,
                password: 'Google@User@Password^%&',
                img: picture,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en DB tiene el estado en falso === es un usuario bloqueado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg: 'Token de Firebase no es válido'
        })

    }
}


//Renueva el JWT
const renovarToken = async (req = request, res = response) => {

    const { usuario } = req;
    const token = await generarJWT(usuario.id)

    res.json({
        usuario,
        token
    })

}



module.exports = {
    login,
    googleSignin,
    renovarToken
}
