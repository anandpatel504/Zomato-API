const express = require("express");
const zomato = require("zomato");
const app = express();
const ejs = require('ejs')
const bodyParser = require("body-parser");
app.use(express.static(__dirname + '/views'));

app.use(bodyParser.urlencoded({ extended: true}));

const client = zomato.createClient({userKey: '176bd0663551ddcc4cea2fcb9dc809bf'})

app.set('view engine', 'ejs')
// getLocations and geocode

app.get("/search_data", (req, res) =>{
    res.sendFile(__dirname + '/views/search.html');
})

app.post("/locations", (req, res)=>{
    let name = req.body.search;
    // console.log(name);
    client.getLocations({query: name,}, (err, result) =>{
        if(!err){
            let main_data = JSON.parse(result).location_suggestions;

            let latitude = JSON.stringify (main_data[0].latitude);
            let longitude = JSON.stringify (main_data[0].longitude);
            // console.log(lat);
            // console.log(lon);
            client.getGeocode({lat:latitude, lon:longitude},(err, result)=>{
                if(!err){
                    // console.log(result);
                    // res.send(result);
                    let data = JSON.parse(result).nearby_restaurants; 
                    let data_list = [];
                    for(var i of data){
                        var Dict = {
                            name: i.restaurant.name,
                            address: i.restaurant.location.address,
                            average_cost_for_two: i.restaurant.average_cost_for_two,
                            price_range: i.restaurant.price_range,
                            has_online_delivery: i.restaurant.has_online_delivery,
                            cuisines: i.restaurant.cuisines,
                            featured_image: i.restaurant.featured_image
                        }
                        data_list.push(Dict);
                    }
                    // console.log(data_list);
                    res.render('zomato.ejs', {data: data_list})
                }else{
                    console.log(err);
                }
            })
        }else{
            console.log(err);
        }
    })
});


app.listen(3031);
console.log("success.....")