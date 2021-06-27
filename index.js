const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const messageBird = require('messagebird')('wUtufp2VmU3vOEViRUvvkBG0k')

var app = express()
app.engine('handlebars',exphbs({defaultLayout:'main'}))
app.set('view engine','handlebars')
app.use(bodyParser.urlencoded({extended : true}))

app.get('/',(req,res)=>{
    res.render('views/step1')
})

app.post('/step2',(req,res)=>{
    var number = req.body.number;
    messageBird.verify.create(number,{
        template : 'Your verification code is %token.'
    },function(err,response){
        if(err){
            console.log(err);
            res.render('step1',{
                error:err.errors[0].description
            })
        }else{
            console.log(response)
            res.render('step2',{
                id:response.id
            })
        }
    })
})
app.post('/step3',(req,res)=>{
    var id = req.body.id
    var token = req.body.token

    messageBird.verify.verify(id,token,(err,response)=>{
        if(err){
            res.render('step2',{
                error:err.errors[0].description,
                id:id
            })
        }else{
            res.render('step3')
        }
    })
})
app.listen(3000)