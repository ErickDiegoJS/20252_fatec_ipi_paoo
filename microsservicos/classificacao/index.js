//fazer os imports
import express from 'express'
import axios from 'axios'
const app = express()
//aplicar eventuais middlewares
app.use(express.json())
const palavraChave = 'importante'
const funcoes = {
  ObservacaoCriada: (observacao) => {
    //trocar o status da observação. se contiver a palavra importante, o status fica sendo importante, caso contrario, fica sendo comum
    if(observacao.texto.includes(palavraChave))
      observacao.status = 'importante'
    else
      observacao.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: observacao
    })
  },

  LembreteCriado: (lembrete) => {
    if(lembrete.texto.includes(palavraChave))
      lembrete.status = 'importante'
    else
      lembrete.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'LembreteClassificado',
      payload: lembrete
    })
  }
}

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){}
  res.end()
})

//colocar o mss para funcionar na porta 7000
const port = 7000
app.listen(port, async () => {
  console.log(`Classificação. Porta ${port}.`)
  const res = await axios.get('http://localhost:10000/eventos')
  for(let evento of res.data){
    try{
      funcoes[evento.type](evento.payload)
    }
    catch(e){}
  }
})
