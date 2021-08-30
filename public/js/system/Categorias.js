Categorias = {

    verificaCamposEmBranco: function () {
        const formFields = $('form').serializeArray()
        let bool = true
        formFields.map(item => {
            if (item.value == '') {
                $('.erros-edit-categorias').text(`Preencha todos os campos antes de enviar!`)
                $('.erros-edit-categorias').slideDown()
                setTimeout(() => {
                    $('.erros-edit-categorias').slideUp()
                }, 5000)
                bool = false
            }
        })
        return bool
    },

    editaCampo: function (e) {
        e.preventDefault()
        if (this.verificaCamposEmBranco()) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/admin/categorias/edit',
                data: $('form').serialize(),
                success: (data) => {
                    window.location = 'http://localhost:3000/admin/categorias'
                },
            })
        }
    },
}
