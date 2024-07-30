var mongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;

mongoClient.connect("mongodb://localhost", { useNewUrlParser: true })
            .then(conn => global.conn = conn.db("dbProjX"))
            .catch(err => console.log(err))
			

//Partidas
function listPartidas(callback){  
    global.conn.collection("tbPartidas").find({}).toArray(callback);
}

function findPartida(id, callback){  
    global.conn.collection("tbPartidas").find(new ObjectId(id)).toArray(callback);
}

function queryPartidas(dados, callback){
    var txtQuery = '{ ';
    
    if (typeof dados.tensao !== undefined && dados.tensao)
    txtQuery += '"V" : ' + dados.tensao + ',';
    
    if (typeof dados.icu !== undefined && dados.icu)
    txtQuery += '"kA" : { "$gte" :' + dados.icu + '},';
    
    if (typeof dados.cv !== undefined && dados.cv)
    txtQuery += '"cv" : ' + dados.cv + ',';
    
    if (typeof dados.tipo !== undefined && dados.tipo)
    txtQuery += '"Tipo" : "' + dados.tipo + '",';
    
    if (typeof dados.modo !== undefined && dados.modo)
    txtQuery += '"Modo" : "' + dados.modo + '",';
    
    if (typeof dados.classe !== undefined && dados.classe)
    txtQuery += '"Classe" : "' + dados.classe + '",';
    
    if(txtQuery.endsWith(',')){
    txtQuery = txtQuery.substring(0, txtQuery.length - 1);
    }
    
    txtQuery += ' }';
    
    var jsonQuery = JSON.parse(txtQuery);
    
    global.conn.collection("tbPartidas").find(jsonQuery).toArray(callback);
}

//Escolhas
function findEscolha(id, callback){  
    global.conn.collection("tbEscolhas").find(new ObjectId(id)).toArray(callback);
}

function listEscolhas(callback){  
    global.conn.collection("tbEscolhas").find({}).toArray(callback);
}

function insertEscolha(dados, callback){
    global.conn.collection("tbEscolhas").insertOne(dados, callback);
}

function updateEscolha(id, produto, callback){
    global.conn.collection("tbEscolhas").updateOne({_id:new ObjectId(id)}, produto, callback);
}

function deleteEscolha(id, callback){
    global.conn.collection("tbEscolhas").deleteOne({_id: new ObjectId(id)}, callback);
}

function deleteAll(callback){
    global.conn.collection("tbEscolhas").remove({}, callback);
}

//Materiais
function listMateriais(escolha, callback){
    var ID = escolha.ID;
    var qtde = escolha.qtde
	var query = { ID : ID };
	
	console.log(query);
	
    global.conn.collection("tbMateriais").find(query).toArray(callback);
}

//update({},{ $set: {"QTDE": qtde} },false,true)
//Lista De Materiais
function addQTDE(){
    global.conn.collection("tbEscolhas").find().forEach(escolha => {
        var qtde = escolha.qtde;
        global.conn.collection("tbListaDeMateriais").find().forEach(material => {
            global.conn.collection("tbListaDeMateriais").updateOne(material, {$set: {QTDE: qtde}})
        })
    })
}

//update({}, {$set: {"QTDE": qtde}},false,true)
function listListaDeMateriais(callback){  
    global.conn.collection("tbListaDeMateriais").find({}).toArray(callback);
}

function insertMaterial(itens, escolha, callback){
    var qtde = escolha.qtde;
    global.conn.collection("tbListaDeMateriais").insertOne(itens, callback);
    global.conn.collection("tbListaDeMateriais").updateOne(itens, {$set: {QTDE: qtde}})

}

