import express from 'express'
const { v4: uuidv4 } = require('uuid');
const app = express()
const axios = require('axios')
app.use(express.json())

const estatistica = {}

app.get('/estatistica', (req, res) => {
	//devolver a base consolidada como um json
	res.json(logs)
})

app.post('/eventos', async (req, res) => {
	try {
		const lembretes = await axios.get('http://localhost:6000/lembretes').data

		const total_lembretes = lembretes.length
		const total_lembretes_importantes = lembretes.filter(lembrete => lembrete.status === "importante").length
		const total_lembretes_comuns = total_lembretes - total_lembretes_importantes

		let total_observacoes = 0
		let total_caracteres_observacoes = 0
		
		for (const lembrete of lembretes) {
			const observacoes = lembrete.observacoes || []
			total_observacoes += observacoes.length

			for (const observacao of observacoes) {
				total_caracteres_observacoes += observacao.texto.length		
			}
		}

		const media_caracteres_observacao =  total_caracteres_observacoes / total_observacoes

		estatistica.total_lembretes = total_lembretes
		estatistica.total_lembretes_importantes = total_lembretes_importantes
		estatistica.total_lembretes_comuns = total_lembretes_comuns
		estatistica.total_observacoes = total_observacoes
		estatistica.media_caracteres_observacao = media_caracteres_observacao
	} catch (e) { }
	res.end()
})

const port = 9000
app.listen(port, () => {
	console.log(`Estatística. Porta ${port}.`)
})


