

const {admin} = require('../firebase/firebase-config')

const firebaseVerify = async( idToken = '') =>{

  const token = await admin.auth().verifyIdToken(idToken) //revisa que el id de una autentificacion haya sido creado por firebase

  return token

}


module.exports = {
    firebaseVerify
}