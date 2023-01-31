const { QueryTypes } = require('sequelize');
const sequelize = require('../models').sequelize;

module.exports = {
    async searchQueryFunction(searchQuery){
        try{
            var searchVideoList = await sequelize.query(
            'select * from videos where title like \'%'+ searchQuery +'%\' or description like \'%'+ searchQuery +'%\' order by published_at desc limit 25',
            {
                type: QueryTypes.SELECT
            }
        );
        return searchVideoList;
        } catch(e){
            console.log(e);
        }
    },

    async newVideoIds(videosIdsString) {
        try{
          var newVideoIdList = await sequelize.query(
              'select (V.video_id) FROM   (VALUES  '+ videosIdsString +') V(video_id) where (select count(id) from videos where videos.youtube_video_id = V.video_id)=0',
              {
                  type: QueryTypes.SELECT
              }
          );
          //console.log("newVideoIdsrepo(1) - ",newVideoIdList);
          return newVideoIdList;
        } catch(e){
          console.log(e)
        }
    }

};





