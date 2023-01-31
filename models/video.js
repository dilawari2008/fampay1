const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class video extends Model {
    };
    video.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      youtube_video_id: {type: DataTypes.STRING, unique: true, allowNull: false},
      published_at: {type: DataTypes.DATE, allowNull: false},
      title: {type: DataTypes.STRING, allowNull: true},
      description: {type: DataTypes.STRING, allowNull: true},
      thumbnail_url: {type: DataTypes.STRING, allowNull: true},
      scheduler_timestamp: {type: DataTypes.DATE, allowNull: true}
    }, {
      sequelize,
      modelName: 'video',
    });
    return video;
  };