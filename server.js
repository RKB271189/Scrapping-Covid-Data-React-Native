const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();


const url = "https://www.worldometers.info/coronavirus/";

app.get('/',(req,res)=>{
    res.send("Covid Count Started");
});
app.post('/covid-count', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let data = {
        result: false,
        details: '',
        error: ''
    }
    axios.get(url).then(async function (response) {
        await getHtmlData(response.data).then(function (results) {
            if (typeof results == String) {
                if (results.includes("Error")) {
                    data.error = results;
                    res.json(data);
                }
            }
            data.result = true;
            data.details = results;
            res.json(data);
        }).catch(function (error) {
            data.error = error;
            res.json(data);
        });
    }).catch(function (error) {
        console.log(error);
    });
});
function getHtmlData(html) {
    return new Promise(function (resolve, reject) {
        let fulltable = [];
        const $ = cheerio.load(html);
        $('table.table tr').each((i, elem) => {
            let temp = $(elem).find('td');
            if (temp.length > 1) {
                if (i > 0) {
                    let country = 'NA';
                    if (temp[0].childNodes.length > 0) {
                        country = temp[0].lastChild.data;
                        if (typeof country === 'undefined') {
                            country = temp[0].lastChild.lastChild.data;
                        }
                    }
                    let totalcases = 'NA';
                    if (temp[1].childNodes.length > 0) {
                        totalcases = temp[1].lastChild.data;
                        if (typeof totalcases == 'undefined' || totalcases == "") {
                            totalcases = 'NA';
                        }
                    }
                    let newcases = 'NA';
                    if (temp[2].childNodes.length > 0) {
                        newcases = temp[2].lastChild.data;
                        if (typeof newcases == 'undefined' || newcases == "") {
                            newcases = 'NA';
                        }
                    }
                    let totaldeaths = 'NA';
                    if (temp[3].childNodes.length > 0) {
                        totaldeaths = temp[3].lastChild.data;
                        if (typeof totaldeaths == 'undefined' || totaldeaths == "") {
                            totaldeaths = 'NA';
                        }
                    }
                    let newdeaths = 'NA';
                    if (temp[4].childNodes.length > 0) {
                        newdeaths = temp[4].lastChild.data;
                        if (typeof newdeaths == 'undefined' || newdeaths == "") {
                            newdeaths = 'NA';
                        }
                    }
                    let recovered = 'NA';
                    if (temp[5].childNodes.length > 0) {
                        recovered = temp[5].lastChild.data;
                        if (typeof recovered == 'undefined' || recovered == "") {
                            recovered = 'NA';
                        }
                    }
                    let rows = {
                        country: country,
                        totalcases: totalcases,
                        newcases: newcases,
                        totaldeaths: totaldeaths,
                        newdeaths: newdeaths,
                        recovered: recovered
                    }
                    fulltable.push(rows);
                }
            }
        });
        resolve(fulltable);
    }).catch(function (error) {
        return "Error :" + error;

    });
}
const port = process.env.PORT || 80;
const server = app.listen(port, function () {
    console.log('COVID-19 server count started ' + port);
});
