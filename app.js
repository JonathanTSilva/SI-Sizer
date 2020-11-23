const createError = require('http-errors');
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
require("./config/auth")(passport);
const fs = require('fs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usuario');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//Handlebars  
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine','handlebars')
//EJS
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Public
app.use(express.static(path.join(__dirname, 'public')));

//Sessão:
app.use(session({
  secret: "sizer",
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Middleware
app.use(function(req,res,next){
  //Criar variáveis globais:
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null; //variavel user vai armazenar dados do usuario logado
  next()
})
//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dbProjX",{
    useNewUrlParser: true
}).then(() => {
    console.log("Conectado ao MongoDB com sucesso!");
}).catch((err) => {
    console.log("Erro ao se conectar: " + err);
})

app.use('/', indexRouter);
app.use('/usuario', usersRouter);
app.get('/relatoriofinal', function (req, res) {
  var filePath = "/public/files/relat.pdf";

  fs.readFile(__dirname + filePath , function (err,data){
      res.contentType("application/pdf");
      res.send(data);
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;