console.log('final working properly');

var https = require('https');
var http = require('http');
const cheerio = require('cheerio');
var request = require('request');

// var req_url = 'http://localhost/monitor';
var req_url = 'https://www.monitor.co.ug';

request({ uri: req_url }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(body)

        const allLinks = $('div.story-teaser')
            .get()
            .map(repo => {
                repo = $(repo);
                const link = repo.find('a').attr('href');
                return link;
            });
        // console.log(allLinks)
        console.log('number of Links Extracted\n =' + allLinks.length)

        // allLinks.forEach(function () {
        //     setTimeout(function () {
        //         console.log('processing link')
        //     }, 1000)
        // })

        var counter = 0;

        setInterval(function () {
            if (counter < allLinks.length) {
                processLinks(allLinks, counter)
                counter++;
            } else
                return
        }, 30000)

    } else if (error) {
        console.log(error);
    }
});


function processLinks(allLinks, counter) {
    console.log('request to process link\n\n' + allLinks[counter] + '\n\n')


    request({ uri: req_url + '/' + allLinks[counter] }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(body)
            const storyData = $('div.story-view')
                .get()
                .map(linkData => {
                    linkData = $(linkData);
                    const data = {
                        title: linkData.find('header h2').text(),
                        date: linkData.find('h6').text(),
                        img: linkData.find('header img').attr('src'),
                        alt: linkData.find('header img').attr('alt'),
                        caption: linkData.find('header p#photo_article_caption').text(),
                        author: linkData.find('section.body-copy section.author').text(),
                        story: linkData.find('section.body-copy p').text()
                    }
                    return data;
                });
            console.log(storyData)
        } else if (error) {
            console.log(error)
        }
    });
}