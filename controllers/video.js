const video = require('../models').video;
const { QueryTypes } = require('sequelize');
const sequelize = require('../models').sequelize;
const videoRepo = require('../repositories').video;

module.exports = {
    list(req, res) {
        const pageSize = req.query.pageSize;
        const pageNum = req.query.pageNum;
        const limit = pageSize;
        const offset = (pageNum - 1) * pageSize;
        video.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [
                ['published_at', 'DESC']
            ]
        }).then((videos) => res.status(200).send(videos))
        .catch((error) => { res.status(400).send(error); });
    },

    async search(req, res) {
        const searchQuery = req.query.searchQuery;

        videoRepo.searchQueryFunction(searchQuery)
        .then((videos) => { res.status(200).send(videos);})
        .catch((error) => { res.status(400).send(error); });

    },
};
