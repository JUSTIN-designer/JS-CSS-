function Compile(vm,el){
    /* 保存vm */
    this.$vm = vm
    /*保存el，因为el有可能是body标签，所以需要判断实例中的el */
    this.$el=this.isElementNode(el)? el : document.querySelector(el)
    if(this.$el){
        //取出el中的所有子节点，并封装在fragment对象中
        this.$fragment = this.initFragment(this.$el)
        //编译fragment中的所有节点
        this.init()
        //将编译后的fragment添加回el中 
        this.$el.appendChild(this.$fragment)
    }

}
Compile.prototype = {
    //用于新增一个fragment对象
    initFragment(el){
        let fragment = document.createDocumentFragment()
        let child
        //将节点添加到fragment中
        while(child=el.firstChild){
            fragment.appendChild(child)
        }
        return fragment
    },
    //编译fragment
/*问题：为什么initfragment()需要设计形参，而init不用定义形参 单纯是因为编写时方便？*/
    init(){
        this.compileElement(this.$fragment)
    },
    /*编译节点标签*/ 
    compileElement(nodes){
        //获取全部子节点
        var nodesList = nodes.childNodes
        var reg = /\{\{(.*)\}\}/;
        //遍历所有子节点
        [].slice.call(nodesList).forEach(node => {
        /*问题:使用nodeValue是否可以取到文本内容 */   
            let text = node.textContent
            if(this.isElementNode(node)){
                //编译元素节点内的指令属性
                this.compile(node)
            }else if(this.isTextNode(node) && reg.test(text)){
                this.compileText(RegExp.$1,node)
            }
            //若节点内还有子节点，则通过递归实现所有节点的编译
            if(node.childNodes&&node.childNodes.length){
                    this.compileElement(node)
            } 
        })
      
    },
    /*判断是否是元素标签 */
    isElementNode(node){
        return node.nodeType===1
    },
    /*判断是否是文本标签 */
    isTextNode(node){
        return node.nodeType===3
    },
    /*用于编译含指令的元素标签*/
    compile(node){
        let nodeAttr = node.attributes;
        [].slice.call(nodeAttr).forEach(attr=>{
            if(this.isDirective(attr.name)){
                let type = attr.name.slice(2)
                let value = attr.value
                if(this.isEventDirective(type)){
                    let eventType = attr.name.slice(5)
                    compileUtil.eventHandler(this.$vm,eventType,value,node)
                }else{
                    compileUtil[type](this.$vm,value,node)
                }
            }
        })
        
    },
    /*编译大括号表达式的方法 */
    compileText(reg,node){
        compileUtil.text(this.$vm,reg,node)
    },
    isDirective(name){
        return name.indexOf("v-") == 0
    },
    isEventDirective(type){
        return type.indexOf("on") == 0
    }
}
//指令处理的集合
var compileUtil={
    text(vm,reg,node){
        var value =this._getVMVal(vm,reg)
        var updaterFn = updater.textUpdater
        new Watcher(vm,node,reg,updaterFn)
        updaterFn(node,value)
    },
    html(vm,reg,node){
        var value =this._getVMVal(vm,reg)
        var updaterFn = updater.htmlUpdater
        new Watcher(vm,node,reg,updaterFn)
        updaterFn(node,value)
    },
    model(vm,reg,node){
        var value =this._getVMVal(vm,reg)
        var updaterFn = updater.modelUpdater
        new Watcher(vm,node,reg,updaterFn)
        updaterFn(node,value)
        var me = this
        node.addEventListener("input",function(event){
            var newVal = event.target.value
            if(value===newVal){
                return;
            }else{
                me._setVMVal(vm,newVal,reg)
            }            
        })
    },
    class(vm,reg,node){
        var value =this._getVMVal(vm,reg)
        var updaterFn = updater.classUpdater
        new Watcher(vm,node,reg,updaterFn)
        updaterFn(node,value)
    },
    //处理事件指令
    eventHandler(vm,type,value,node){
        let fn = vm.$options.methods[value]
        if(type&&fn){
            node.addEventListener(type,fn.bind(vm),false)
        }

    },
    //得到data中相应的值
    _getVMVal(vm,reg){
        var keys = reg.split('.')
        let value = vm._data
        keys.forEach(i=>{
            value = value[i]
        })
        return value
    },
    _setVMVal(vm,val,reg){
        var keys = reg.split('.')
        let value = vm._data
        keys.forEach((key,index)=>{
            if(index<keys.length-1){
                value = value[key]
            }else{
                value[key] = val
            }
        })
        return value
    }

}
//更新节点方法的集合
var updater = {
    textUpdater(node,value){
        //编程时要多注重没有值时的情况，此处若没有传value，则显示没内容
            node.textContent=typeof value == "undefined"? "": value
        },
    htmlUpdater(node,value){
            node.innerHTML=typeof value == "undefined"? "": value
        },
    modelUpdater(node,value){
        node.value = typeof value == 'undefined' ? '' : value;
    },
    classUpdater(node,value){
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');
    
        var space = className && String(value) ? ' ' : '';
    
        node.className = className + space + value;
    }

}