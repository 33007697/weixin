// pages/personal/personal.js
// 引入request
import request from '../../utils/request'

// 手指起始位置
let startY = 0;
// 手指移动坐标
let moveY = 0;
// 手指移动距离
let moveDS = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 设置平移初始值
    coverTransform:"translateY(0)",
    // 设置过度初始值，值为空
    coverTransition:"",
    // 用户详情
    userInfo:{},
    // 用户浏览记录
    userHistory:[]
  },
  // 绑定点击显示登录界面
  login(){
    wx.navigateTo({
      url: '/pages/logins/logins',
    })
  },
  // 绑定的事件
  // 手指起始位置事件
  handleTouchstart(event){
    // 获取手指起始位置，赋值给startY
    startY = event.touches[0].clientY
    // 点击时，将过度设置空
    this.setData({
      coverTransition:''
    })
  },
  // 手指移动事件
  handleTouchmove(event){
    // 获取手指移动后的坐标，赋值给moveY
    moveY = event.touches[0].clientY
    // 计算手指移动距离，用手指移动后的坐标 - 手指起始位置
    moveDS = moveY - startY
    // 进行平移方向限制，不能往上移动
    if(moveDS < 0){
      moveDS = 0
    }
    // 进行平移距离限制，只能最多平移80rpx
    if(moveDS > 80){
      moveDS = 80
    }
    // 将移动距离赋值给coverTransform中
    this.setData({
      coverTransform:`translateY(${moveDS}rpx)`
    })
  },
  // 手指离开事件
  handleTouchend(){
    // 手指离开屏幕时，平移效果回到原来的位置
    this.setData({
      // 平移设置为0
      coverTransform:'translateY(0)',
      // 过度设置tranform，0.5秒，平滑linear
      coverTransition:'transform 0.5s linear'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取用户数据
    let userInfo = JSON.parse(wx.getStorageSync('userInfo')? wx.getStorageSync('userInfo'):"{}")
    // 判断一下是否有数据
    if(userInfo.profile){
      this.setData({
        userInfo
      })
      // 发送请求获取用户浏览记录
      this.getUserHistory(userInfo.profile.userId)
    }
    
  },
  // 获取用户浏览记录函数
  async getUserHistory(uid){
    let result = await request('/user/record',{uid,type:0})
    if(result.statusCode === 200){
      // 登记一个唯一值
      let index = 0
      // 将用户浏览记录保存到data中
      this.setData({
        // 给列表中的每一个对象添加一个唯一值id
        userHistory:result.data.allData.splice(0,10).map((item)=>{
            item.id = index++
            return item
        })
      })
    }else{
      wx.showToast({
        title: '网络未连接',
        icon:'none'
      })
      return;
    }
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