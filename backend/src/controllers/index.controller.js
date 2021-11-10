const jwt = require('jsonwebtoken');
//Bases de datos Posqtgresql
const {Client} = require('pg');

//Conexión a la base de datos
const client = new Client({
    host: "ec2-35-170-202-150.compute-1.amazonaws.com",
    user: "postgres",
    port: 5432,
    password: "AdminCM21",
    database: "tuticketbase"
});

client.connect();
//funcion para la ruta signup
const signUp = async (req,res) =>{
    const {nombre, apellido, email, password,region} = req.body;
    const INSERT_infousuario = {
        text: 'INSERT INTO public.data_user_crt(nombre, apellido, correo, contrasena, region)VALUES ($1, $2, $3, $4, $5)', //cambiar path foto por edad
        values: [nombre, apellido, email, password, region]
      }
        await client.query(INSERT_infousuario, (err, resquery)=>{
        if(!err && resquery.rowCount > 0){
            const queryid = async (requestt, ress) =>{
                
                    await client.query('SELECT id FROM public.data_user_crt ORDER BY id DESC LIMIT 1',(err2,resquery2)=>{
                        if(!err2 && resquery2.rowCount > 0){
                        const token = jwt.sign({id:resquery2.rows[0].id}, 'secretKey');
                        res.status(200).json({
                        token});
                        }
                    });
            }
            queryid()
        }
        else{
            return res.status(401).send('Datos erroneos')
        }
    })
    
    
    //Query para obtener todos los usuarios creados
    /*
    console.log('entro');
    const response = await client.query('SELECT * FROM public.data_user_crt');
    console.log(response.rows);
    //const { email, password} = req.body;
    res.send("testing signup");
    */
};

const signIn = async (req,res) =>{
    const{email,password} = req.body;
    const SELECTQ = {
        text: 'SELECT id, nombre, apellido, correo, region, path_foto FROM public.data_user_crt WHERE correo = ($1) AND contrasena = ($2)', //Id del ultimo usuario creado
        values: [email, password]
      }
        await client.query(SELECTQ, (err, resquery)=>{
        if(!err && resquery.rowCount > 0){
            const token = jwt.sign({id: resquery.rows[0].id},'secretKey'); //generamos el token del usuario
            return res.status(200).json({
                token
            });
        }
        else{
            return res.status(401).send('Datos erroneos')
        }
    });
}


const principalEventos = async (req, response) =>{
    const token = jwt.verify(req.headers.authorization,'secretKey');
    var id_user = token.id //Este es el Id del usuario
    //var id_user = 44

    console.log("Usuario: ", id_user);

    //Aqui se hace la query para obtener todos los eventos de un usuario
    var idseventos = [];
    var info = []; 
    const SELECTQ_evento_info = {
        text: 'SELECT id_evento FROM eventos_creados WHERE id_user_crt = ($1)',
        values: [id_user]
    }
    client.query(SELECTQ_evento_info, (err, res)=>{
        if(!err){
            idseventos = res.rows
            console.log(idseventos)
            for (const index in idseventos) {  
                eventid = idseventos[index]
                for (const key in eventid) {  
                    console.log(`${eventid[key]}`)
                    const SELECT_INFO_EVENTOS_CREADOS = {
                        text: 'SELECT data_evento.id, data_evento.nombre, data_evento.descripcion, data_evento.fecha, data_evento.hora, data_evento.fecha_limite, data_evento.publicado, data_evento.path_foto, categorias.nombre_categoria  FROM ((data_evento INNER JOIN categoria_evento ON data_evento.id = categoria_evento.id_evento) INNER JOIN categorias ON categoria_evento.id_categoria = categorias.id) WHERE data_evento.id = ($1)',
                        values: [eventid[key]]
                    }
                    client.query(SELECT_INFO_EVENTOS_CREADOS, (err, res)=>{
                        if(!err){
                            console.log(res.rows[0]);
                            if (res.rows[0]) {
                                info.push(res.rows[0]);
                            }
                            
                            if (idseventos[index] == idseventos[idseventos.length-1]){
                                console.log("HTTP Request GET eventos!!");
                                console.log(info);
                                response.status(200).json(info);
                            }

                            //for (const index in info) {  
                            //    user = info[index]
                            //    for (const key in user) {  
                            //        console.log(`${key}: ${user[key]}`)
                            //    }
                            //}
                        }
                        else{
                            console.log(err.message);
                        }
                        client.end;
                    });
                    //segudno info de localidad y de ubicación
                    const SELECT_INFO_EVENTOS_CREADOS_p2 = {
                        text: 'SELECT data_evento.id,  localidades.nombre_localidad, ubicaciones.nombre_ubicacion, info_ubi_local_eventos.total, info_ubi_local_eventos.precio FROM ((data_evento INNER JOIN info_ubi_local_eventos ON data_evento.id = info_ubi_local_eventos.id_evento) INNER JOIN localidades ON info_ubi_local_eventos.id_localidad = localidades.id  INNER JOIN ubicaciones ON info_ubi_local_eventos.id_ubicacion = ubicaciones.id) WHERE info_ubi_local_eventos.id_evento = ($1)',
                        values: [eventid[key]]
                    }
                    client.query(SELECT_INFO_EVENTOS_CREADOS_p2, (err, res)=>{
                        if(!err){
                            console.log(res.rows[0]);
                            if (res.rows[0]) {
                                //info.push(res.rows[0]);
                            }

                            //for (const index in info) {  
                            //    user = info[index]
                            //    for (const key in user) {  
                            //        console.log(`${key}: ${user[key]}`)
                            //    }
                            //}
                        }
                        else{
                            console.log(err.message)
                        }
                        client.end;
                    });
                }
            }
        }
        else{
            console.log(err.message)
        }
        client.end;
    });
    //res.send('Testing eventos') //Hay que cambiar esto para que devuelva un Json con todos los eventos del usuario
}





