// pages/template/template.js
// 引入request
// import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 动态数据
    userInfo:{
      username:'Atguigu',
      age:13,
      phone:'400-158-0076'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 获取用户openID
  handleGetOpenId(){
    // 使用wx.login()方法获取用户凭证code，然后通过code获取用户的openID
    wx.login({
      success: (res) => {
        // 发送请求，将数据发送给后台服务器
        wx.request({
          url: 'http://localhost:8000/get_openid',
          data:{code:res.code},
          success:(res)=>{
            if(res.statusCode === 200){
              console.log(res.data)
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})