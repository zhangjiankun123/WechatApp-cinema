// pages/cinema/cinema.js
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: '',
    city: '',
    latitude: '',
    longitude: '',
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
      title: '影院',
    })
    try {
      const cinema = wx.getStorageSync('cinema')
      if (cinema) {
        this.setData({
          cinema: cinema
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
    qqmapsdk = new QQMapWX({
      key: 'XA6BZ-UT4AF-TRNJW-JXQ4N-ZN2IV-EJBG7'
    })
  },
  onTapToMovieDetail: function (e) {
    var movie_id = e.currentTarget.dataset.movieId;
    wx.setStorageSync('movie_id', movie_id)
    wx.navigateTo({
      url: '../movie/movie-detail/movie-detail?id=' + movie_id,
    })
  },
  onTapToChooseMovie: function(e) {
    var cinema_id = e.currentTarget.dataset.cinemaId;
    wx.setStorageSync('cinema_id', cinema_id)
    wx.navigateTo({
      url: '../choose/choose-movie/choose-movie?id=' + cinema_id,
    })
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
    console.log(this.data.SearchValue)
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
    const Search_of_cinema = []
    const cinema = wx.getStorageSync('cinema')
    cinema.forEach(function(value) {
      if (value.name.indexOf(keyWord) != -1) {
        Search_of_cinema.push(value)
      }
    })
    this.setData({
      cinemaList: Search_of_cinema,
      searched: true
    })
  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      SearchValue: '',
      cinemaList: [],
      searched: false
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
    let vm = this;
    vm.getUserLocation();
  },
  getUserLocation: function() {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        // console.log(JSON.stringify(res))
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.Opensetting({
                  success: function(dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          vm.getLocation();
        } else {
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function() {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function(res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function(latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })
        console.log(city)
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {}
    });
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
    db.collection('cinema').get().then(res => {
      this.setData({
        cinema: res.data,
        containerShow: true,
        searchPanelShow: false,
        SearchValue: '',
        searched: false
      })
      wx.setStorageSync('cinema', res.data)
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