var express = require('express');
var router = express.Router();
const {eAdmin} = require("../helpers/eAdmin") //dentro do objeto é admin, quero pegar apenas a função eAdmin
//com isso, em cada rota que quiser proteger, colocar o eAdmin antes de (req,res)
const {eUser} = require("../helpers/eUser")

router.get('/', (req,res) => {
  res.render('home.ejs', { title: 'Sizer'})
})

router.get('/sizer', eUser, function(req, res) {

  global.db.listPartidas((err1, partidas) => {
      if(err1) { return console.log(err1); }
	  
	  global.db.listEscolhas((err2, escolhas) => {
		if(err2) { return console.log(err2); }
      
		res.render('index.ejs', { title: 'Dimensionamento', partidas: partidas, escolhas: escolhas });
	  });
  });
})

router.get('/new/:id', eUser, function(req, res, next) {
  var id = req.params.id;
  
  global.db.findPartida(id, (err, partidas) => {
      if(err) { return console.log(err); }
      
	  res.render('new.ejs', { title: 'Adição de Partida', partida: partidas[0], action: '/edit/' + partidas[0]._id });
    });
});

router.get('/query', eUser, function(req, res) {
  var tensao = req.query.tensao;
  var icu = req.query.icu;
  var cv = req.query.cv;
  var tipo = req.query.coord;
  var modo = req.query.drive;
  var classe = req.query.carga;

      global.db.queryPartidas({tensao, icu, cv, tipo, modo, classe}, (err1, partidas) => {
        if(err1) { return console.log(err1); }
        global.db.listEscolhas((err2, escolhas) => {
          res.render('index.ejs', { title: 'Lista de Partidas', partidas: partidas, escolhas: escolhas});
          if(err2) { return console.log(err2);}
        });
      })
});

router.get('/edit/:id', eUser, function(req, res, next) {
  var id = req.params.id;
  
  console.log("AQUI! " + id);
  
  global.db.findEscolha(id, (err, escolhas) => {
      if(err) { return console.log(err); }
      
	  res.render('edit.ejs', { title: 'Edição de Partida', escolha: escolhas[0], action: '/edit/' + escolhas[0]._id });
    });
})

router.get('/delete/:id', eUser, function(req, res) {
  var id = req.params.id;
  
  //Apaga tabela Lista de Materiais
  global.db.dropListaDeMateriais();
  
  //Apaga item selecionado da tabela Escolhas
  global.db.deleteEscolha(id, (err, r) => {
        if(err) { return console.log(err); }
        res.redirect('/sizer');
      });
});

router.get('/deleteAll', eUser, function(req, res) {
  
  global.db.dropListaDeMateriais();
  
  //Apaga item selecionado da tabela Escolhas
  global.db.deleteAll((err, r) => {
        if(err) { return console.log(err); }
        res.redirect('/sizer');
      });
});

router.get('/materiais', eUser, function(req, res) {
  global.db.listEscolhas((err1, escolhas) => {
      if(err1) { return console.log(err1); }
	  
	  	escolhas.forEach(function(escolha){
      
			global.db.listMateriais(escolha,(err2, materiais) => {
        if(err2) { return console.log(err2); }

				//Constrói a tabela Lista de Materiais
				global.db.insertMaterial(materiais[0], escolha, (err3, result) => {
          if(err3) { return console.log(err3); }
        })

      });

    });

		global.db.listListaDeMateriais((err4, listaDeMateriais) => {
        if(err4) { return console.log(err4); }
		    res.render('materiais.ejs', { title: 'Lista de Materiais', escolhas: escolhas, lista: listaDeMateriais });
    });
	  });
});

router.get('/relatorio', eUser, function(req, res) {
  global.db.listEscolhas((err1, escolhas) => {
      if(err1) { return console.log(err1); }
	  
	  	escolhas.forEach(function(escolha){

      console.log(escolha);
      
			global.db.listMateriais(escolha,(err2, materiais) => {
        if(err2) { return console.log(err2); }

				//Constrói a tabela Lista de Materiais
				global.db.insertMaterial(materiais[0], escolha, (err3, result) => {
          if(err3) { return console.log(err3); }
          
        })
      });

		});
		global.db.listListaDeMateriais((err4, listaDeMateriais) => {
        if(err4) { return console.log(err4); }
		    res.render('relatorio.ejs', { title: 'Relatório', escolhas: escolhas, lista: listaDeMateriais });
    });
	  });
});

//POST
router.post('/new', eUser, function(req, res) {
  var ID = req.body.ID;
  var qtde = parseInt(req.body.qtde);

  var tensao = req.body.tensao;
  var icu = req.body.icu;
  var cv = req.body.cv;
  var tipo = req.body.coord;
  var modo = req.body.drive;
  var classe = req.body.carga;
  
  global.db.insertEscolha({ID, qtde, tensao, icu, cv, tipo, modo, classe}, (err, result) => {
          if(err) { return console.log(err); }
          res.redirect('/sizer');
      });
})

 router.post('/edit/:id', eUser, function(req, res) {
   var id = req.params.id;
   var ID_aux = req.body.ID;
   var qtde_aux = parseInt(req.body.qtde);
  
   var newvalues = { $set: {ID: ID_aux, qtde: qtde_aux} };
  
   global.db.updateEscolha(id, newvalues, (err, result) => {
         if(err) { return console.log(err); }
         res.redirect('/sizer');
	});
 });

module.exports = router;