// pages/choose/choose-seat/choose-seat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seat: [],
    chooseList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const movie = wx.getStorageSync('movie')
    const movie_id = wx.getStorageSync('movie_id')
    const cinema = wx.getStorageSync('cinema')
    const cinema_id = wx.getStorageSync('cinema_id')
    const db = wx.cloud.database();
    db.collection('cinema_movie').get().then(res => { wx.setStorageSync("cinema_movie", res.data) })
    const cinema_movie = wx.getStorageSync('cinema_movie')
    //读选择电影所在movieList的idx,cinema_movie的price&场次point
    const idx = wx.getStorageSync('idx')
    const point = wx.getStorageSync('point')
    const price = cinema_movie[cinema_id - 1].movie[idx].price
    const time = cinema_movie[cinema_id - 1].movie[idx].time[point]
    wx.setStorageSync('price', price)
    wx.setStorageSync('time', time)

    //判断电影是否3D
    let is3D;
    if (movie[movie_id - 1].vision === '3D') {
      is3D = true;
    } else {
      is3D = false;
    }
    this.setData({
      time: time,
      seat: time.seat,
      cinema: cinema[cinema_id - 1],
      movie: movie[movie_id - 1],
      is3D: is3D,
      price:price
    })
    wx.setNavigationBarTitle({
      title: cinema[cinema_id - 1].name,
    })

  },

  onTapToChooseSeat: function(event) {
    var seatX = event.currentTarget.dataset.seatX;
    var seatY = event.currentTarget.dataset.seatY;
    // 返回点击座位坐标
    var seat_YX = seatY + "排" + seatX + "座";
    var chooseList = this.data.chooseList;
    //获取点击座位坐标值，
    var seat = this.data.seat;
    // console.log(seat[seatY - 1][seatX - 1])
    if (seat[seatY - 1][seatX - 1] === 0) {
      if (chooseList.length < 4) {
        seat[seatY - 1][seatX - 1] = 2
        chooseList.push(seat_YX);
        wx.showToast({
          title: '已经帮您选定了',
        })
      } else {
        wx.showToast({
          title: '一次性只能买4张票',
          icon: 'none'
        })
      }
      this.setData({
        seat: this.data.seat,
        chooseList: chooseList,
        seat_YX: seat_YX
      })
    } else if (seat[seatY - 1][seatX - 1] === 1) {
      wx.showToast({
        title: '这个座位已经有人了',
        icon: 'none'
      })
    } else {
      seat[seatY - 1][seatX - 1] = 0;
      chooseList.pop(seat_YX);
      wx.showToast({
        title: '已经取消选定了',
        icon: 'none'
      })
      this.setData({
        seat: this.data.seat,
        chooseList: chooseList
      })
    }
  },
  
  // 跳转到待支付页面
  onTapToReadyToPay: function() {
    wx.setStorageSync('newSeat', this.data.seat)
    wx.setStorageSync('chooseList', this.data.chooseList)
    wx.showToast({
      title: '正在生成选座',
      icon: 'loading',
      duration: 2000,
    })
    setTimeout(function() {
      wx.redirectTo({
        url: '../../pay/ready-to-pay/ready-to-pay',
      })
    }, 2000)
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
    //重读cinema_movie表刷新座位表
    wx.showNavigationBarLoading()
    const db = wx.cloud.database();
    db.collection('cinema_movie').get().then(res => { wx.setStorageSync("cinema_movie", res.data) })
    const cinema_movie = wx.getStorageSync('cinema_movie')
    const cinema_id = wx.getStorageSync('cinema_id')
    const idx = wx.getStorageSync('idx')
    const point = wx.getStorageSync('point')
    const time = cinema_movie[cinema_id - 1].movie[idx].time[point]
    wx.setStorageSync('time', time)
    this.setData({
      seat:time.seat
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