// pages/logins/logins.js
// 引入请求文件
import request from '../../utils/request'
// 引入配置文件
// import host from '../../utils/config'
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:{},
    qhCookie:'',
    codeQrimg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取验证码的key
    this.getQhCodeKey()
    // 监测扫码结果
    setTimeout(()=>{
      this.getQhCodeStatus()
    },20000)  
  },
  // 获取验证码的key
  async getQhCodeKey(){
    let qhCodeKey = await request("/login/qr/key")
    // console.log(qhCodeKey)
    this.setData({
      qhCookie:qhCodeKey.cookies[0],
      status:qhCodeKey.data.data
    })
    // 将cookie保存一下
    wx.setStorageSync('cookie', JSON.stringify(qhCodeKey.cookies))
    // 判断一下status中的状态是否是200
    if(this.data.status.code === 200){
      this.getQhCode(this.data.status.unikey)
    }
  },
  // 获取验证码的地址

  async getQhCode(key){
    let qhCode = await request('/login/qr/create',{key,qrimg:true})
    // 将地址更新到status中
    if(qhCode.data.code === 200){
      this.setData({
        codeQrimg:qhCode.data.data.qrimg
      })
    }
    
  },
  // 二维码检测扫码结果
  async getQhCodeStatus(){
    let key = this.data.status.unikey
    let result = await request('/login/qr/check',{key})
    console.log(result)
    if(result.data.code === 803){
      // 提示信息
      wx.setStorageSync('cookie', JSON.stringify(result.cookies))
      wx.showToast({
        title: result.data.messages,
      })
      // 跳转地址
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }
    // 关掉定时器
    // clearInterval(timer)
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