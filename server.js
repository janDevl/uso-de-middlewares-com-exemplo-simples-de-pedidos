const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const fiscalDePedido = require('./middlewares/validarPedido')
const fiscalDePreco = require('./middlewares/fiscalDePreco')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
    const horaAtual = new Date().toLocaleTimeString();

    const texto = `[${horaAtual}] 🚀 Requisição: ${req.method} feita na rota: ${req.url}\n`
    
    fs.appendFile('logs.txt', texto, 'utf-8', (err) => {
        if(err){
            return res.status(500).json({
                erro: "erro ao salvar log"
            })
        }
        
    })

    next();
});

app.get('/', (req, res) => {
    res.send('Bem vindo ao iFood2')
    
})

app.get('/pedidos', (req, res) =>{
    const filtros = req.query
    fs.readFile('pedidos.json','utf-8',(err, data) =>{
        
        if(err){
            return res.status(500).json({
                erro: "erro ao ler o arquivo"
            })
        }

        try {
            let pedidos = JSON.parse(data)
    
            if(filtros.lanche){
                pedidos = pedidos.filter((pedido) => pedido.lanche.toLowerCase() === filtros.lanche.toLowerCase())
            }
    
            res.json(pedidos)
            
        } catch (error) {
            console.log(`[ERRO CRÍTICO]: O arquivo pedidos.json está corrompido! Detalhes: ${error.message}`)
            return res.status(500).json({
                erro: "Banco de dados interno foi corrompido ou esta mal formatado"
            })
        }
    })
})

app.post('/criarPedido', fiscalDePedido, fiscalDePreco, (req, res) => {
    const order = req.body
    const pedido = {
        lanche: order.lanche,
        bebida: order.bebida,
        obs: order.obs,
        preco: order.preco,
        status: 'Em preparo',
        tempo: '40 minutos a 1h',
        id: crypto.randomUUID()
    }

    fs.readFile('pedidos.json', 'utf-8', (err, data) =>{
        if(err){
             if(err){
                return res.status(500).json({
                    erro: "erro ao ler os pedidos no banco de dados"
                })
            }
        }

        const pedidos = JSON.parse(data)

        if(!pedidos){
                return res.status(500).json({
                    erro: "erro ao ver os pedidos"
                })
        }

        pedidos.push(pedido)

        fs.writeFile('pedidos.json', JSON.stringify(pedidos), (err) => {

            if(err){
                return res.status(500).json({
                    erro: "erro ao salvar arquivo"
                })
            }   

            res.send('pedido enviado com sucesso')
        })

    })


    
})


//ainda falta adicionar: DELETE, caso tenha cancelamento

app.listen(3000, () => console.log('rodando..'))