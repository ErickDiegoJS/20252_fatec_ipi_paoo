const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

let id = 0
const lembretes = {}
const funcoes = {
  LembreteClassificado: (lembrete) => {
    lembretes[lembrete.id] = lembrete
    axios.post('http://localhost:10000/eventos', {
      type: 'LembreteAtualizado',
      payload: lembrete
    })
  }

}

app.post('/lembretes', async function(req, res){
  id++
  const texto = req.body.texto
  const lembrete = { id, texto, status: 'aguardando' }
  lembretes[id] = lembrete
  await axios.post('http://localhost:10000/eventos', {
    type: 'LembreteCriado',
    payload: lembrete
  })
  res.status(201).json(lembrete)
})

app.get('/lembretes', (req, res) => {
  res.json(lembretes)
})

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){
  }
  res.end()
})

const port = 4000
app.listen(port, async () => {
  console.log(`Lembretes. Porta ${port}.`)
  
  await axios.post('http://localhost:10000/registrar', {
    nome: "lembrete",
    interesses: ["LembreteClassificado"],
    porta: port
  })
  console.log(`Interesses registrados no barramento.`)
})