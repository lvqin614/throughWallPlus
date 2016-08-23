var utils=(function(){
    var flag='getComputedStyle' in window;
    function jsonParse(str){
        return 'JSON' in window?JSON.parse(str):eval('('+str+')');
    }
    function rnd(n,m){
        n=Number(n);
        m=Number(m);
        if(isNaN(n) || isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var tmp=m;
            m=n;
            n=tmp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }
    function makeArray(arg){
        var ary=[];
        if(flag){
            ary=Array.prototype.slice.call(arg);
        }else{
            for(var i=0; i<arg.length; i++){
                ary.push(arg[i])
            }
        }
        return ary;
    }
    function getByClass(strClass,parent){
        parent||(parent=document);
        if(flag){
            return this.makeArray(parent.getElementsByClassName(strClass));
        }
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        var nodeList=parent.getElementsByTagName('*');
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var curEle=nodeList[i];
            var bOk=true;
            for(var j=0; j<aryClass.length; j++){
                var reg=new RegExp('\\b'+aryClass[j]+'\\b');
                if(!reg.test(curEle.className)){
                    bOk=false;
                    break;
                }
            }
            if(bOk){
                ary.push(curEle);
            }
        }
        return ary;
    }
    function hasClass(curEle,cName){
        var reg=new RegExp('(^| +)'+cName+'( +|$)');
        return reg.test(curEle.className);
    }
    function addClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            if(!this.hasClass(curEle,aryClass[i])){
                curEle.className+=' '+aryClass[i];
            }
        }
    }
    function removeClass(curEle,strClass){
        var aryClass=strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
        for(var i=0; i<aryClass.length; i++){
            var reg=new RegExp('\\b'+aryClass[i]+'\\b');
            if(reg.test(curEle.className)){
                curEle.className=curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
            }
        }
    }
    function getCss(curEle,attr){
        var val=null;
        var reg=null;
        if(flag){
            val=getComputedStyle(curEle,false)[attr];
        }else{
            if(attr==='opacity'){
                val=curEle.currentStyle.filter; //'alpha(opacity=10)'
                reg=/^alpha\(opacity[=:](\d+)\)$/i;
                return reg.test(val)?reg.exec(val)[1]/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        reg=/^[+-]?((\d|([1-9]\d+))(\.\d+)?)(px|pt|rem|em)$/i;
        return reg.test(val)?parseInt(val):val;
    }
    function setCss(curEle,attr,value){
        if(attr==='float'){
            curEle.style.cssFloat=value;
            curEle.style.styleFloat=value;
            return;
        }
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+(value*100)+')';
            return;
        }
        var reg=/^(width|height|top|right|bottom|left|((margin|padding)(top|right|bottom|left)?))$/i;
        if(reg.test(attr)){
            if(!(value==='auto' || value.toString().indexOf('%')!==-1)){
                value=parseFloat(value)+'px';
            }
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        if(opt.toString()!=='[object Object]') return;
        for(var attr in opt){
            this.setCss(curEle,attr,opt[attr]);
        }
    }
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==='string'){
            var arg3=arguments[2];
            if(typeof  arg3==='undefined'){
                return this.getCss(curEle,arg2);
            }else{
                this.setCss(curEle,arg2,arg3);
            }
        }
        if(arg2.toString()==='[object Object]'){
            this.setGroupCss(curEle,arg2);
        }
    }
    function offset(curEle){
        var l=curEle.offsetLeft;
        var t=curEle.offsetTop;
        var par=curEle.offsetParent;
        while(par){
            if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                l+=par.clientLeft;
                t+=par.clientTop;
            }
            l+=par.offsetLeft;
            t+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:l,top:t}
    }
    function win(attr,value){
        if(typeof  value==='undefined'){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=document.body[attr]=value;
    }
    function getChildren(curEle,tagName){
        var nodeList=curEle.childNodes;
        var ary=[];
        for(var i=0; i<nodeList.length; i++){
            var curEle=nodeList[i];
            if(curEle.nodeType===1){
                if(tagName !==undefined){
                    if(curEle.tagName.toLowerCase()===tagName.toLowerCase()){
                        ary.push(curEle);
                    }
                }else{
                    ary.push(curEle);
                }
            }
        }
        return ary;
    }
    function prev(curEle){
        if(flag){
            return curEle.previousElementSibling;
        }
        var pre=curEle.previousSibling;
        while(pre && pre.nodeType !== 1){
            pre=pre.previousSibling;
        }
        return pre;
    }
    function prevAll(curEle){
        var pre=this.prev(curEle);
        var ary=[];
        while(pre){
            ary.unshift(pre);
            pre=this.prev(pre);
        }
        return ary;
    }
    function next(curEle){
        if(flag){
            return curEle.nextElementSibling;
        }
        var nex=curEle.nextSibling;
        while(nex && nex.nodeType!==1){
            nex=nex.nextSibling;
        }
        return nex;
    }
    function nextAll(curEle){
        var nex=this.next(curEle);
        var ary=[];
        while(nex){
            ary.push(nex);
            nex=this.next(nex);
        }
        return ary;
    }
    function sibling(curEle){
        var ary=[];
        var pre=this.prev(curEle);
        var nex=this.next(curEle);
        if(pre) ary.push(pre);
        if(nex) ary.push(nex);
        return ary;
    }
    function siblings(curEle){
        var ary1=this.prevAll(curEle);
        var ary2=this.nextAll(curEle);
        return ary1.concat(ary2);
    }
    function firstChild(curEle){
        var childs=this.getChildren(curEle);
        return childs[0];
    }
    function lastChild(curEle){
        var childs=this.getChildren(curEle);
        return childs[childs.length-1];
    }
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    function appendChild(parent,curEle){
        parent.appendChild(curEle);
    }
    function prependChild(parent,curEle){
        var first=this.firstChild(parent);
        if(first){
            parent.insertBefore(curEle,first);
        }else{
            parent.appendChild(curEle);
        }
    }
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    function insertAfter(newEle,oldEle){
        var nex=this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex);
        }else{
            oldEle.parentNode.appendChild(newEle);
        }
    }
    function Linear(t,b,c,d){
        return  t*c/d+b;
    }
    return {
        jsonParse:jsonParse,
        rnd:rnd,
        makeArray:makeArray,
        getByClass:getByClass,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getCss:getCss,
        setCss:setCss,
        setGroupCss:setGroupCss,
        css:css,
        offset:offset,
        win:win,
        getChildren:getChildren,
        prev:prev,
        prevAll:prevAll,
        next:next,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        firstChild:firstChild,
        lastChild:lastChild,
        index:index,
        appendChild:appendChild,
        prependChild:prependChild,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        Linear:Linear
    }
})();