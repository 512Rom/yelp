const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');

const morgan = require('morgan');
// const campgrounds = require('./models/campgrounds');

mongoose.connect('mongodb+srv://rom512:rGRjB4UybW3J4uEU@learncluster.1gyk8th.mongodb.net/yelp-camp?appName=LearnCluster');
const app = express();

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});



app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views')) 
// __dirname ensures that the path is absolute.

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(morgan('common'));

app.get('/',(req,res)=>{
    res.render('home')
});
app.get('/campgrounds', async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', async(req,res)=>{
    res.render('campgrounds/new');
}) 

app.post('/campgrounds',async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id }`)

})
app.get('/campgrounds/:id', async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
});

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const campground = await Campground.findById (req.params.id);
    res.render('campgrounds/edit',{campground});
});
// app.get('/makecampground', async(req,res)=>{ 
//     const camp = new Campground({title:'My Backyard', description:'cheap campground'});
//     await camp.save(); // wait for mongoDB to save.
//     res.send(camp)
// });

app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.use((req,res)=>{
    res.status(404).send('NOT FOUND!');
})
app.listen(3000,()=>{
    console.log('serving on port 3000')
})    


