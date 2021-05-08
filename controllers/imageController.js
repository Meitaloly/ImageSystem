const imageModel = require('../models/image/imageModel.js')

class imageController {
    constructor(db) {
        this.db = db;
    }

    async uploadImg(userId, fileData) {
        try {
            let imgObj = {
                userId,
                imageName: fileData.originalname,
                size: fileData.size,
                generatedName: fileData.filename,
                path: fileData.path,
            }

            return await imageModel(this.db).saveImgRecord(imgObj)
        } catch (e) {
            console.log(e);
        }
    }

    async getImg(imgId) {
        return await imageModel(this.db).getImg(imgId);

    }

    async deleteImage(imgId) {
        return await imageModel(this.db).deleteImage(imgId);

    }
}


module.exports = (db) => {
    return new imageController(db);
};