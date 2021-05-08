module.exports = {
    success: function (res, data) {
        return res.json({
            status: 1,
            data: data
        });
    },
    error: function (res, data, status) {
        status = (status) ? status : 500;
        return res.status(status).json({
            status: 0,
            data: data
        });
    }
}
