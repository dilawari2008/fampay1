const { QueryTypes } = require('sequelize');
const sequelize = require('../models').sequelize;
const CronJob = require("node-cron");
const video = require('../models').video;
const axios = require('axios');
const videoRepo = require('../repositories').video;
const apikeyRepo = require('../repositories').apikey;
const MAX_RESULTS = "50";
const QUERY_STRING = "sports";
const PUBLISHED_AFTER = "2023-01-28T21:36:09Z";
var API_KEY = '';


apikeyRepo.getActiveApiKey()
.then((api_key) => API_KEY = api_key)
.catch((e) => console.log(e));



initScheduledJobs();

function initScheduledJobs() {
  const scheduledJobFunction = CronJob.schedule("*/5 * * * * *", async () => {
    var currentdate = new Date(); 
    var datetime = new Date(currentdate).toISOString();
    console.log("scheduler ran @ --> ",datetime);
    try {
      console.log("API_KEY in use - ",API_KEY);
      const response = await axios.get('https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults='+MAX_RESULTS+'&q='+QUERY_STRING+'&key='+API_KEY+'&type=video&order=date&publishedAfter='+PUBLISHED_AFTER);
      var items = response.data.items;

      var newVideos = items.map( (item) => {
        var videoId = item.id.videoId;

        var snippet = item.snippet;
        
        var publishedAt = snippet.publishedAt;
        var title = snippet.title;
        var description = snippet.description;
        var thumbnailUrl = snippet.thumbnails.default.url;

        var newVideo = {
            youtube_video_id: videoId,
            published_at: publishedAt,
            title: title,
            description: description,
            thumbnail_url: thumbnailUrl,
            scheduler_timestamp: datetime
        };

        return newVideo;
    });

    if(newVideos == null || newVideos.length == null || newVideos.length == 0) return;

    var videoIdVideoMap = new Map();
    newVideos.map((video) => {
      videoIdVideoMap.set(video.youtube_video_id, video);
    });

    var videosIdsString = '';
    newVideos.map((video) => {
      if(videosIdsString!=null && videosIdsString.length>0) videosIdsString += ',' ;
      videosIdsString += ( '(\'' + video.youtube_video_id + '\')' );
    });


    newVideoIds(videosIdsString);

    async function newVideoIds(videosIdsString) {
      var newVideoIdList =[];
      //console.log("newVideoIds(1) - ",videosIdsString);
      await videoRepo.newVideoIds(videosIdsString)
        .then((videos) => { //console.log("newVideoIds(2) - ",videos);
        newVideoIdList = videos; })
        .catch((error) => { console.log(error) });
      //console.log("newVideoIds(3) - ",newVideoIdList);
      updateNewVideos(newVideoIdList);
      bulkInsertions();
    }
    function updateNewVideos(newVideoIdList) {
      //console.log("updateNewVideos(1) - ",newVideoIdList);
      var updatedNewVideoList = newVideoIdList.map((videoId) => {
        return videoIdVideoMap.get(videoId.video_id);
      });
      newVideos = [];
      newVideos = [...updatedNewVideoList];
      //console.log("updateNewVideos(2) - ",newVideos);
    }
    function bulkInsertions ()  {
      //console.log("Started bulk insertions for "+ newVideos.length +" items.");
      return video
        .bulkCreate(newVideos)
        .then(() => console.log("SUCCESS : bulk insertion for - "+ newVideos.length +" items performed @ --> ", datetime))
        .catch((error) => console.log("FAILED : bulk insertion @ --> ", datetime, error));
      }
    } catch(e){
      var errResponse = e.response;
      var errStatus = errResponse.status;
      var errStatusText = errResponse.statusText;
      if(errStatus == 403 && errStatusText == 'Forbidden') {
        try{
          console.log("QUOTA EXCEEDED for this api_key, marking it as stale ....");
          await apikeyRepo.markApiKeyStale(API_KEY);
          console.log("trying to switch to new api_key ....");
          await apikeyRepo.getActiveApiKey().then((api_key) => API_KEY = api_key).catch((e) => console.log(e));
          console.log("successfully switched to new api_key !");
        } catch(err){
          console.log(err);
        }
      }
      else if(errStatus == 400 && errStatusText == 'Bad Request') {
        try{
          console.log("Bad Request, check if active api keys exist!");
          await apikeyRepo.getActiveApiKey().then((api_key) => API_KEY = api_key).catch((e) => console.log(e));
        } catch(err){
          console.log(err);
        }
      }
    }
    

    
  });

  scheduledJobFunction.start();
}
