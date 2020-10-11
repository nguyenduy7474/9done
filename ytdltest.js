const download = require('image-downloader')

const options = {
    url: 'https://www.teahub.io/photos/full/21-211456_blur-gaussian.jpg',
    dest: './public'                // will be saved to /path/to/dest/image.jpg
}

download.image(options)
    .then(({ filename }) => {
        console.log('Saved to', filename)  // saved to /path/to/dest/image.jpg
    })
    .catch((err) => console.error(err))