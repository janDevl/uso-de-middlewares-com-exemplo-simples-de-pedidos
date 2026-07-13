const fiscalDePedido = (req, res, next) => {
    const dados = req.body;

    if(req.method === 'POST' && (!dados.lanche || !dados.bebida)){
        return res.status(400).json({ err:"Cardapio incompleto no middleware!"});
    }

    next();
};

module.exports = fiscalDePedido;