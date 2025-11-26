const express = require('express')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(express.json())

const logs = []

app.get('/logs', (req, res) => {
	res.json(logs)
})

app.post('/eventos', (req, res) => {
	try {
		const evento = req.body
		console.log(evento)

		const evento_log = {
			id: uuidv4(),
			data: new Date,
			tipo: evento.type,
			payload: evento.payload
		}

		logs.push(evento_log)
	}
	catch (e) { }
	res.end()
})

const port = 8000
app.listen(port, async () => {
	console.log(`Logs. Porta ${port}.`)

	await axios.post('http://localhost:10000/registrar', {
		nome: "logs",
		interesses: ['*'],
		porta: port
	})
  	console.log(`Interesses registrados no barramento.`)
})