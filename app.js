const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./system/routes/admin')
const home = require('./system/routes/home')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")

//sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//body parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//handlebars
app.set('views', path.join(__dirname, 'system/views'))
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

//mongoose
mongoose.connect('mongodb://localhost/blogapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao banco!')
}).catch(err =>
    console.log(`Erro ao conectar no banco: ${err}`))

//public
app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.use('/', home)
app.use('/admin', admin)

const port = 3000
app.listen(port, () => {
    console.log('Servidor iniciado! http://localhost:3000/')
})
