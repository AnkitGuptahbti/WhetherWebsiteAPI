const http = require('http')
const fs = require('fs')
var requests = require('requests')
const homeFile = fs.readFileSync('Home.html', 'utf-8')
const replaceVal=(tempVal,orgVal)=>{  parseFloat(orgVal.main.temp_max-273.15).toFixed(2)
      let temperature=tempVal.replace('{%tempval%}',parseFloat(orgVal.main.temp-273.15).toFixed(2))  
        temperature=temperature.replace('{%tempmin%}',parseFloat(orgVal.main.temp_min-273.15).toFixed(2))
   temperature=temperature.replace('{%tempmax%}',parseFloat(orgVal.main.temp_max-273.15).toFixed(2))
   temperature=temperature.replace('{%location%}',orgVal.name)
   temperature=temperature.replace('{%country%}',orgVal.sys.country)
   temperature=temperature.replace('{%tempstatus%}',orgVal.weather[0].main)
   return temperature;
  
}

const server=http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=kanpur%20%20&appid=604462cbdd8472de223bad5c5edff1f9')
            .on('data',(chunk)=> {
                const objdata=JSON.parse(chunk)
                
                const arrData=[objdata]

                //  console.log(arrData)
                //  console.log(arrData[0].main.temp-273.15+"hello")
                const realTimeData=arrData.map((val)=>  replaceVal(homeFile,val)).join("");
                //   console.log(val.main);//{ 
                //     temp: 299.39,
                //   feels_like: 299.39,
                //   temp_min: 299.39,
                //   temp_max: 299.39,
                //   pressure: 1000,
                //   humidity: 84,
                //   sea_level: 1000,
                //   grnd_level: 984 }
                   
                   
               // });
               res.write(realTimeData)
               
                //console.log(realTimeData);


                // console.log(chunk)
            })

            .on('end', (err)=> {
                if (err) return console.log('connection closed due to errors', err);

                      //console.log('end');
                      res.end()
            })
    }
})
server.listen(9999,'127.0.0.1');

