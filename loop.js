console.log('loop is working');
const loop = ['oks1', 'oks2', 'oks3', 'oks4']


var counter = 0;

setInterval(function(){
    if(counter < loop.length){
        console.log(loop[counter])
        counter++;
    } else 
    return
}, 2000)