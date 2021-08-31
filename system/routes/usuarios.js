const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/UsuarioModel')
const {body, validationResult} = require('express-validator')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro',
    body('nome').not().isEmpty().withMessage('Favor preencher o campo nome!'),
    body('email').not().isEmpty().withMessage('Favor preencher o campo e-mail!'),
    body('senha').not().isEmpty().withMessage('Favor preencher uma senha!'),
    body('senha2').not().isEmpty().withMessage('Favor preencher a verificação de senha!'),
    (req, res) => {
        let errors = validationResult(req)

        var erros = []
        if (!errors.isEmpty()) {
            errors.array().forEach(el => erros.push({texto: el.msg}))
        }
        if (req.body.senha !== req.body.senha2) {
            erros.push({texto: 'Você digitou duas senha diferentes, digite a mesma senha nos dois campos!'})
        }

        if (erros.length > 0) {
            res.render('usuarios/registro', {erros: erros})
        } else {
            Usuario.findOne({email: req.body.email}).then((usuario) => {
                if (usuario) {
                    req.flash('error_msg', 'Já existe uma conta registrada com esse e-mail!')
                    res.redirect('/usuarios/registro')
                } else {
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                    })

                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                            if (erro) {
                                req.flash('error_msg', 'Houve um erro interno ao tentar salvar o cadastro, tente novamente!')
                                res.redirect('/usuarios/registro')
                            }
                            novoUsuario.senha = hash
                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'Cadastro realizado com sucesso!')
                                res.redirect('/')
                            })
                                .catch((err) => {
                                    req.flash('error_msg', 'Houve um erro interno ao tentar completar o cadastro, tente novamente!')
                                    res.redirect('/usuarios/registro')
                                })
                        })
                    })
                }
            })
                .catch((err) => {
                    req.flash('error_msg', 'Houve um erro interno ao tentar completar o cadastro, tente novamente!')
                    res.redirect('/usuarios/registro')
                })
        }
    })

module.exports = router
