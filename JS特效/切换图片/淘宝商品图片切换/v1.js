function Gallery(selector){
    var gallery = this
    var tank = this.tank = document.querySelector(selector)
    var imglist = tank.querySelectorAll(".img-item")
    var showContain = tank.querySelector(".show-contain")
    //初始化显示
    showContain.style.backgroundImage = `url(${this.getImgsrc(imglist[0])})`
    this.setClass(imglist[0])
    Array.prototype.slice.call(imglist).forEach(item => {
        let imgsrc = this.getImgsrc(item)
        item.onclick = function (){
            gallery.clearClass(imglist)
            gallery.setClass(item)
            showContain.style.backgroundImage = `url(${imgsrc})`
        }
    });
}
Gallery.prototype = {
    getImgsrc(imageParentNode){
        var imgsrc = imageParentNode.querySelector("img").src
        return imgsrc
    },
    clearClass(node){
        Array.prototype.slice.call(node).forEach(item => {
            var classVal = item.getAttribute("class")
            if(classVal.indexOf(" on ") != -1){
                newVal = classVal.replace(" on "," ")
                item.setAttribute("class",newVal)
            }
        });
    },
    setClass(item){
        var classVal = item.getAttribute("class")
            if(classVal.indexOf(" on ") === -1){
                newVal = classVal + " on "
                item.setAttribute("class",newVal)
            }
    }
}