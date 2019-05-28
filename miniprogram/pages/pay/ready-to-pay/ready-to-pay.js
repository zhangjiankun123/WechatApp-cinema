// miniprogram/pages/pay/ready-to-pay/ready-to-pay.js
var timer = require('../../../utils/wxTimer.js');
var util = require("../../../utils/util.js")

var wxTimer = new timer.wxTimer({
  beginTime: "00:30:00",
  // beginTime: "00:00:10",
  complete: function() {
    wx.showToast({
      title: '支付超时',
      icon: 'none',
      duration: 1000,
    })
    setTimeout(function() {
      wx.redirectTo({
        url: '../pay-overtime/pay-overtime',
      })
    }, 1000)
  }
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxTimerList: {},
    cinema: [],
    movieList: [],
    date: '',
    time: [],
    chooseList: [],
    allprice: '',
    newSeat: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wxTimer.start(this);

    const movie = wx.getStorageSync('movie')
    const movie_id = wx.getStorageSync('movie_id')
    this.data.movieList = movie[movie_id - 1]

    const cinema = wx.getStorageSync('cinema')
    const cinema_id = wx.getStorageSync('cinema_id')
    this.data.cinema = cinema[cinema_id - 1]

    this.data.date = wx.getStorageSync('date')
    this.data.time = wx.getStorageSync('time')
    const price = wx.getStorageSync('price')
    this.data.chooseList = wx.getStorageSync('chooseList')
    this.data.allprice = this.data.chooseList.length * price

    this.setData({
      cinema: this.data.cinema,
      movieList: this.data.movieList,
      date: this.data.date,
      time: this.data.time,
      chooseList: this.data.chooseList,
      allprice: this.data.allprice
    })

    wx.setNavigationBarTitle({
      title: '确认支付',
    })
  },

  onTapToPaid: function(option) {
    var year = util.year(new Date());
    let cinema_name = this.data.cinema.name;
    let movie_title = this.data.movieList.title;
    let date = year + this.data.date;
    let time = this.data.time.start + '-' + this.data.time.ending;
    let language_vision = this.data.movieList.language + this.data.movieList.vision;
    let where = this.data.movieList.movie_id + '号厅';
    let chooseSeat = this.data.chooseList;
    let allprice = this.data.allprice;

    var newSeat = wx.getStorageSync('newSeat')
    for (var i = 0; i < newSeat.length; i++) {
      for (var j = 0; j < newSeat[i].length; j++) {
        if (newSeat[i][j] === 2) {
          newSeat[i][j] = 1
        }
      }
    }
    const cinema_movie = wx.getStorageSync('cinema_movie')
    const cinema_id = wx.getStorageSync('cinema_id')
    const movie_id = wx.getStorageSync('movie_id')
    const idx = wx.getStorageSync('idx')
    const point = wx.getStorageSync('point')
    let cinema_movie_id = cinema_movie[cinema_id - 1]._id
    const db = wx.cloud.database()
    db.collection('order').count().then(res => {
      wx.setStorageSync('total', res.total)
    })

    wx.showModal({
      title: '支付须知',
      content: '一经支付，概不退款',
      showCancel: true,
      confirmText: '同意',
      cancelText: '不同意',
      success: function(res) {
        if (res.confirm) {
          console.log('同意')
          const db = wx.cloud.database()
          let total = wx.getStorageSync('total')
          db.collection('order').add({
            data: {
              order_id: total + 1,
              cinema_id: cinema_id,
              cinema_name: cinema_name,
              movie_id: movie_id,
              movie_title: movie_title,
              date: date,
              time: time,
              language_vision: language_vision,
              where: where,
              chooseSeat: chooseSeat,
              allprice: allprice
            },
            success: res => {
              console.log('成了')
              wx.showToast({
                title: '支付中',
                icon: 'loading',
                duration: 1000,
              })
              setTimeout(function() {
                wx.redirectTo({
                  url: '../paid/paid',
                })
              }, 2000)
            }
          })
          db.collection('cinema_movie').doc(cinema_movie_id).update({
            data: {
              movie: {
                [idx]: {
                  time: {
                    [point]: {
                      seat: newSeat
                    }
                  }
                }
              }
            }
          })
        } else {
          // console.log('不同意')
          wx.showToast({
            title: '亲亲，必须点击同意才能进行下一步操作哦~',
            icon: 'none',
            duration: 3000,
          })
        }
      }
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