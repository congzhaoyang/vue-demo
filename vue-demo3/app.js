import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'XV0SBUDOlInsIWOR7VpMlp1T-gzGzoHsz';
var APP_KEY = 'WyhlQlsIfcRU6vlPhWczjeQV';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
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
    removeTodo: function(todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    signUp: function() {
      // 新建 AVUser 对象实例
      var user = new AV.User();
      // 设置用户名
      user.setUsername('this.formData.username');
      // 设置密码
      user.setPassword('this.formData.password');
      user.signUp().then(function (loginedUser) {
          console.log(loginedUser);
      }, function (error) {
      });
    }
  }
})  