// components/NavHeader/NavHeader.js
Component({
  /*
  自定义组件：
    1.首先需要创建一个组件文件夹，然后是哟创建Component功能，创建自定义组件
    2.在wxml中写自定义组件的结构，在wxss中写自定义组件的样式，在json文件中写自定义组件的配置
    3.在js文件中的properties中写需要外部传入的数据
    4.需要使用该组件时，需要在使用页面的json配置文件中，将当前组件注册
    5.然后就可以直接在页面中使用该组件标签，插入自定义组件了
  */ 
  /**
   * 组件的属性列表
   */
  properties: {
    //自定义组件的默认数据，和接收外部数据的类型
    title:{
      type:String,
      value:'这个是title的默认数据'
    },
    nav:{
      type:String,
      value:'这个是nav的默认数据'
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})