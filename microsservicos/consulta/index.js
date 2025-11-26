const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const baseConsolidada = {}

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes']
    const indice = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao
  },
  LembreteAtualizado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
  }
}

app.get('/lembretes', (req, res) => {
  res.json(baseConsolidada)  
})

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    const { type, payload } = evento
    funcoes[type](payload)
  }
  catch(e){}
  res.end()
})

const port = 6000
app.listen(port, async () => { 
  console.log (`Consulta. Porta ${port}.`)
  const resp = await axios.get('http://localhost:10000/eventos')
  for (let i in resp.data) {
    const evento = resp.data[i]
    try {
      funcoes[evento.type](evento.payload)
    } catch(e) {}
  } 

  await axios.post('http://localhost:10000/registrar', {
    nome: "consulta",
    interesses: ["ObservacaoCriada", "LembreteCriado", "ObservacaoAtualizada", "LembreteAtualizado"],
    porta: port
  })
  console.log(`Interesses registrados no barramento.`)
})