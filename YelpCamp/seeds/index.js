
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb+srv://rom512:rGRjB4UybW3J4uEU@learncluster.1gyk8th.mongodb.net/yelp-camp?appName=LearnCluster');

const db = mongoose.connection;
db.on("error",console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});


// picking random element from array:\
// array[Math.floor(Math.random()*array.length)]

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const camp = new Campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`      
        })
        await camp.save();
    }
    // const c = new Campground({title: 'purple field'});
    // await c.save();
}

seedDB().then(()=>{
    mongoose.connection.close();
})