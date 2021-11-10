const {Router, text} = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const router = Router();
const {signUp, signIn, principalEventos, crearEvento} = require('../controllers/index.controller');
const jwt = require('jsonwebtoken');

router.get('/');
router.get('/eventos',principalEventos);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/crear-evento', crearEvento);



// Aquí se añaden el resto de rutas 



//Verificar que el usuario pasó por singup o signin
function verifyTocken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized Request');
    }
    const token = req.headers.authorization.split(' ')[1]
    if(token == 'null'){
        return res.status(401).send('Unauthorized Request');
    }

    const payload = jwt.verify(token,'secretKey');
    req.userId = payload.id;
    next();
}


module.exports = router;