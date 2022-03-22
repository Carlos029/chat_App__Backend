
const { Router } = require('express');
const { check } = require('express-validator');
const {
    validarCampos,
    validarJWT,
    tieneRole
} = require('../middlewares');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet,
        usuariosPut,
        usuariosPost,
        usuariosDelete } = require('../controllers/usuarios');



const router = Router();

//obtiene usuarios 
router.get('/', usuariosGet ); 


// Actualiza un usuario en la DB
router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos
],usuariosPut );



//crea nuevo usuario en la DB
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('rol').custom( esRoleValido ), 
    validarCampos
], usuariosPost );



// delete o deactivate user in the DB
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'), //revisa si el usuario que esta realizando la accion es uno con el rol de admin
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );






module.exports = router;