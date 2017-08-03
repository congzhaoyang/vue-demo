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
  //alert('LeanCloud Rocks!');
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
      this.currentUser = this.getCurrentUser()
      this.fetchTodos()
    },
  methods: {
    fetchTodos: function() {
      if(this.currentUser){
        var query = new AV.Query('AllTodos');
        query.find()
          .then((todos) => {
            let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
            let id = avAllTodos.id
            this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
            this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
          }, function(error){
            console.error(error) 
        })
      }
    },
    //更新TODO功能
    updateTodos: function(){
      // 想要知道如何更新对象，先看文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
      let dataString = JSON.stringify(this.todoList) // JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      avTodos.set('content', dataString)
      avTodos.save().then(()=>{
        console.log('更新成功')
      })
    },
    //保存TODO功能
    saveTodos: function(){
        let dataString = JSON.stringify(this.todoList)
        var AVTodos = AV.Object.extend('AllTodos');
        var avTodos = new AVTodos();
        //使用ACL权限
        var acl = new AV.ACL()
        acl.setReadAccess(AV.User.current(),true) // 只有这个 user 能读
        acl.setWriteAccess(AV.User.current(),true) // 只有这个 user 能写
    
        avTodos.set('content', dataString);
        avTodos.setACL(acl)
        avTodos.save().then((todo) => {
          this.todoList.id = todo.id  // 一定要记得把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
          //alert('保存成功 ' + todo);
        }, function (error) {
          //alert('保存失败 ' + todo);
        });
    },
    //报错或更新TODO
    saveOrUpdateTodos: function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },
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
      this.saveOrUpdateTodos()
    },

    //移除 TODO 功能
    removeTodo: function(todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
      this.saveOrUpdateTodos()
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
        this.currentUser = this.getCurrentUser
        this.fetchTodos()
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
      let current = AV.User.current()
      if(current) {
        let {id, createdAt, attributes: {username}} = current
        return {id, username, createdAt}
      } else {
        return null
      }
    }

  }
})  