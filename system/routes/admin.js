const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/CategoriaModel')
const Categoria = mongoose.model('categorias')
require('../models/PostagemModel')
const Postagem = mongoose.model('postagens')
const {body, validationResult} = require('express-validator')
const {isAdmin} = require('../../helpers/isAdmin')

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/posts', isAdmin, (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias', isAdmin, (req, res) => {
    Categoria.find().lean().sort({nome: 'asc'}).then(categorias => {
        res.render('admin/categorias', {
            categorias: categorias,
        })
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias, tente novamente')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', isAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

router.get('/categorias/edit/:id', isAdmin, (req, res) => {
    Categoria.findById(req.params.id)
        .then(categoria => {
            res.render('admin/editcategorias', {
                nome: categoria.nome,
                slug: categoria.slug,
                id: categoria.id,
            })
        }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias, tente novamente')
        res.redirect('/admin')
    })
})

router.post('/categorias/edit', isAdmin,
    body('nome').not().isEmpty().withMessage('Favor definir um nome para categoria!'),
    body('slug').not().isEmpty().withMessage('Favor definir um slug (url) para categoria!'),
    (req, res) => {
        let errors = validationResult(req)

        var erros = []
        if (!errors.isEmpty()) {
            errors.array().forEach(el => erros.push({texto: el.msg}))
        }

        Categoria.findById(req.body.id)
            .then(categoria => {
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug

                categoria.save().then(() => {
                    req.flash('success_msg', 'Categoria editada com sucesso!')
                    res.redirect('/admin/categorias')
                }).catch((err) => {
                    if (!errors.isEmpty()) {
                        req.flash('error_msg', 'Favor preencher todos os campos antes de enviar!')
                        res.redirect(`/admin/categorias/edit/${req.body.id}`)
                    } else {
                        req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria!')
                        res.redirect('/admin/categorias')
                    }
                })
            })
    })


router.post('/categorias/nova', isAdmin,
    body('nome').not().isEmpty().withMessage('Favor definir um nome para categoria!'),
    body('slug').not().isEmpty().withMessage('Favor definir um slug (url) para categoria!'),
    (req, res) => {
        let errors = validationResult(req)

        var erros = []
        if (!errors.isEmpty()) {
            errors.array().forEach(el => erros.push({texto: el.msg}))
        }

        if (erros.length > 0) {
            res.render('/admin/addcategorias', {
                erros: erros,
            })
        }

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
        }

        new Categoria(novaCategoria)
            .save()
            .then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso')
                res.redirect('/admin/categorias')
            })
            .catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
                res.redirect('/admin/categorias')
            })
    })

router.post('/categorias/delete', isAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id})
        .then(() => {
            req.flash('success_msg', 'Categoria deletada com sucesso!')
            res.redirect('/admin/categorias')
        })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
            res.redirect('/admin/categorias')
        })
})

router.get('/postagens', isAdmin, (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).lean().then((postagens) => {
        res.render('admin/postagens', {
            postagens: postagens,
        })
    })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregas as postagens, tente novamente')
            res.redirect('/admin')
        })

})

router.get('/postagens/add', isAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagens', {categorias: categorias})
    })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar as categorias, tente novamente')
            res.redirect('/admin/postagens')
        })
})

router.post('/postagens/nova', isAdmin,
    body('titulo').not().isEmpty().withMessage('Favor definir um titulo para postagem!'),
    body('slug').not().isEmpty().withMessage('Favor definir um slug (url) para postagem!'),
    body('descricao').not().isEmpty().withMessage('Favor definir uma descrição para postagem!'),
    body('conteudo').not().isEmpty().withMessage('Favor definir um conteúdo para postagem!'),
    (req, res) => {
        let errors = validationResult(req)

        var erros = []
        if (!errors.isEmpty()) {
            errors.array().forEach(el => erros.push({texto: el.msg}))
        }
        if (Number(req.body.categoria) === 0) {
            erros.push({texto: 'Favor selecionar uma categoria válida!'})
        }
        if (erros.length > 0) {
            res.render('admin/addpostagens', {
                erros: erros,
            })
        } else {
            const novaPostagem = {
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash('success_msg', 'Postagem criada com sucesso!')
                res.redirect('/admin/postagens')
            })
                .catch((err) => {
                    req.flash('error_msg', 'Houve um erro na criação da postagem, tente novamente!')
                    res.redirect('/admin/postagens')
                })
        }
    })

router.get('/postagens/edit/:id', isAdmin, (req, res) => {
    Postagem.findById(req.params.id).lean().then(postagem => {
        Categoria.find().lean().then(categorias => {
            res.render('admin/editpostagens', {
                id: postagem._id,
                titulo: postagem.titulo,
                descricao: postagem.descricao,
                conteudo: postagem.conteudo,
                categoria: postagem.categoria,
                slug: postagem.slug,
                categorias: categorias
            })
        })
            .catch((err) => {
                req.flash('error_msg', 'Houve um erro ao carregar as categorias, tente novamente!')
                res.redirect('/admin/postagens')
            })
    })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro na criação da postagem, tente novamente!')
            res.redirect('/admin/postagens')
        })
})

router.post('/postagens/edit', isAdmin,
    body('titulo').not().isEmpty().withMessage('Favor definir um titulo para postagem!'),
    body('slug').not().isEmpty().withMessage('Favor definir um slug (url) para postagem!'),
    body('descricao').not().isEmpty().withMessage('Favor definir uma descrição para postagem!'),
    body('conteudo').not().isEmpty().withMessage('Favor definir um conteúdo para postagem!'),
    (req, res) => {
        let errors = validationResult(req)

        var erros = []
        if (!errors.isEmpty()) {
            errors.array().forEach(el => erros.push({texto: el.msg}))
        }
        if (Number(req.body.categoria) === 0) {
            erros.push({texto: 'Favor selecionar uma categoria válida!'})
        }
        if (erros.length > 0) {
            req.flash('error_msg', 'Para editar a postagem favor preencher todos os campos!')
            res.redirect(`/admin/postagens/edit/${req.body.id}`)
        } else {
            Postagem.findById(req.body.id).then((postagem) => {
                postagem.titulo = req.body.titulo
                postagem.slug = req.body.slug
                postagem.descricao = req.body.descricao
                postagem.conteudo = req.body.conteudo
                postagem.categoria = req.body.categoria

                postagem.save().then(() => {
                    req.flash('success_msg', 'Postagem editada com sucesso!')
                    res.redirect('/admin/postagens')
                })
                    .catch((err) => {
                        req.flash('error_msg', 'Houve um erro na edição da postagem, tente novamente!')
                        res.redirect('/admin/postagens')
                    })
            })
        }
    })

router.post('/postagens/delete', isAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro ao tentar deletar a postagem, tente novamente!')
            res.redirect('/admin/postagens')
        })
})

module.exports = router
