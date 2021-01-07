function Scroll(target,imgSize){
    //获取img容器 即轮播图的ul，imgList
    var scroll = this
    //保存img的尺寸
    this.imgSize = imgSize
    //获取scroll所在的div
    var imgList = this.imgList = document.querySelector(target)
    //初始化fragment
    imgList.$fragment = this.initFragment()
    //将原始的HTML进行修改，编译成轮播图的html
    this.initScroll(imgList.$fragment);
    imgList.appendChild(imgList.$fragment)
    //根据实际的图片数量和图片尺寸计算出容器的width
    var ul =this.imgUl= imgList.querySelector("ul")
    ul.style.width = imgSize * this.imgs.length + "px"
    imgList.style.width = imgSize + "px"
    //为分页器绑定单击响应函数
    var pagination= this.pagination = imgList.querySelector("#pagination_tank")
    var btns =this.btns= pagination.querySelectorAll("li")
    this.num = 0
    this.btnsClick(this,btns)    
    //开启定时器，每3s移动一张图片的距离
    this.autoChange(this,ul,"left",50,imgSize,this.num)    
}
    
Scroll.prototype = {
    //定义分页器的单击回调函数
    btnsClick(scroll, btns) {
        btns.forEach((btn, index) => {
            btn.onclick = function () {
                //若存在自动切换，则暂停自动切换的定时器
                scroll.timer && clearInterval(scroll.timer)
                scroll.changeStyle(scroll.btns, index)
                move(scroll.imgUl, "left", 50, -scroll.imgSize * index, function () {
                    if (index === (scroll.imgs.length - 1)) {
                        scroll.imgUl.style.left = 0 + "px"
                        index = 0;
                    }
                    scroll.num = index;
                    scroll.autoChange(scroll, scroll.imgUl, "left", 50, scroll.imgSize, scroll.num)
                })
            }
        })
    },
    //为分页器动态添加点击的类
    changeStyle(btns, num) {
        Array.prototype.slice.call(btns).forEach((btn, index) => {
            //判断btn的class中是否含有on的样式
            if (btn.getAttribute("class")) {
                btn.removeAttribute("class")
            }
            if (index === num) {
                btn.setAttribute("class", "on")
            }
        })
    },
    //初始化fragment  
    initFragment() {
        var fragment = document.createDocumentFragment()
        while (this.imgList.firstChild) {
            fragment.appendChild(this.imgList.firstChild)
        }
        return fragment;
    },
    //初始化轮播图
    initScroll(fragment) {
        //查看Li的数量
        //获取各个Li
        var lis = fragment.querySelectorAll("li")
        console.log(lis)
        //添加一个新的li，并将其内容设计为显示第一张图片
        //获取第一张图片的src
        var firstImgSrc = lis[0].getElementsByTagName("img")[0].src
        //将第一张图片添加到最后
        //获取ul
        var ul = fragment.querySelector("ul")
        this.addfirstImg(firstImgSrc, ul)
        this.imgs = ul.querySelectorAll("li")
        var pagination = new Pagination(lis.length)
        fragment.appendChild(pagination)

    },
    //自动轮播函数
    autoChange(scroll, target, direction, speed, imgSize, index) {
        scroll.timer = setInterval(() => {
            index++
            move(target, direction, speed, -imgSize * index, function resetIMG() {
                //解决最后一张图片切换至第一张时的切换效果
                if (index === (scroll.imgs.length - 1)) {
                    scroll.imgUl.style.left = 0 + "px"
                    index = 0;
                }
                scroll.changeStyle(scroll.btns, index)
            })

        }, 2000)
    },
    //为图片的最后添加第一张图片
    addfirstImg(firstSrc, parNode) {
        var li = document.createElement("li")
        li.innerHTML = `<img src="${firstSrc}" alt="">`
        parNode.appendChild(li)
    }
}
//使用JS来替代移动时的过渡效果
function move(target, direction, speed, distance, cb) {
    target.timer && clearInterval(target.timer)
    //得到目标的起始位置
    var start = parseInt(window.getComputedStyle(target, null)[direction])
    var length = start
    //定义定时器，每30ms执行一次回调函数
    target.timer = setInterval(function () {
        //累加速度的值，从而得到距离
        if (distance >= start) {
            length += speed
            if (length >= distance) {
                length = distance
            }
        } else {
            length -= speed
            if (length <= distance) {
                length = distance
            }
        }
        //判断距离的值是否会超过目标距离，若超过则修改距离，让距离等于目标距离

        //移动目标 
        target.style[direction] = length + "px"
        //当距离与目标距离相等时，结束定时，并执行回调函数
        if (length === distance) {
            clearInterval(target.timer)
            cb && cb()
        }
    }, 30)
}
//制作分页器
function   Pagination(count){
        var tank = document.createElement("ul")
        tank.setAttribute("id","pagination_tank")
        var btn = `<li></li>`
        var btns = ""
        for(let i = 0;i<count;i++){
            btns +=btn
        }
        tank.innerHTML = btns
        return tank
}

