import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config";

const app= express();
const port = process.env.PORT || 3000;
// const localurl = 'mongodb://127.0.0.1:27017/code'; 

const uri= process.env.uri;
mongoose.set('strictQuery',false);

const connectDB = async()=>{
    try{
        const conn = mongoose.connect(uri);
    }catch(error)
    {
        console.log(error);
        process.exit(1);
    }
}



app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const dataSchema =new mongoose.Schema({
    value:{
        type : String,
        required : true
    }
})

const Data = mongoose.model('Data',dataSchema);

let theme ='default';
let savedata="";
let themeStyle ="light";

app.get('/',(req,res)=>{
    let data=`   Welcome!
   
   Click on New to start writing a new text.
   When you are done click on Save to save it.
   
   Once saved you can share the link to view the text anytime.
   The highlighing will appear once the code is saved.
   
   Choose a theme using the dropdown and Submit to change the theme.
   There are several light as well as dark themes.

   Created by neo.`;
    res.render('index.ejs',{code:data,language:'plaintext',id:'home',theme:theme,themeStyle:themeStyle});
})

app.get('/new',(req,res)=>{
    res.render('new.ejs',{id:'new',theme:theme,code:'',themeStyle:themeStyle});
    console.log(theme);
})

app.post('/save',async (req,res)=>{
    
    savedata="";
    //console.log(req.body);
    const userData= req.body.userdata;
    try{
        const data = await Data.create({value:userData});
        res.redirect(`/${data.id}`);
       // console.log(data.id);
    }catch(error){
        res.render('new.ejs',{code:userData,id:'new',theme:theme,themeStyle:themeStyle});
    }
   // console.log(userData);

})

app.get('/:id',async (req,res)=>{
    const id =req.params.id;

    try{
        const data = await Data.findById(id);
        res.render('index.ejs',{code:data.value,id:id,theme:theme,themeStyle:themeStyle});
    }catch(error){
        res.redirect('/');
    }

})


app.post('/theme',(req,res)=>{
    theme = req.body.themeSelect.split(" ")[0];
    themeStyle = req.body.themeSelect.split(" ")[1];
    const id=req.body.id;
    savedata =req.body.userdata;
    // console.log(req.body);
    // console.log(theme+" and "+id);
    if(id==='home'){
        res.redirect('/');
    }else if(id==='new'){
        res.render('new.ejs',{id:'new',theme:theme,code:savedata,themeStyle:themeStyle});
    }else{
        res.redirect(`/${id}`);
    }
   // console.log(themeStyle);
})

connectDB().then(()=>
    app.listen(port,()=>{
    console.log(`Server running on ${port}`);
}));
