const bookModel = require("../models/bookModel");
const validator = require("validator");


const createBook = async function(req,res){
let data = req.body;
if(object.keys(data).length == 0)return res.status(400).send({status:false,msg:"Request Body Cant Be Blank"});
if(!data.title)return res.status(400).send({status:false,msg:"Please Input Title,Title Is A Mandatory Field"});
if(typeof data.title !== "string")return res.status(400).send({status:false,msg:"Please Input A Valid Title"});



}


