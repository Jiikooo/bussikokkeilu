/*

        http://data.foli.fi/doc/index


*/

var lineStops = [
    {number: "7", stop: 1932, time: null},
    {number: "9", stop: 1917, time: null},
    {number: "12", stop: 1923, time: null},
    {number: "61", stop: 1923, time: null}
];


var lines = [
            {line: "12", checked: false},
            {line: "61", checked: false}
        ];
var times = [];

function getData(){
    var table = document.getElementById("taulu");
    lineStops.forEach(function(line){
        console.log("Line", line.number);
        requestDataForStop(line.stop, function(result){
            //console.log(line.number, result);
            result.forEach(function(item){
                if (item.lineref == line.number && line.time == null){
                    line.time = parseTime(item.expecteddeparturetime);
                    var row = document.createElement("tr");
                    var busline = document.createElement("td");
                    busline.innerText = line.number;
                    var lineTime = document.createElement("td");
                    lineTime.innerText = line.time;
                    row.appendChild(busline);
                    row.appendChild(lineTime);
                    table.appendChild(row);
                }
            });
        });
    });
    console.log(lineStops);
}

function parseTime(unixTime){
    var departure = new Date(unixTime*1000);
    var minutes = departure.getMinutes() < 10 ? '0' + departure.getMinutes() : departure.getMinutes();
    var time = departure.getHours() +":" + minutes;
    return time;
}

function requestDataForStop(stop, callback){
    var request = new XMLHttpRequest();
    var url = 'https://data.foli.fi/siri/sm/' + stop;
    request.open('GET', url, true);

    request.onload = function(){
        if (this.status >= 200 && this.status < 400){
            var data = JSON.parse(this.response).result;
            callback(data);
        }
        else{
            console.log("fail");
        }
    };

    request.send();
}

function getData2(){
    //http://data.foli.fi/siri/sm/1923
    var request = new XMLHttpRequest();
    request.open('GET', 'http://data.foli.fi/siri/sm/1923', true);

    request.onload = function(){
        if (this.status >= 200 && this.status < 400){
            var data = JSON.parse(this.response);
            parseResult(data.result);
        }
        else{
            console.log("fail");
        }
    };

    request.send();
}

function parseResult(data){
    for (var i = 0; i < data.length; i++){
        for(var j = 0; j < lines.length; j++){
            if (lines[j].line == data[i].lineref && lines[j].checked == false){
                times.push(data[i]);
                lines[j].checked = true;
            }
        }
        if (lines.filter(line => line.checked == true).length == lines.length){
            console.log("Kaikki löytyi");
            break;
        }
    }
    parseTimes(times);
}

function parseTimes(times){
    times.forEach(function(item){
        //console.log(item);
        var departure = new Date(item.expecteddeparturetime*1000);
        var minutes = departure.getMinutes() < 10 ? '0' + departure.getMinutes() : departure.getMinutes();
        var time = departure.getHours() +":" + minutes;
        console.log(item.lineref, time);

    });
}

//getData();
