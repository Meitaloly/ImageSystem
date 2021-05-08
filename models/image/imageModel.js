const fs = require('fs');

class imageModel {
    constructor(db) {
        this.db = db;
    }

    async saveImgRecord(record) {
        try {
            return await new this.db.Image(record).save();
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getImg(imgId) {

        try {
            let imgRecord = await this.db.Image.findOne({
                _id: imgId
            })

            return imgRecord ? imgRecord.path : null;
        } catch (e) {
            console.log(e);
            return e;
        }


    }


    async deleteImage(imgId) {

        try {
            console.log(imgId);
            let imgRecord = await this.db.Image.findOne({
                _id: imgId
            })
            console.log(imgRecord);
            if (imgRecord) {
                fs.unlinkSync(imgRecord.path);
            } else {
                throw "image not found"
            }

            return await this.db.Image.deleteOne({
                _id: imgId
            })

        } catch (e) {
            console.log(e);
            return e;
        }


    }

}

module.exports = (db) => {
    return new imageModel(db);
}