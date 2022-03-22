const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');



//obtiene usuarios
const usuariosGet = async (req = request, res = response) => {

    const { limit = 5, from = 0 } = req.query;  // ejemplo ==>  //http://localhost:8080/api/users?limit=2&from=4
    const condition = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(condition),
        Usuario.find(condition)  //find all users that meet the condition 
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        usuarios
    });
}




// create new users
const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Save data in the DB
    await usuario.save();

    res.json({
        usuario
    });
}






//Actualiza un usuario en la DB
const usuariosPut = async (req, res = response) => {

    const { id } = req.params; // parametro id que se definio en la ruta del router
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    // update user in the DB
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
         usuario
    });
}






//Bloque el uso del usuario
const usuariosDelete = async (req, res = response) => {

    const { id } = req.params; // parametro id que se definio en la ruta del router
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });


    res.json({
         usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}