import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

const eventos = {}
const registros = {}

app.post('/registrar', (req, res) => {
  const { nome, interesses, porta } = req.body

  registros[nome] = { interesses, porta }
  console.log(`Registrado: ${nome} =>`, interesses)

  res.status(200).send({ status: 'OK' })
})

app.post('/eventos', async (req, res) => {
  const evento = req.body

  eventos[evento.type] = (eventos[evento.type] || []).push(evento)

  console.log(evento)
  for(let nome in registros){
    const registro = registros[nome]

    if(registro.interesses.includes(evento.type) || registro.interesses.includes('*')){
      try{
        await axios.post(`http://localhost:${registro.porta}/eventos`, evento)
      }
      catch(e){}
    }
  }
  res.end()
})

app.get('/eventos', (req, res) => {
  res.json(eventos)
})


const port = 10000
app.listen(port, () => {
  console.log(`Barramento. Porta ${port}.`)
})
