function MVVM(options){
 this.$options = options
 var data = this._data=this.$options.data
 var vm = this
 /*实现数据代理*/
 Object.keys(data).forEach(key => { 
    vm._proxy(key)
 })
 observe(data)
 this.$compile = new Compile(vm,options.el||document.body)
} 
MVVM.prototype._proxy=function(key){
    var vm = this 
    Object.defineProperty(vm,key,{
        configurable:false,
        enumerable:true,
        get(){
            return vm._data[key]
        },
        set(newVal){
            vm._data[key] = newVal
        }
    })
}