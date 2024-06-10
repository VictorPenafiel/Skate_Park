window.addEventListener('DOMContentLoaded', ()=> {
    console.log('Se cargo el DOM')

    const formLogin = document.querySelector('#formLogin')

    if( formLogin != null){
        formLogin.addEventListener('submit', async (e) =>{
            e.preventDefault()

            console.log(document.querySelector('input'))
            const email = document.querySelector('#email').value 
            const password = document.querySelector('#password').value 
            try{
                await axios.post('/login',{
                    email,
                    password
                })
                .then (respuesta =>{
                    console.log('Salida de respuesta-->', respuesta)
                })
            } catch (error){
                console.error('Algo salio mal en el envio de datos....')
            }

        })
    }
})