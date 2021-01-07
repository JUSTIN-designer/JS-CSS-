function Watcher(vm,node,keys,callback){
    this.vm = vm
    this.node = node
    this.cb = callback
    this.value = this.get(keys)
}
Watcher.prototype={
    get(keys){
        depTarget=this
        let value
        keys.split(".").forEach(key => {
            value = this.vm._data[key]
        });
        depTarget = null
        return value
    },
    addDep(depID){
        this.depID = depID
    },
    updateCompile(newValue){
        if(this.value===newValue){
            return
        }else{
            this.value = newValue
            this.cb(this.node,newValue)
        }
    }                 
}