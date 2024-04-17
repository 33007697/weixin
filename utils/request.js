// 封装request请求
/*
封装的要求：
  1.明确函数的功能点
  2.函数内部应该保留固定代码（静态的）
  3.将动态的数据抽取成形参，有使用者根据自身的情况动态的传入
  4.一个良好的功能函数应该设置形参的默认值（ES6的形参默认值）
*/ 
// 封装request请求函数，并将其暴露出去
// 该请求方式是异步的，但是将属需要的数据返回，需要使用promise对象
// 引入配置文件
import URL from './config'


export default (url,data={},method='GET')=>{
  // 返回一个新的Promise对象实例
  return new Promise((resovle,reject)=>{
    wx.request({
      url:URL.host + url,
      data,
      method,
      // 请求头携带cookie，因为登录问题，cookie是固定的
      header:{
        cookie:wx.getStorageSync('cookie')? JSON.parse(wx.getStorageSync('cookie')):[]
      },
      // 请求成功的回调
      success:(res)=>{
        // 请求成功时，改变promise的状态，将数据返回
        resovle(res)
      },
      // 请求失败的回调
      fail:(err)=>{
        // 请求失败时，改变promise的状态，返回错误信息
        reject(err)
      }
    })
  })
}