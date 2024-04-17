// pages/login/login.js
// 引入发送请求模块
import request from '../../utils/request'
// cookie
let cookie ='MUSIC_U=003521CDF1F51BE588B2C59C6EFBD02D4B394B2F1FA2ED4E8A791E559527A5B2C32DD3229AE5BA2DE9992589EF8612AC32422BBDE503C083DBD005228964377270C9B2DD93A12C7D94A532E6BF0BDD136E81785BA652819BB6077BD3F3E6B769FC9D61098DA03BAF204D475CF2789C2DED0B756B7BA70A065A7A4732CF862CA7E29FC6B9697C893A595E03244D494DA244CCFEF2A23F27AA38D8476C44F4E713E855FB008D401A5EB379244612B71C60AF21E77B48E25435C98948F426C7816E24FEEEE75D0C45D3F091293A989B45B1EEF3F6EFBE46394CBC41E2997EA747D1D357D2E52A409B3145095C5F1D8808FA86DEB5F2D30F5944D0F1089BF267A1B589E8500FB07CC857240DB519AC52C7A07E378E83E6E16453F893730A39629892226CBF8F027AD0DC9C58303C91E5B4C0D6CF2568CA6D1A501A0380F1B691F45EFAAF7202A967D31874976D7C7BC280C255744944DA2CEAFFD533EB558A62851A3E;'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化数据
    phone:'',
    password:'',
    uid:8947426417,
    userInfo:{},
  },
  // 绑定事件回调
  getDatas(event){
    // 获取到当前标签的标识
    let type = event.currentTarget.id || event.currentTarget.dataset.type
    // 将数据输入到data中,并且去除前后空格
    this.setData({
      [type]:event.detail.value.trim()
    })
   
  },
  // 登录验证--前台验证
  logins(){
    // 将手机号和密码提取出来
    let {phone,password,uid} = this.data
    // 判断手机号是否合法的正则表达式
    let phoneTest = /^1[3-9]\d{9}$/
    // 判断一下手机号是否为空
    if(!phone){
      wx.showToast({ 
        title: '手机号不能为空',  //提示信息
        icon:'none'  //不使用图标
      })
      // 因为wx.showToast是异步任务，所以需要结束后面的进程
      return;
    }
    // 判断一下手机号是否格式
    if(!phoneTest.test(phone)){
      wx.showToast({
        title: '手机格式不正确',
        icon:'none'
      })
      return;
    }
    // 判断是密码是否为空
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
      return;
    }
    // 手机号验证正确
    this.verifyUserInfo(uid)
},
  // 后台验证
  async verifyUserInfo(uid){
    // 获取用户信息
    let result = await request('/user/detail',{uid,isLogin:true})
    if(result.statusCode === 200){
      wx.showToast({
        title: '登录成功',
        success:()=>{
          // 保存数据到data中
          this.setData({
            userInfo:result.data
          })
          // 保存数据到本地
          wx.setStorageSync('userInfo', JSON.stringify(this.data.userInfo))
          // 将cookie保存到本地
          wx.setStorageSync('cookie', cookie)
          // 跳转到个人中心页面
          wx.reLaunch({
            url: '/pages/personal/personal',
          })
        }
      }) 
    }else{
      wx.showToast({
        title: '登录失败',
        icon:'none'
      })
      return;
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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