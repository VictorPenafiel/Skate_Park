import pkg from 'pg'
const {Pool} = pkg
const pool = new Pool({
    user : "postgres",
    host : "localhost",
    password : "postgres",
    database : "skatepark",
    port : 5432
})

export const getSkaters = async () => {
    let client 
    const consulta = {
        name:"select-skater",
        text:"SELECT * FROM skaters ORDER BY id ASC",
        values
    }

    try {
        client = await pool.connect();
        const result = await client.query(consulta);
        return result
    } catch (error) {
        return console.error('Error durante la conexión o la consulta:', error.code , error.stack, error.message );
    }finally{
        if(client){
            client.release();
        }
    } 
}

export const newSkater  = async (skater) => {
    // const values = Object.values (skater)
    // const result = await pool.query (` INSERT INTO skaters ( email, nombre, password, anos_experiencia, especialidad, foto, estado) values ()
    // RETURNING *`)

    let client 
    const values = Object.values(skater);
    const consulta = {
        name:"insert-skater",
        text:"INSERT INTO skaters ( email, nombre, password, anos_experiencia, especialidad, foto, estado) values ($1,$2,$3,$4,$5,$6, false) RETURNING *",
        values
    }

    try {
        client = await pool.connect();
        const result = await client.query(consulta);
        return result
    } catch (error) {
        return console.error('Error durante la conexión o la consulta:', error.code , error.stack, error.message );
    }finally{
        if(client){
            client.release();
        }
    } 
    }
    
export const getSkater  = async (email, password) => {
    const result = await pool.query(
        `SELECT * FROM  skaters WHERE email = '${email}' AND password = '${password}'`
    );
    
    return result.rows[0];

}
        // const values = Object.values (skater)

















//     try{
//         client = await pool.connect();
//         const result = await client.query(consulta);
//         console.log('Salida de result-->' result)
//         return
//     }
// }
   