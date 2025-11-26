import express from 'express'
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(express.json())

const logs = []

app.get('/logs', (req, res) => {
	//devolver a base consolidada como um json
	res.json(logs)
})

app.post('/eventos', (req, res) => {
	try {
		//pegar o evento do corpo da requisição e fazer esse ponteiro apontar para ele
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
app.listen(port, () => {
	console.log(`Logs. Porta ${port}.`)
})


