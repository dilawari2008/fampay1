const { QueryTypes } = require('sequelize');
const sequelize = require('../models').sequelize;

module.exports = {
    async getActiveApiKey(){
        try{
          newActiveApiKey = await sequelize.query(
              'select api_key from apikeys where is_stale = \'false\' limit 1 ',
              {
                  type: QueryTypes.SELECT
              }
          );
          if(newActiveApiKey == null || newActiveApiKey.length == 0){
            throw "NO ACTIVE API_KEY EXISTS!";
          }
          return newActiveApiKey[0].api_key;
        } catch(e){
          console.log("ERROR : getActiveApiKey - ",e)
        }
    },

    async markApiKeyStale(apiKey) {
        try{
          response = await sequelize.query(
              'update apikeys set is_stale = \'true\' where api_key = \'' + apiKey + '\'',
              {
                  type: QueryTypes.SELECT
              }
          );
        } catch(e){
          console.log("ERROR : markApiKeyStale FAILED - ",e)
        }
    }

};
