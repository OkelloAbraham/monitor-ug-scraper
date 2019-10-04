console.log('links.js working');

console.log('app working properly');

var https = require('https');
var http = require('http');
const cheerio = require('cheerio');
var request = require('request');

var req_url = 'http://localhost/monitorlink';

request({ uri: req_url }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body)

        const allLinks = $('div.story-view')
            .get()
            .map(linkData => {
                linkData = $(linkData);

                const title = linkData.find('header h2').text();
                const date = linkData.find('h6').text();
                const img = linkData.find('header img').attr('src');
                const alt = linkData.find('header img').attr('alt');
                const caption = linkData.find('header p#photo_article_caption').text();
                const author = linkData.find('section.body-copy section.author').text();
                const story = linkData.find('section.body-copy p').text();

                return story;
            });
            console.log(allLinks)
    }
});