if (process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: 'mongodb+srv://joaogomes:superadmin@blog.fbbvt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}
