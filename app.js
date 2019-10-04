console.log('app working properly');

var $ = require('./jquery')
var https = require('https');
var http = require('http');
const cheerio = require('cheerio');
const jsdom = require("jsdom");
var request = require('request');
const { JSDOM } = jsdom;

var url = 'http://localhost/monitor/test';

// const dom = new JSDOM(``);
//   console.log(dom.window.document.querySelector("div").textContent);



var req_url = 'http://localhost/monitor';

request({ uri: req_url }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body)

        const allLinks = $('div.story-teaser')
            .get()
            .map(repo => {
                repo = $(repo);
                const link = repo.find('a').attr('href');
                const title = repo.find('a').text();

                const data = {
                    title: title,
                    link: link,
                }
                return data;
            });

        console.log('number of Links Extracted\n =' + allLinks.length)

        // console.log(allLinks[0])

        allLinks.forEach((allLinks)=>{
            // console.log('Link:\n' + allLinks.link)
            request({ uri: allLinks.link }, function (error, response, body) {

            });

        })

    } else if (error) {
        console.log(error);
    }
});