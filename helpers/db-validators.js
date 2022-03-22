const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


//revisa si el rol es uno de los que se encuentra en la DB
const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}


//revisa si el email se encuentra en la DB
const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

//revisa si el id de un usuario en especifico se encuentra en la DB
const existeUsuarioPorId = async( id ) => {

    // Verificar si el id existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}