const crearEvento = async (req,resp) =>{
    const {idUsuarioD,nombre,descripcion,categoria,fecha,precio,ubicacion,boletosmax,fechamax} = req.body;

    const token = jwt.verify(req.headers.authorization,'secretKey');
    var id_usuario = token.id //Este es el Id del usuario

    //var id_usuario = jwt.verify(idUsuarioD,'secretKey').id;
    console.log(id_usuario)
    console.log(idUsuarioD)
    console.log(nombre)
    console.log(descripcion)
    console.log(categoria)
    console.log(fecha)
    console.log(precio)
    console.log(ubicacion)
    console.log(boletosmax)
    console.log(fechamax)
    var fecha1 = fecha.split("T");  

    console.log(fecha1[0]) //fecha de creación del evento 
    console.log(fecha1[1]) //Hora del evento creado

    var fecha2 = fechamax.split("T"); 
    console.log(fecha2[0]) // fecha limite del evento 
    console.log(fecha2[1])


    //var nombre = nombre
    //var descripcion = descripcion
    //var fecha = fecha1[0]
    //var hora = fecha1[1]
    //var fecha_limite = fecha2[0]
    
    const INSERT_infoevento = {
        text: 'INSERT INTO public.data_evento(nombre, descripcion, fecha, hora, fecha_limite)VALUES ($1, $2, $3, $4, $5)',
        values: [nombre, descripcion, fecha1[0], fecha1[1], fecha2[0]]
    }
    client.query(INSERT_infoevento, (err, res)=>{
        if(!err){
            console.log(res.rows);
        }
        else{
            console.log(err.message)
        }
        client.end;
    });

    var id_evento;
    //var id_usuario = 43; 

    // aqui query para traer el id, del evento creado.  
    const SELECT_ID_EVENTO_creado = {
        text: 'SELECT id FROM public.data_evento ORDER BY id DESC LIMIT 1',
        values: []
    }
    client.query(SELECT_ID_EVENTO_creado, (err, res)=>{
        if(!err){
            info = res.rows
            //console.log(res.rows);
            for (const index in info) {  
                user = info[index]
                for (const key in user) {  
                    id_evento = user[key]
                }
            }
            const INSERT_eventoscreados = {
                text: 'INSERT INTO public.eventos_creados(id_user_crt, id_evento)VALUES ($1, $2)',
                values: [id_usuario, id_evento]
            }
            client.query(INSERT_eventoscreados, (err, res)=>{
                if(!err){
                    console.log(res.rows);
                }
                else{
                    console.log(err.message)
                }
                client.end;
            });
            var categorias = [1];
            for (const index in categorias){
                const INSERT_categoria_evento = {
                    text: 'INSERT INTO public.categoria_evento(id_evento, id_categoria)VALUES ($1, $2)',
                    values: [id_evento, categorias[index]]
                }   
                client.query(INSERT_categoria_evento, (err, res)=>{
                    if(!err){
                        console.log(res.rows);
                    }
                    else{
                        console.log(err.message)
                    }
                    client.end;
                });
            }
            localidades= [1]
            ubicaciones = [1]
            total = 15
            for (const index in localidades){
                const INSERT_categoria_evento = {
                    text: 'INSERT INTO public.info_ubi_local_eventos(id_evento, id_localidad, id_ubicacion, total, precio) VALUES ($1, $2, $3, $4, $5);',
                    values: [id_evento, localidades[index], ubicaciones[index], total, precio]
                }   
                client.query(INSERT_categoria_evento, (err, res)=>{
                    if(!err){
                        console.log(res.rows);
                    }
                    else{
                        console.log(err.message)
                    }
                    client.end;
                });
            }
        }
        else{
            console.log(err.message)
        }
        client.end;
    });
    return resp.status(200).json({
        ok:'ok'
    });
    
}

module.exports ={
    signUp,
    signIn,
    principalEventos,
    crearEvento
}