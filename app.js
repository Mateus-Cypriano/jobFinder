const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const PORT = 3000;

app.listen(PORT, function() {
    console.log(`O express está rodando na porta ${PORT}`);
});

//body parser
app.use(bodyParser.urlencoded({extended: false}));

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine({defaultlayout:'main'})); //o código da aula estava errado, para utilizar tive que procurar um meio e achei esse utilizando o .engine para utilizar o handlebars no engine. 
app.set('view engine', 'handlebars');

// static folders
app.use(express.static(path.join(__dirname, 'public')));

//db connection
db
    .authenticate()
    .then(() => {
        console.log("conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("ocorreu um erro ao conectar", err);
    });

//routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%'; 

    if(!search) {
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs
            });
        })
        .catch(err => console.log(err));
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
    
            res.render('index', {
                jobs, search
            });
        })
        .catch(err => console.log(err));
    }

});

//jobs routes
app.use('/jobs', require('./routes/jobs'));



