const fs = require('fs')
const request = require('request')
const fetch = require("node-fetch");
const unzipper = require('unzipper')
var Dropbox = require('dropbox')
const path = require( 'path' );

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


function downloadFiles(dbx) {
    // for (var i = 0; i < files.length; i++) {
    //     console.log(files[i])
    //     { break } if (i == 1)
    console.log('downloadFiles()')
        dbx.filesDownloadZip({ path: "/chuckxellis-website-images" })
        .then((result, error) => {
            if(error) {
                console.log('error');
                console.error(error);
                process.exit(1);
            }
            console.log('writing...')
            fs.writeFile('images.zip', result.fileBinary, 'binary', function (err) {
                if (err) { 
                    console.log('error');
                    throw err; 
                }
                console.log('File saved.');

                var stats = fs.statSync("images.zip")

                console.log("images.zip=")
                console.log(stats)
                //Convert the file size to megabytes (optional)
                var fileSizeInMegabytes = stats['size'] / 1000000.0
                console.log(fileSizeInMegabytes)
                


                fs.createReadStream('images.zip')
                .pipe(unzipper.Extract({ path: 'static/' }))
                // unzip doesn't remove inclosing folder
                console.log('File: ' + 'images.zip' + ' unzi!pped.');

                
                console.log('reading dir')
                static = fs.readdirSync( 'static')
                console.log('static=')
                console.log(static)

                filenames = fs.readdirSync( 'static/chuckxellis-website-images')
                console.log('filenames=')
                console.log(filenames)
                var json = []
                for (let filename of filenames) { 
                    if(filename == '.keep') {
                        continue;
                    }
                    console.log(filename) 
                    fromPath = 'static/chuckxellis-website-images/' + filename
                    extension = path.extname(filename)
                    title = path.basename(fromPath, extension)

                    // var pattern = /^[[0-9]*]/;
                    // var reg = new RegExp('^-\\d+$');
                    // var number = pattern.exec(title);
                    // console.log('number='+number)

                    let image = {
                        path: fromPath,
                        title: title
                    }
                
                    json.push(image)
                } 

                console.log('json.length=')
                console.log(json.length)

                let data = JSON.stringify(json);
                fs.writeFileSync('static/images.json', data);
                console.log('write images.json')
            
            });

            // If promise is rejected 
            // .catch(err => { 
            //     console.log(err) 
            // }) 


        })
        .catch(e => {
            console.log('error')
            console.error(e);
            process.exit(1);
        });
    // return false;
}



var dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, 
    clientId: process.env.DROPBOX_CLIENT_ID, 
clientSecret: process.env.DROPBOX_CLIENT_SECRET,
       fetch: require("node-fetch") });
downloadFiles(dbx)



// Get the files as an array



