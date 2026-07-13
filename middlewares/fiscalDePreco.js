const fiscalDePreco = (req, res, next) => {
    const dados = req.body

    if(req.method === 'POST' && (!dados.preco || dados.preco <= 0)){
        return res.status(400).json({
            erro: "pedido sem preço"
        })
    }

    next()
}

module.exports = fiscalDePreco