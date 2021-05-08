const express = require('express');
const ImageRouter = express.Router();
const ImageController = require('../controllers/imageController');
const response = require('./response');
const multer = require("multer");
const upload = multer({
    dest: 'images'
})

module.exports = (db) => {

    ImageRouter.post('/upload', upload.single('upload'), (req, res) => {
        let file = req.file;
        let userId = req.headers['x-username'];
        ImageController(db).uploadImg(userId, file)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    ImageRouter.get('/:imgId', (req, res) => {

        ImageController(db).getImg(req.params.imgId)
            .then(data => {
                if (data) {
                    res.download(data);
                } else {
                    return response.error(res, "image not found");

                }
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    ImageRouter.delete('/:imgId', (req, res) => {

        ImageController(db).deleteImage(req.params.imgId)
            .then(data => {
                return response.success(res, data);
            })
            .catch(e => {
                return response.error(res, e);
            })
    })

    return ImageRouter;
}