// pages/movie/movie.js
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerShow: true,
    searchPanelShow: false,
    SearchValue: '',
    searched: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const db = wx.cloud.database();
    db.collection('swiper').get().then(res => {
      this.setData({
        swiper: res.data
      })
    })
    wx.setNavigationBarTitle({
      title: '电影'
    })
    try {
      const movie = wx.getStorageSync('movie')
      if (movie) {
        this.setData({
          movie: movie
        })
      } else {
        wx.showToast({
          title: "亲亲系统出了点小问题~",
          icon: 'none',
          duration: 3000
        })
        console.log("未加载缓存信息")
      }
    } catch (e) {}
  },
  // 搜索
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  bindKeyInput: function(e) {
    this.data.SearchValue = e.detail.value
    // console.log(this.data.SearchValue)
    this.setData({
      SearchValue: this.data.SearchValue
    })
  },
  clearSearchValue: function() {
    this.data.SearchValue = ''
    this.setData({
      SearchValue: this.data.SearchValue
    })
  },
  onBindConfirm: function(event) {
    var keyWord = this.data.SearchValue;
    console.log(keyWord)
    const Search_of_movie = []
    const movie = wx.getStorageSync('movie')
    movie.forEach(function(value) {
      if (value.title.indexOf(keyWord) != -1) {
        Search_of_movie.push(value)
      }
    })
    this.setData({
      movieList: Search_of_movie,
      searched: true
    })
  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      SearchValue: '',
      movieList: [],
      searched: false
    })
  },

  onTapToMovieDetail: function(e) {
    var movie_id = e.currentTarget.dataset.movieId;
    wx.setStorageSync('movie_id', movie_id)
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movie_id,
    })
  },
  // onTapToChooseCinema: function(e) {
  //   var movie_id = e.currentTarget.dataset.movieId;
  //   wx.setStorageSync('movie_id', movie_id)
  //   setTimeout(function() {
  //     wx.navigateTo({
  //       url: '../choose/choose-cinema/choose-cinema?id=' + movie_id
  //     })
  //   }, 1000)
  //   wx.showToast({
  //     title: "正在努力加载",
  //     duration: 1000,
  //     icon: "loading",
  //     mask: true
  //   })
  // },
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
    const db = wx.cloud.database();
    db.collection('movie').get().then(res => {
      this.setData({
        movie: res.data,
        containerShow: true,
        searchPanelShow: false,
        SearchValue: '',
        searched: false
      })
      wx.setStorageSync('movie', res.data)
    })
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