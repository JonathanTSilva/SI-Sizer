const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
const Usuario = mongoose.model("Usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", (req,res) => {
    //renderiza sempre uma views
    res.render("registro.handlebars")
})

//validação do registro
router.post("/registro", (req,res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email ==null){
        erros.push({texto: "Email inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha ==null){
        erros.push({texto: "Senha inválida!"})
    }

    if(req.body.senha.length < 6){
        erros.push({texto: "Senha muito curta!"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas diferentes! Tente novamente."})
    }

    if(erros.length > 0){
        res.render("registro.handlebars", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if (usuario) {
                req.flash("error_msg","E-mail já cadastrado.")
                res.redirect("/usuario/registro")
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })

                //Encripitar a senha:
                //Salt é um valor aleatório misturado com o hash que dificulta a leitura da senha
                bcrypt.genSalt(10,(erro,salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro,hash) => {
                        if(erro){
                            req.flash("error_msg","Houve um erro durante o salvamento do usuário.")
                            res.redirect("/")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(() => {
                            req.flash("success_msg","Usuário cadastrado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg","Houve um erro ao criar o usuário. Tente novamente.")
                            res.redirect("/usuario/registro")
                        })
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg","Houve um erro interno.")
            res.redirect("/")
        })
    }
})

router.get("/login", (req,res) => {
    res.render("login.handlebars")
})

router.post("/login",(req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req,res) => {
    req.logout()
    req.flash("success_msg","Deslogado com sucesso!")
    res.redirect("/")
})

module.exports = router;