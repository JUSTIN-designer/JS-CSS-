function Observer(data){
    this.data = data
    this.run(data)
}
Observer.prototype = {
    run(data){
        Object.keys(data).forEach(key => {
            this.bound(key,data[key])
        });
    },
    bound(key,value){
        var dep = new Dep()
        var childObj
        if(typeof value == 'Object'){
            childObj = observe(value)
        }
        Object.defineProperty(this.data,key,{
            enumerable:true,
            configurable:false,
            get(){
                if(depTarget){
                    dep.addWatcher(depTarget)
                    depTarget.addDep(dep.id)
                }
                return value
            },
            set(newVal){
                if(newVal==value)return;
                value = newVal 
                if(typeof newVal === 'object') {
                    childObj = observe(newVal)
                }
                dep.notify(newVal)
            }
        })
    }
}
var observe = function(data) {
    return new Observer(data)
}
var uid = 0 
var depTarget = null
function Dep(){
    this.id = uid++
    this.subs=[]
}
Dep.prototype={
    notify(newVal){
        this.subs.forEach(watcher => {
            watcher.updateCompile(newVal)
        })
    },
    addWatcher(watcher){
        this.subs.push(watcher)
    }
}
