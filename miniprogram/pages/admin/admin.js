// pages/admin/admin.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
      const movie = wx.getStorageSync('movie')
      const cinema = wx.getStorageSync('cinema')
      const cinema_movie = wx.getStorageSync('cinema_movie')
      const cinema_id = wx.getStorageSync('cinema_id')
      wx.setStorageSync('cinema_movie_id', cinema_movie[cinema_id - 1]._id)
      //遍历出cinema_id对应的影院所有电影
      var movieList = []
      cinema_movie[cinema_id - 1].movie.forEach(function(a) {
        movie.forEach(function(b) {
          if (b.movie_id == a.movie_id) {
            movieList.push(b)
          }
        })
      })
      // 打印出该影院有的电影
      wx.setStorageSync('all', cinema_movie[cinema_id - 1].movie)
      if (movie && cinema) {
        this.setData({
          all: cinema_movie[cinema_id - 1].movie,
          movie: movieList,
          cinema: cinema[cinema_id - 1],
        })
        wx.setNavigationBarTitle({
          title: cinema[cinema_id - 1].name + '后台管理',
        })
      }
    } catch (e) {}
  },
  onTapBackToCinema: function () {
    const cinema_id = wx.getStorageSync('cinema_id')
    wx.navigateTo({
      url: '../choose/choose-movie/choose-movie?id=' + cinema_id,
    })
  },
  onTapToMovieDetail: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.setStorageSync('movie_id', movieId)
    // console.log('跳到第' + movieId + '部电影')
    wx.navigateTo({
      url: '../movie/movie-detail/movie-detail?id=' + movieId,
    })
  },
  onRemove: function(e) {
    //获取删除列表中第几部电影序号
    var id = e.currentTarget.dataset.idX;
    const movie = wx.getStorageSync('movie')
    const all = wx.getStorageSync('all')
    all.splice(id, 1)
    wx.setStorageSync('all', all)
    var newList =[];
    console.log(all)
    all.forEach(function(value1) {
      movie.forEach(function(value2) {
        if (value1.movie_id === value2.movie_id) {
            newList.push(value2)
        }
      })
    })
    const db = wx.cloud.database()
    const _ = db.command
    const cinema_movie_id = wx.getStorageSync('cinema_movie_id')
    db.collection('cinema_movie').doc(cinema_movie_id).update({
      data: {
        movie: all
      },
      success: res => {
        this.setData({
          movie:newList
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        db.collection('cinema_movie').get().then(res => {
          wx.setStorageSync("cinema_movie", res.data)
        })
      }
    })
  },
  onTapToAddMovie:function(){
    wx.navigateTo({
      url: 'add-movie/add-movie'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})