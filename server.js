const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const app = express()

app.use(express.json())

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

app.post('/criarPedido', (req, res) => {
    const order = req.body
    const pedido = {
        lanche: order.lanche,
        bebida: order.bebida,
        obs: order.obs,
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
             if(err){
                return res.status(500).json({
                    erro: "erro ao ver os pedidos"
                })
            }
        }

        pedidos.push(pedido)

        fs.writeFile('pedidos.json', JSON.stringify(pedidos), (err) => {

            if(err){
                return res.status(500).json({
                    erro: "erro ao salvar arquivo"
                })
            }   

        })

    })


    
    res.send('pedido enviado com sucesso')
})
//ainda falta adicionar: PUT, pra atualizar os status dos pedidos, DELETE, caso tenha cancelamento

app.listen(3000, () => console.log('rodando..'))