/*function somaMaterial(itens, callback){
    var count_cod1 = 0;
    var count_cod2 = 0;
    var count_cod3 = 0;
    var count_cod4 = 0;
    var count_cod5 = 0;
    var count_cod6 = 0;
    var count_cod7 = 0;
    var count_cod8 = 0;
    var count_cod9 = 0;
    var count_cod10 = 0;

    global.conn.collection("tbListaDeMateriais").find().forEach((itens_1) => {
        var cod1_1 = itens_1.cod1;
        var cod2_1 = itens_1.cod2;
        var cod3_1 = itens_1.cod3;
        var cod4_1 = itens_1.cod4;
        var cod5_1 = itens_1.cod5;
        var cod6_1 = itens_1.cod6;
        var cod7_1 = itens_1.cod7;
        var cod8_1 = itens_1.cod8;
        var cod9_1 = itens_1.cod9;
        var cod10_1 = itens_1.cod10;
        global.conn.collection("tbListaDeMateriais").find().forEach((itens_2) => {
            var cod1_2 = itens_2.cod1;
            var cod2_2 = itens_2.cod2;
            var cod3_2 = itens_2.cod3;
            var cod4_2 = itens_2.cod4;
            var cod5_2 = itens_2.cod5;
            var cod6_2 = itens_2.cod6;
            var cod7_2 = itens_2.cod7;
            var cod8_2 = itens_2.cod8;
            var cod9_2 = itens_2.cod9;
            var cod10_2 = itens_2.cod10;
            
            if(cod1_2.localeCompare(cod1_1)) count_cod1++;
            if(cod1_2.localeCompare(cod2_1)) count_cod1++;
            if(cod1_2.localeCompare(cod3_1)) count_cod1++;
            if(cod1_2.localeCompare(cod4_1)) count_cod1++;
            if(cod1_2.localeCompare(cod5_1)) count_cod1++;
            if(cod1_2.localeCompare(cod6_1)) count_cod1++;
            if(cod1_2.localeCompare(cod7_1)) count_cod1++;
            if(cod1_2.localeCompare(cod8_1)) count_cod1++;
            if(cod1_2.localeCompare(cod9_1)) count_cod1++;
            if(cod1_2.localeCompare(cod10_1)) count_cod1++;

            if(cod2_2.localeCompare(cod1_1)) count_cod2++;
            if(cod2_2.localeCompare(cod2_1)) count_cod2++;
            if(cod2_2.localeCompare(cod3_1)) count_cod2++;
            if(cod2_2.localeCompare(cod4_1)) count_cod2++;
            if(cod2_2.localeCompare(cod5_1)) count_cod2++;
            if(cod2_2.localeCompare(cod6_1)) count_cod2++;
            if(cod2_2.localeCompare(cod7_1)) count_cod2++;
            if(cod2_2.localeCompare(cod8_1)) count_cod2++;
            if(cod2_2.localeCompare(cod9_1)) count_cod2++;
            if(cod2_2.localeCompare(cod10_1)) count_cod2++;

            if(cod3_2.localeCompare(cod1_1)) count_cod3++;
            if(cod3_2.localeCompare(cod2_1)) count_cod3++;
            if(cod3_2.localeCompare(cod3_1)) count_cod3++;
            if(cod3_2.localeCompare(cod4_1)) count_cod3++;
            if(cod3_2.localeCompare(cod5_1)) count_cod3++;
            if(cod3_2.localeCompare(cod6_1)) count_cod3++;
            if(cod3_2.localeCompare(cod7_1)) count_cod3++;
            if(cod3_2.localeCompare(cod8_1)) count_cod3++;
            if(cod3_2.localeCompare(cod9_1)) count_cod3++;
            if(cod3_2.localeCompare(cod10_1)) count_cod3++;

            if(cod4_2.localeCompare(cod1_1)) count_cod4++;
            if(cod4_2.localeCompare(cod2_1)) count_cod4++;
            if(cod4_2.localeCompare(cod3_1)) count_cod4++;
            if(cod4_2.localeCompare(cod4_1)) count_cod4++;
            if(cod4_2.localeCompare(cod5_1)) count_cod4++;
            if(cod4_2.localeCompare(cod6_1)) count_cod4++;
            if(cod4_2.localeCompare(cod7_1)) count_cod4++;
            if(cod4_2.localeCompare(cod8_1)) count_cod4++;
            if(cod4_2.localeCompare(cod9_1)) count_cod4++;
            if(cod4_2.localeCompare(cod10_1)) count_cod4++;

            if(cod5_2.localeCompare(cod1_1)) count_cod5++;
            if(cod5_2.localeCompare(cod2_1)) count_cod5++;
            if(cod5_2.localeCompare(cod3_1)) count_cod5++;
            if(cod5_2.localeCompare(cod4_1)) count_cod5++;
            if(cod5_2.localeCompare(cod5_1)) count_cod5++;
            if(cod5_2.localeCompare(cod6_1)) count_cod5++;
            if(cod5_2.localeCompare(cod7_1)) count_cod5++;
            if(cod5_2.localeCompare(cod8_1)) count_cod5++;
            if(cod5_2.localeCompare(cod9_1)) count_cod5++;
            if(cod5_2.localeCompare(cod10_1)) count_cod5++;

            if(cod6_2.localeCompare(cod1_1)) count_cod6++;
            if(cod6_2.localeCompare(cod2_1)) count_cod6++;
            if(cod6_2.localeCompare(cod3_1)) count_cod6++;
            if(cod6_2.localeCompare(cod4_1)) count_cod6++;
            if(cod6_2.localeCompare(cod5_1)) count_cod6++;
            if(cod6_2.localeCompare(cod6_1)) count_cod6++;
            if(cod6_2.localeCompare(cod7_1)) count_cod6++;
            if(cod6_2.localeCompare(cod8_1)) count_cod6++;
            if(cod6_2.localeCompare(cod9_1)) count_cod6++;
            if(cod6_2.localeCompare(cod10_1)) count_cod6++;
            
            if(cod7_2.localeCompare(cod1_1)) count_cod7++;
            if(cod7_2.localeCompare(cod2_1)) count_cod7++;
            if(cod7_2.localeCompare(cod3_1)) count_cod7++;
            if(cod7_2.localeCompare(cod4_1)) count_cod7++;
            if(cod7_2.localeCompare(cod5_1)) count_cod7++;
            if(cod7_2.localeCompare(cod6_1)) count_cod7++;
            if(cod7_2.localeCompare(cod7_1)) count_cod7++;
            if(cod7_2.localeCompare(cod8_1)) count_cod7++;
            if(cod7_2.localeCompare(cod9_1)) count_cod7++;
            if(cod7_2.localeCompare(cod10_1)) count_cod7++;

            if(cod8_2.localeCompare(cod1_1)) count_cod8++;
            if(cod8_2.localeCompare(cod2_1)) count_cod8++;
            if(cod8_2.localeCompare(cod3_1)) count_cod8++;
            if(cod8_2.localeCompare(cod4_1)) count_cod8++;
            if(cod8_2.localeCompare(cod5_1)) count_cod8++;
            if(cod8_2.localeCompare(cod6_1)) count_cod8++;
            if(cod8_2.localeCompare(cod7_1)) count_cod8++;
            if(cod8_2.localeCompare(cod8_1)) count_cod8++;
            if(cod8_2.localeCompare(cod9_1)) count_cod8++;
            if(cod8_2.localeCompare(cod10_1)) count_cod8++;

            if(cod9_2.localeCompare(cod1_1)) count_cod9++;
            if(cod9_2.localeCompare(cod2_1)) count_cod9++;
            if(cod9_2.localeCompare(cod3_1)) count_cod9++;
            if(cod9_2.localeCompare(cod4_1)) count_cod9++;
            if(cod9_2.localeCompare(cod5_1)) count_cod9++;
            if(cod9_2.localeCompare(cod6_1)) count_cod9++;
            if(cod9_2.localeCompare(cod7_1)) count_cod9++;
            if(cod9_2.localeCompare(cod8_1)) count_cod9++;
            if(cod9_2.localeCompare(cod9_1)) count_cod9++;
            if(cod9_2.localeCompare(cod10_1)) count_cod9++;

            if(cod10_2.localeCompare(cod1_1)) count_cod10++;
            if(cod10_2.localeCompare(cod2_1)) count_cod10++;
            if(cod10_2.localeCompare(cod3_1)) count_cod10++;
            if(cod10_2.localeCompare(cod4_1)) count_cod10++;
            if(cod10_2.localeCompare(cod5_1)) count_cod10++;
            if(cod10_2.localeCompare(cod6_1)) count_cod10++;
            if(cod10_2.localeCompare(cod7_1)) count_cod10++;
            if(cod10_2.localeCompare(cod8_1)) count_cod10++;
            if(cod10_2.localeCompare(cod9_1)) count_cod10++;
            if(cod10_2.localeCompare(cod10_1)) count_cod10++;
        })

    })

    console.log("Quantos iguais ao código 1?  - " + cod1_1);
    console.log("Quantos iguais ao código 2?  - " + cod2_1);
    console.log("Quantos iguais ao código 3?  - " + cod3_1);
    console.log("Quantos iguais ao código 4?  - " + cod4_1);
    console.log("Quantos iguais ao código 5?  - " + cod5_1);
    console.log("Quantos iguais ao código 6?  - " + cod6_1);
    console.log("Quantos iguais ao código 7?  - " + cod7_1);
    console.log("Quantos iguais ao código 8?  - " + cod8_1);
    console.log("Quantos iguais ao código 9?  - " + cod9_1);
    console.log("Quantos iguais ao código 10?  - " + cod10_1);*/

    /*global.conn.collection("tbListaDeMateriais").aggregate(
    [
        {
        $group:
            {
            _id: { day: { $dayOfYear: "$date"}, year: { $year: "$date" } },
            totalAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
            count: { $sum: 1 }
            }
        }
    ]
    )*/


function dropListaDeMateriais(callback){
    global.conn.collection("tbListaDeMateriais").drop(callback);
}

module.exports = { listPartidas, findPartida, queryPartidas, listEscolhas, findEscolha, insertEscolha, updateEscolha, deleteEscolha, deleteAll, listMateriais, insertMaterial, addQTDE, listListaDeMateriais, dropListaDeMateriais }