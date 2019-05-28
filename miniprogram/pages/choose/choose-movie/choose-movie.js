  //pages/choose/choose-movie/choose-movie.js
  const app = getApp();
  var util = require("../../../utils/util.js")
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      idx: 0,
      movie_id: 1,
      tap1: true,
      tap2: false,
      tap3: false,
      all: []
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function(options) {
      //读缓存中的movie,cinema,cinema_movie表信息
      const movie = wx.getStorageSync('movie')
      const cinema = wx.getStorageSync('cinema')
      const cinema_movie = wx.getStorageSync('cinema_movie')
      //遍历出cinema_id对应的影院所有电影信息
      const cinema_id = wx.getStorageSync('cinema_id')
      var movieList = []
      cinema_movie[cinema_id - 1].movie.forEach(function(v_cinema_movie) {
        movie.forEach(function(v_movie) {
          if (v_movie.movie_id == v_cinema_movie.movie_id) {
            movieList.push(v_movie)
          }
        })
      })
      console.log(cinema[cinema_id - 1].name + ' 该影院对应的所有电影', movieList)
      this.data.all = cinema_movie[cinema_id - 1].movie
      this.setData({
        all: cinema_movie[cinema_id - 1].movie,
        movieList: movieList,
        cinema: cinema[cinema_id - 1],
        movie: movie
      })

      //判断是否从choose-cinema跳过来的
      let pages = getCurrentPages();
      let prevpage = pages[pages.length - 2];
      let link = prevpage.route;
      if (link === 'pages/choose/choose-cinema/choose-cinema') {
        //movie_id( movie => choose-cinema => choose-movie)
        const movie_id = wx.getStorageSync('movie_id')
        let idx = 0;
        for (var idx = 0; idx < movieList.length; idx++) {
          if (
            movieList[idx].movie_id == movie_id
          ) {
            wx.setStorageSync('idx', idx)
            break;
          }
        }
        this.setData({
          movie_id: movie_id,
          idx: idx
        })
      }
      //从cinema跳过来的
      else {
        wx.setStorageSync('idx', this.data.idx)
        this.setData({
          movie_id: movieList[0].movie_id,
          idx: this.data.idx
        })
      }
      wx.setNavigationBarTitle({
        title: cinema[cinema_id - 1].name
      })

      function CompareDate(t1, t2) {
        var date = new Date();
        var a = t1.split(":");
        var b = t2.split(":");
        return date.setHours(a[0], a[1]) > date.setHours(b[0], b[1]);
      }
      //获取日期    
      var nowTime = util.nowTime(new Date());
      let timeList = [],
        point_add = 0
      let time = this.data.all[this.data.idx].time
      time.forEach(function(v_time) {
        if (CompareDate(v_time.start, nowTime)) {
          timeList.push(v_time)
        } else {
          point_add++;
        }
      })
      console.log(movie[this.data.idx].title + ' 今日剩余场次', timeList)
      wx.setStorageSync('point_add', point_add)
      var today = util.formatDate(new Date());
      var tomorrow = util.tomorrowDate(new Date());
      var aftertomorrow = util.aftertomorrowDate(new Date());
      var date = [today, tomorrow, aftertomorrow];
      //默认日期为今天
      wx.setStorageSync('date', today)
      this.setData({
        date: date,
        timeList: timeList
      })
    },
    // 获取点击了电影的ID号
    getMovieId: function(event) {
      var movie_id = event.currentTarget.dataset.movieId;
      var idx = event.currentTarget.dataset.numId
      wx.setStorageSync('idx', idx)
      wx.setStorageSync('price', this.data.all[idx].price)

      function CompareDate(t1, t2) {
        var date = new Date();
        var a = t1.split(":");
        var b = t2.split(":");
        return date.setHours(a[0], a[1]) > date.setHours(b[0], b[1]);
      }
      var nowTime = util.nowTime(new Date());
      let timeList = [],
        point_add = 0
      let time = this.data.all[idx].time
      time.forEach(function(v_time) {
        if (CompareDate(v_time.start, nowTime)) {
          timeList.push(v_time)
        } else {
          point_add++;
        }
      })
      console.log(movie_id +'电影今天剩余场次', timeList)
      wx.setStorageSync('point_add', point_add)
      this.setData({
        movie_id: movie_id,
        idx: idx,
        timeList: timeList
      })
    },

    // 选日期
    chooseDate1: function(e) {
      var date = e.currentTarget.dataset.date;
      wx.setStorageSync('date', date)
      this.setData({
        tap1: true,
        tap2: false,
        tap3: false
      })
    },
    chooseDate2: function(e) {
      var date = e.currentTarget.dataset.date;
      wx.setStorageSync('date', date)
      this.setData({
        tap1: false,
        tap2: true,
        tap3: false
      })
    },
    chooseDate3: function(e) {
      var date = e.currentTarget.dataset.date;
      wx.setStorageSync('date', date)
      this.setData({
        tap1: false,
        tap2: false,
        tap3: true
      })
    },

    // 选场次
    onTapToChooseSeat: function(event) {
      var point = event.currentTarget.dataset.pointId;
      if (this.data.tap1) {
        point += wx.getStorageSync('point_add')
      }
      wx.setStorageSync('point', point)
      wx.setStorageSync('movie_id', this.data.movie_id)
      wx.navigateTo({
        url: '../choose-seat/choose-seat'
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