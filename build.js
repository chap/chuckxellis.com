const fs = require('fs')
const request = require('request')
const fetch = require("node-fetch");
const unzipper = require('unzipper')
var Dropbox = require('dropbox')
const path = require( 'path' );

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = function move(oldPath, newPath, callback) {

    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            } else {
                callback(err);
            }
            return;
        }
        callback();
    });

    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);

        readStream.on('error', callback);
        writeStream.on('error', callback);

        readStream.on('close', function () {
            fs.unlink(oldPath, callback);
        });

        readStream.pipe(writeStream);
    }
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
            fs.writeFile('static/images.zip', result.fileBinary, 'binary', function (err) {
                if (err) { 
                    console.log('error');
                    throw err; 
                }
                console.log('File saved.');

                var stats = fs.statSync("static/images.zip")

                console.log("images.zip=")
                console.log(stats)
                //Convert the file size to megabytes (optional)
                var fileSizeInMegabytes = stats['size'] / 1000000.0
                console.log(fileSizeInMegabytes)
                


                // fs.createReadStream('static/images.zip')
                // .pipe(unzipper.Extract({ path: '/static' }))


                
                // console.log('json.length=')
                // console.log(json.length)

                // let data = JSON.stringify(json);
                // fs.writeFileSync('static/images.json', data);
                // console.log('write images.json')


                //   }

                // unzip doesn't remove inclosing folder
                // console.log('File: ' + 'images.zip' + ' unzi!pped.');


                console.log('reading root')
                root = fs.readdirSync( './')
                console.log('root=')
                console.log(root)

                
                console.log('reading static dir')
                static = fs.readdirSync( 'static')
                console.log('static=')
                console.log(static)

                // filenames = fs.readdirSync( 'static/chuckxellis-website-images')
                // console.log('filenames=')
                // console.log(filenames)
                // var json = []
                // const zip = fs.createReadStream('static/images.zip').pipe(unzipper.Parse({forceStream: true}));
                // console.log('zip=')
                // console.log(zip
                // for await (let filename of zip) {
                //     if(filename == '.keep') {
                //         filename.autodrain();
                //         continue;
                //     }
                //     console.log(filename) 


                //     // var pattern = /^[[0-9]*]/;
                //     // var reg = new RegExp('^-\\d+$');
                //     // var number = pattern.exec(title);
                //     // console.log('number='+number)

                //     let image = {
                //         path: fromPath,
                //         title: title
                //     }
                
                //     json.push(image)
                // } 

                var json = []
                fs.createReadStream('static/images.zip')
                .pipe(unzipper.Parse())
                .on('entry', function (entry) {
                    // console.log('zip entry=')
                    // console.log(entry)
                    const fileName = entry.path;
                    const type = entry.type; // 'Directory' or 'File'
                    if(type == 'Directory') {
                        continue;
                        // entry.autodrain
                    }
                    const size = entry.vars.uncompressedSize; // There is also compressedSize;

                    const filePath = 'static/images/' + fileName
                    const fileExtension = path.extname(fileName)
                    const title = path.basename(filePath, fileExtension)

                    let imageJson = {
                        path: filePath,
                        title: title
                    }
                    console.log('imageJson=')
                    console.log(imageJson)
                    json.push(imageJson)

                    if (fileName === "this IS the file I'm looking for") {
                        entry.pipe(fs.createWriteStream(filePath));
                        console.log('piped to file='+filePath)
                    } else {
                        entry.autodrain();
                    }
                })
                .on('close', function(){ 
                    console.log('json.length=')
                    console.log(json.length)

                    let data = JSON.stringify(json);
                    fs.writeFileSync('static/images.json', data);
                    console.log('write static/images.json')
                });




            
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



