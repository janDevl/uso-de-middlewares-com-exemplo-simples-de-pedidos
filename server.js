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

app.get('/statusPedidos/:id', (req, res) =>{
    fs.readFile('pedidos.json','utf-8',(err, data) =>{

        const pedidoRequisitado = req.params.id

        if(err){
            return res.status(500).json({
                erro: "erro ao ler o arquivo"
            })

        }

        const pedidos = JSON.parse(data)
        const pedidoEncontrado = pedidos.find(orders => orders.id === pedidoRequisitado)

        if(!pedidoEncontrado){
            return res.status(404).json({
                erro: "Nenhum pedido pendente com esse id"
            })

        }

        res.json(pedidoEncontrado)
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

app.put('/attPedido/:id', (req, res) => {
    const pedidoSelecionado = req.params.id
    const atualizacao = req.body

    if(!atualizacao){
        return res.status(500).json({
            err: "erro no recebimendo dos dados"
        })
    }

    fs.readFile('pedidos.json', 'utf-8', (err, data) => {
        if(err){
            return res.status(500).json({
                erro: "Erro ao ler o banco de dados"
            })
        }

        const pedidos = JSON.parse(data)
        const pedidoEncontrado = pedidos.findIndex(user => user.id === pedidoSelecionado)

        if(pedidoEncontrado === -1){
            return res.status(404).json({
                erro: "Pedido não existente"
            })
        }
        
        pedidos[pedidoEncontrado].tempo = atualizacao.tempo
        pedidos[pedidoEncontrado].status = atualizacao.status
        
        fs.writeFile('pedidos.json', JSON.stringify(pedidos), err => {
             if(err){
                return res.status(500).json({
                    erro: "Erro ao salvar no banco de dados"
                })
            }

            res.status(200).send('Status do pedido atualizado')
        })


    })
})
//ainda falta adicionar: DELETE, caso tenha cancelamento

app.listen(3000, () => console.log('rodando..'))