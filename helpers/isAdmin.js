module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.ehAdmin == 1) {
            return next();
        }

        req.flash('error_msg', 'Você não tem permissões para entrar aqui')
        res.redirect('/')
    }
}
