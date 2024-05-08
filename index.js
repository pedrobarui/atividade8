// atualizar buscando pelo nome.

const express = require('express')
const router = express.Router()

// criando banco de dados local
// criando cada pessoa como objeto e atributos
const listaPessoas = [{
    nome: "Pedro",
    idade: 19,
    email: "phneves2005@gmail.com",
    telefone: "61982792126"
}, {
    nome: "Adilson",
    idade: 49,
    email: "adilsonneves2008@gmail.com",
    telefone: "61984176119"
}
]

// criando intermediari/middlewoare para validação (validando se existe)
function validarPessoa(req, res, next) {
    const nome = req.params.nome
    // pegando o nome da pessoa
    const pessoa = listaPessoas.find(pessoa => pessoa.nome == nome)
    // pegando a posição no array
    const index = listaPessoas.findIndex(pessoa => pessoa.nome == nome)
    // fazendo validação pelo nome, caso exista, continua e imprime o objeto pessoa, se não, retorna erro 404.
    if (pessoa) {
        req.pessoa = pessoa
        req.index = index
        return next()
    }
    return res.status(404).json({ mensagem: "pessoa não encontrado" })
}

// criando outro intermediario/middlewoare para validar atributos
function validarAtributos(req, res, next) {
    const dadosPessoa = req.body
    // validando se foi enviado todos os dados da pessoa, se não tiver, apresenta erro 400
    // se receber todos os dados, continua com next()
    if (!dadosPessoa.nome || !dadosPessoa.idade || !dadosPessoa.email || !dadosPessoa.telefone) {
        return res.status(400).json({ mensagem: "Nome, idade, email e telefone são obrigatórios" })
    }
    next()
}


// BUSCANDO TODAS AS PESSOAS (READ)
router.get('/pessoas', (req, res) => {
    res.json(listaPessoas)
})

// PELO nome => READ (com validação)
router.get('/pessoas/:nome', validarPessoa, (req, res) => {
    const nome = req.params.nome
    return res.json(req.pessoa)
})

// CRIANDO NOVA PESSOA => CREATE (com validação)
router.post('/pessoas', validarAtributos, (req, res) => {
    const dadosPessoa = req.body
    // armazenando os dados da nova pessoa em uma variável
    const novaPessoa = {
        nome: dadosPessoa.nome,
        idade: dadosPessoa.idade,
        email: dadosPessoa.email,
        telefone: dadosPessoa.telefone
    }
    // incluindo pessoa na listaPessoas
    listaPessoas.push(novaPessoa)
    res.json({
        mensagem: "pessoa criada"
    })
})

// UPDATE => ATUALIZANDO DADOS DE UMA PESSOA (com validação)
router.put('/pessoas/:nome', validarPessoa, (req, res) => {
    const nome = req.params.nome
    const novosDados = req.body
    // buscando os dados atualizados 
    const index = listaPessoas.findIndex(pessoa => pessoa.nome == nome)
    // validação para ver se o nome recebido é existente
    if (index == -1) {
        return res.status(404).json({ mensagem: "pessoa não encontrata!" })
    }

    const dadosAtualizados = {
        nome: novosDados.nome,
        idade: novosDados.idade,
        email: novosDados.email,
        telefone: novosDados.telefone
    }
    // atualizando os dados novos na listaPessoas (usando a variável declarada index)
    listaPessoas[index] = dadosAtualizados
    res.json({
        mensagem: "dados alterados com sucesso"
    }
    )
})

// DELETANDO PESSOA (com validação)
router.delete('/pessoas/:nome', validarPessoa, (req, res) => {
    listaPessoas.splice(res.index, 1)
    res.json({ mensagem: "pessoa excluida com sucesso" })
})

module.exports = router