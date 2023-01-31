const apikey = require('../models').apikey;
const { QueryTypes } = require('sequelize');
const sequelize = require('../models').sequelize;

module.exports = {
    add(req, res) {
        return apikey
          .create({
            api_key: req.body.api_key,
            is_stale: false,
          })
          .then((apikey) => res.status(201).send({message : 'API KEY successfully added!'}))
          .catch((error) => res.status(400).send(error));
    }

    //can also add a bulkCreate method
};
