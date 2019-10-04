console.log('add to');

const cheerio = require('cheerio');
var request = require('request');

var Datastore = require('nedb')
var db = {};
db.monitor = new Datastore({ filename: './database/monitor.db' });

db.monitor.loadDatabase();

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


function addToDb(storyData){
    db.monitor.insert(storyData, function (err, newDoc) {
        if(!err && newDoc){
            console.log('\nadded data: \n' + newDoc)
        } else if(err){
            console.log(err)
        }
      });
}


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
            // console.log(storyData)
            addToDb(storyData)
        } else if (error) {
            console.log(error)
        }
    });
}

