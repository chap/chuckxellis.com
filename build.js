if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const fs = require('fs')
const request = require('request')
const fetch = require("node-fetch");
var Dropbox = require('dropbox')



var dbx = new Dropbox.Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, 
                                   clientId: process.env.DROPBOX_CLIENT_ID, 
                               clientSecret: process.env.DROPBOX_CLIENT_SECRET,
                                      fetch: require("node-fetch") });

function listFiles() {
    dbx.filesListFolder({ path: 'chuckxellis.com/' })
        .then(function (response) {
        //     console.log('response');
        //     console.log(response);
        
        // console.log(response);
        downloadFiles(response.entries) 
        // return response
    })
        .catch(function (error) {
            console.log('error')
        console.error(error);
    });
}

function downloadFiles() {
    // for (var i = 0; i < files.length; i++) {
    //     console.log(files[i])
    //     { break } if (i == 1)

        dbx.filesDownloadZip({ path: '/chuckxellis.com/' })
            .then(function (data) {
            // NOTE: The Dropbox SDK specification does not include a fileBlob
            // field on the FileLinkMetadataReference type, so it is missing from
            // the TypeScript type. This field is injected by the Dropbox SDK.
            // var downloadUrl = URL.createObjectURL(data.fileBinary);
            console.log(data)
            download(data)
        })
            .catch(function (error) {
            console.error(error);
        });
    // }
    // return false;
}

const download = (data) => {
    console.log('download')
    fs.writeFile(data.name, data.fileBinary, 'binary', function (err) {
        if (err) { throw err; }
        console.log('File: ' + data.name + ' saved.');
      });

      fs.createReadStream(data.name)
  .pipe(unzipper.Extract({ path: 'static/images/' }));
  onsole.log('File: ' + data.name + ' unzipped.');
  }

  downloadFiles()
