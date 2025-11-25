const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())
//GET serve para obter coisas do servidor
//POST serve para cadastrar itens novos
//PUT serve para atualizar itens existentes
//DELETE serve para apagar itens existentes

// Um lembrete: {id: 1, texto: 'Fazer café'}
/*
  lembretes:
  {
    1: {id: 1, texto: 'Fazer café'},
    2: {id: 2, texto: 'Ir à feira'} 
  }
*/
let id = 0
const lembretes = {}
const funcoes = {
  LembreteClassificado: (lembrete) => {
    //eu faço esse: atualizar a base local
    lembretes[lembrete.id] = lembrete
    //emitir um evento de tipo ObservacaoAtualizada e cujo payload seja a propria observacao
    axios.post('http://localhost:10000/eventos', {
      type: 'LembreteAtualizado',
      payload: lembrete
    })
  }

}
//definindo um endpoint que permite que lembretes sejam cadastrados
//POST /lembretes (req, res) => {}
app.post('/lembretes', async function(req, res){
  id++
  const texto = req.body.texto
  // const lembrete = { id: id, texto: texto}
  const lembrete = { id, texto, status: 'aguardando' }
  lembretes[id] = lembrete
  await axios.post('http://localhost:10000/eventos', {
    type: 'LembreteCriado',
    payload: lembrete
  })
  res.status(201).json(lembrete)
})

//definindo um endpoint que permite que a coleção de lembretes seja obtida
//GET /lembretes (req, res) => {}
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
app.listen(port, () => console.log(`Lembretes. Porta ${port}.`))