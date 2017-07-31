import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'XV0SBUDOlInsIWOR7VpMlp1T-gzGzoHsz';
var APP_KEY = 'WyhlQlsIfcRU6vlPhWczjeQV';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello World!'
}).then(function(object) {
  alert('LeanCloud Rocks!');
});


var app = new Vue({
  el: '#app',
  data: {
    actionType: 'signUp',
    formData: {
      username: '',
      password: '',
    },
    newTodo: '',
    todoList: [],
    currentUser: null,
  },
    created: function(){
    // onbeforeunload文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onbeforeunload
    window.onbeforeunload = ()=>{
      let dataString = JSON.stringify(this.todoList) // JSON 文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON
      window.localStorage.setItem('myTodos', dataString) // 看文档https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage
    }

    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
  },
  methods: {

    //填加 TODO 功能
    addTodo: function(){
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false,
        date: new Date(),
      })
      console.log(this.todoList)
      this.newTodo = '';
    },

    //移除 TODO 功能
    removeTodo: function(todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },

    //注册功能
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then((loginedUser) => {
        this.currentUser = this.getCurrentUser
        //console.log(loginedUser)
        alert("注册成功")
      }, (error) => {
        alert("注册失败")
      });
    },

    //登录功能
    logIn: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
        this.currentUser = this.getCurrentUser;
        //console.log(loginedUser);
        alert("登录成功")
      }, (error) => {
        alert("登录失败")
      })
    },

    //登出功能
    logout: function () {
       AV.User.logOut()
       this.currentUser = null
       window.location.reload()
    },

    //获取当前用户
    getCurrentUser: function() {
      let {id, createdAt, attributes: {username}} = AV.User.current()
      return {id, username, createdAt}
    }

  }
})  