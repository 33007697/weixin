// pages/search/search.js

import request from '../../utils/request'
// 函数节流控制变量
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    // 热播榜列表
    hotList:[],
    // 搜索的内容
    searchContent:'',
    // 搜索后返回的数据
    searchList:[],
    // 历史记录
    historyList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSearchDefault()
    // 获取历史记录
    this.getSearchHistory()
  },
  async getSearchDefault(){
    // 获取搜索框默认信息
    let result = await request('/search/default')
    // 获取热搜榜列表信息
    let hotList = await request('/search/hot/detail')
    // 跟新搜索框默认信息
    this.setData({
      message:result.data.data.showKeyword,
      hotList:hotList.data.data
    })
  },
  // 开始获取本地存储中的历史记录
  getSearchHistory(){
    this.setData({
      historyList:wx.getStorageSync('SearchHistory')? wx.getStorageSync('SearchHistory'):[]
    })
  },
  // 获取输入的内容
  handleInput(event){
    // 将输入的搜索数据保存起来
    this.setData({
      searchContent:event.detail.value.trim()
    })
    // 获取数据
    this.getSearchList()
    
  },
  // 发送请求获取搜索到的数据
  async getSearchList(){
    // 获取搜索的关键字
    let {searchContent,historyList} = this.data
    // 判断一下关键字是否为空
    if(!searchContent){
      // 如果关键字为空，则把数据列表清空
      this.setData({
        searchList:[]
      })
      // 然后直接返回，不发送请求
      return
    }
    // 函数节流
    // 如果函数控制变量为true，着直接返回
    if(isSend){
      return
    }
    // 如果函数控制变量为false，则将其改变为true
    isSend = true
    // 发送请求，获取到输入的搜索数据
    let result = await request('/search',{keywords:searchContent,limit:10})

    // 判断一下搜索的数据是否在历史记录中
    if(historyList.indexOf(searchContent) !== -1){
      // 存在则将其从historyList数组中删除
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    // 否则就将数据添加到historyList中
    historyList.unshift(searchContent)
    // 将数据保存到data中,并将历史记录保存
    this.setData({
      searchList:result.data.result.songs,
      historyList
    })
    // 开启延迟定时器，每隔300毫秒将函数节流控制变量的值更改为false
    setTimeout(()=>{
      isSend = false
    },300)
    // 将数据保存到本地存储中
    wx.setStorageSync('SearchHistory', historyList)
  },
  // 删除历史记录
  handleDelete(){
    // 首先判断一下是否需要删除，提示用户
    wx.showModal({
      content:'是否要清空历史记录？',
      success:(res)=>{
        // 如果用户点击的是确认按钮
        if(res.confirm){
          // 清空数据
          this.setData({
            historyList:[]
          })
          // 删除本地缓存数据
          wx.removeStorageSync('SearchHistory')
        }
      }
    })
  },
  // 点击删除输入的搜索内容
  handleClear(){
    // 清空保存到搜索内容
    this.setData({
      searchContent:'',
      searchList:[],
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