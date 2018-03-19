var express = require('express');
var bodyParser = require('body-parser');
var server = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost:27017/weather_test');

var MyTempModel = mongoose.model('temperature', new Schema({
     "lat": mongoose.Schema.Types.Number, 
     "long": mongoose.Schema.Types.Number, 
     "temp": mongoose.Schema.Types.String 
    }, 
    {"collection": "temperature"}
));
server.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
server.use(bodyParser.json())

server.listen(3000, () => {
    console.log("server started and is listening on port 3000");
});

server.get("/", (request, response) => {
    response.status(200).send("Server Ready");
});

server.post("/getWeather", (request, response) => {

    var latitude = request.body.lat;
    var longitude = request.body.long;

    if (latitude == null || longitude == null) {
        response.status(400).send("Please Enter the Lat and long")
    }
    else {
        var searchCondition = {
            "lat": latitude,
            "long": longitude
        };

        MyTempModel.findOne(searchCondition, (error, result) => {
            if (error) {
                response.status(400).send("Some error occured");
            }
            else if (result == null) {
                response.status(404).send("Not Found");
            }
            else {
                response.status(200).send({
                    "temp": result.temp
                });
            }
        });
    }

});


