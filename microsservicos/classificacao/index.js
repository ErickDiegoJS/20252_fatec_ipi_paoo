import express from 'express'
import axios from 'axios'
import { GoogleGenAI } from "@google/genai";
const app = express()
app.use(express.json())
const ai = new GoogleGenAI({})

async function importante(texto) {
  const prompt = `
    Você deverá classificar um texto (lembrete ou observação) como "comum" ou "importante".
    RESPONDA SOMENTE com "comum" ou "importante".

    Texto: ${texto}
  `

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    })

    return response.text.includes("importante")
  } catch (e) {
    return true
  }
}

const funcoes = {
  ObservacaoCriada: (observacao) => {
    if (importante(observacao.texto))
      observacao.status = 'importante'
    else
      observacao.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: observacao
    })
  },

  LembreteCriado: (lembrete) => {
    if (importante(lembrete.texto))
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
  try {
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch (e) { }
  res.end()
})

const port = 7000
app.listen(port, async () => {
  console.log(`Classificação. Porta ${port}.`)
  const resp = await axios.get('http://localhost:10000/eventos')
  for (let i in resp.data) {
    const evento = resp.data[i]
    try {
      funcoes[evento.type](evento.payload)
    } catch(e) {}
  } 

  await axios.post('http://localhost:10000/registrar', {
    nome: "classificacao",
    interesses: ["ObservacaoCriada", "LembreteCriado"],
    porta: port
  })
  console.log(`Interesses registrados no barramento.`)
})