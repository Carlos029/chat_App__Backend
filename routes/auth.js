const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin,renovarToken } = require('../controllers/auth.js');
const { validarJWT,validarCampos } = require('../middlewares');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

router.get('/renew' , validarJWT, renovarToken)



module.exports = router;