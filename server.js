const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const express = require('express');
const app = express();
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Static Files
app.use(express.static(path.join(__dirname, '/public')));

//Routes
app.use('/', require('./routes/root'));
app.use('/employees', require('./routes/api/employees'));


app.all('*', (req, res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    } else {
        res.type('txt').send({error: "404 Not Found"})
    }
});

app.use(errorHandler);

app.listen(PORT, ()=>console.log(`Server działa na porcie ${PORT}`));