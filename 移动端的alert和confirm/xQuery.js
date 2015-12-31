/**
 * Created by Administrator on 2015/11/20.
 *   前端小类库
 *   author xhy
 *   date 2015-12
 *   version 0.1
 *
 *   ________________________________________________________________________
 *   | //                                                                   |
 *   |   @1:事件系统未完成   (初步完成，虽然还有很大的缺陷，聊胜于无)              |
 *   |   @2:缓存系统未完成   (事件绑定用到了，但是未成系统~)                     |
 *   |                                                                      |
 *   |  @tips 因为主要是面向移动端的，所以基本没有做ie的兼容，只封装了             |
 *   |  一部分常会用到的方法，目前事件代理，动画效果都需要自己去做                 |
 *   |  考虑到文件的大小，动画就不做了，                                        |
 *   |  交给css3了                                                           |
 *   |                                                                      |
 *   ________________________________________________________________________
 */
(function(window){
    /*ajax对象构造函数*/
    function ajax(opts){//ajax方法
        var _opt = {
            url:'',
            method:'GET',
            data:'',
            async:true,
            cache:true,
            contentType:'application/x-www-form-urlencoded',
            success:function(){},
            error:function(){}
        };

        for(var key in opts){
            _opt[key] = opts[key];
        }
        this.opts = _opt;
    }

    /*
     * ajax原型方法
     * */
    ajax.prototype = {
        constructor:ajax,
        getSearch: function () {
            var search = '?';
            if(typeof this.opts.data === 'object'){//如果需要传递额外参数
                var args = [];
                for(var key in this.opts.data){
                    args.push(key+'='+this.opts.data[key]);
                }
                search += args.join('&');
            }else{
                search += '';
            }

            if(!this.opts.cache){
                search += '&timeStamp='+(+new Date());
            }
            if(search.length == 1){
                search = '';
            }

            return search;
        },
        initAjax : function () {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            if(this.opts.method.toUpperCase() == 'GET'){
                xhr.open('GET',this.opts.url+this.getSearch(),this.opts.async);
                xhr.send(null);
            }else{
                xhr.open('POST',this.opts.url,this.opts.async);
                xhr.setRequestHeader("Content-type", this.opts.contentType);
                xhr.send(this.getSearch().slice(1));
            }
            var success = this.opts.success,
                error = this.opts.error;


            xhr.onreadystatechange = function(evt){
                if(xhr.readyState == 4){
                    if(xhr.status === 200){
                        var data = xhr.responseText;

                        data = eval("(" + data + ")");
                        success(data,xhr);
                    }else{
                        error(xhr);
                    }
                }
            };

        }
    };

    /*
     *   缓存对象
     * */
    var cache = {},
        unique = '__xQuery__',
        getUnique = function(){
            return unique+(new Date().getTime());
        };

    /*
     * 核心构造函数
     * */
    /*
     * 可以接受的参数有
     * @ 选择器字串
     * @ nodeList或者元素数组
     * */
    function xQuery(selector){
        return new xQuery.fn.init(selector);
    }

    /*
     * 一些工具方法
     * */
    var _util = {
        //驼峰式
        camelCase: function (str) {
            str = str.replace(/^-/,'');
            return str.replace(/(-[\da-z])/gi,function(word,letter){
                return RegExp.$1.substr(1,1).toUpperCase();
            });
        },
        //获取对象类型
        getType : function(obj){
            var regx = /^\[object (\w+)\]$/ig,
                o = {};
            return regx.exec(o.toString.call(obj))[1].toLowerCase();
        },
        //判断是不是类数组元素（暂时不管window对象）
        isArraylike : function( obj ) {
            var length = obj.length,
                type = _util.getType( obj );

            if ( obj.nodeType === 1 && length ) {
                return true;
            }

            return type === "array" || type !== "function" &&
                ( length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj );
        },
        //获取所有参数
        getQuery : function () {
            var search = window.location.search.substr(1),
                tmp = {};
            search.split('&').map(function (v,i) {
                var _t = v.split('=');
                tmp[_t[0]] = _t[1];
            });
            return tmp;
        },
        //获取单个参数
        getQueryByName : function(name) {
            var reg = new RegExp("(?:^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[1]);
            return null;
        },
        //判断是不是元素节点
        isElement: function (ele) {
            if(typeof ele == 'string' || typeof ele == 'undefined'){
                return;
            }
            var nodeType = ele.nodeType;
            return nodeType && nodeType === 1;
        },
        /*
         * @ context 执行上下文
         * @ selector 选择器
         * @ direc 是否直接子元素
         * */
        findElement: function (context,selector,direc) {//查找元素
            var slcStr = '',
                ret;
            direc = typeof direc === 'undefined' ? ' ':' > ';
            if(_util.isElement(context)){//判断上下文是不是元素
                var id = context.id;
                if(id ){
                    slcStr = '#'+id+direc+selector;
                    //console.log(slcStr);
                    return [].slice.call(document.querySelectorAll(slcStr));
                }else{
                    var idStr = context.id = '__unique__'+new Date().getTime();//添加一个唯一的id，用于限定上下文
                    slcStr = '#'+idStr+direc+selector;
                    ret = document.querySelectorAll(slcStr);
                    context.removeAttribute('id');//用完以后删掉无用的id
                    //console.log(context.id);
                    return [].slice.call(ret);
                }

            }else if(typeof context == 'string'){//直接当做选择器
                return [].slice.call(document.querySelectorAll(context+direc+selector));
            }
        },
        //设置元素的唯一标识用完删除
        setUnique: function (elem) {
            var id = '__unique__'+new Date().getTime();
            elem.id = id;
            return id;
        },
        //判断两个元素之间是否存在包含关系
        ifContain: function (outerElem, innerElem) {
            var uniqueId = _util.setUnique(outerElem),
            //copyInner = innerElem.clone(true),
                copyInner = innerElem,
                flag = false;
            while(copyInner = copyInner.parentNode){
                //copyInner = copyInner.parentNode;
                if(copyInner.id === uniqueId){
                    flag = true;
                    break;
                }
            }
            outerElem.removeAttribute('id');//用完删除
            return flag;
        },
        // 判断是不是function
        isFunction:function(obj){
            return this.getType(obj) === 'function';
        },
        //判断是不是数组
        isArray: function (obj) {
            return this.getType(obj) === 'array';
        },
        //判断是不是window对象
        isWindow: function (obj) {
            return obj != null && obj === obj.window;
        },

        //判断是不是普通对象
        isPlainObject: function (obj) {
            // Not plain objects:
            //不是普通对象的特征
            // - Any object or value whose internal [[Class]] property is not "[object Object]"
            //内部类不是[Object Object] 也就是说借用Obect的提哦String返回的值不是object
            // - DOM nodes
            //DOM节点
            // - window
            // window对象
            if (this.getType( obj ) !== "object" || obj.nodeType || this.isWindow( obj ) ) {//三个特性有一个或一个以上不符合
                return false;
            }

            // Support: Firefox <20
            // The try/catch suppresses exceptions thrown when attempting to access
            // the "constructor" property of certain host objects, ie. |window.location|
            // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
            //这个是专门用来判断一些特殊浏览器的对象，比如说window.location对象
            try {
                if ( obj.constructor &&
                    !Object.prototype.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                    return false;
                }
            } catch ( e ) {
                return false;
            }

            // If the function hasn't returned already, we're confident that
            // |obj| is a plain object, created by {} or constructed with new Object

            //如果上面都没有返回，那我们就能确定当前这个对象是一个普通对象，是由字面量{}或者new Object()创建的
            return true;
        },

        //判断数组或类数组元素中是否包含指定的元素
        ifArrayIn: function (item,arr) {
            for(var i = 0,length = arr.length;i<length;i++){
                if(item === arr[i]){
                    return item;
                }
            }

            return null;
        },
        //把类数组对象转化成数组
        toArray: function (arrlike) {
            if(this.isArraylike(arrlike)){
                return [].slice.call(arrlike);
            }
            throw Error('该对象无法转换成数组对象');
            //return null;

        },

        //合并多个对象(从jQuery那边偷过来的)
        extend: function () {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},//第一个参数~如果第一个参数为boolean型，将执行深/浅克隆
                i = 1,
                length = arguments.length,//参数数量
                deep = false;//默认浅克隆

            // Handle a deep copy situation
            //深度克隆
            if ( typeof target === "boolean" ) {
                deep = target;
                target = arguments[1] || {};//克隆目标为第二个参数
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            //控制目标对象为一个字符串或者其他的类型|（可能在深克隆时）
            if ( typeof target !== "object" && _util.getType(target) === 'function' ) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            //根据参数判断是不是扩展jquery对象自身
            if ( length === i ) {
                target = this;//克隆目标为第一个jquery对象本身
                --i;//根据情况选择性忽略第一个参数（保证后续的遍历只会被执行一次）
            }

            //遍历除了克隆目标和深浅克隆标志参数外的所有参数
            for ( ; i < length; i++ ) {
                // Only deal with non-null/undefined values
                //只用来处理正常情况
                if ( (options = arguments[ i ]) != null ) {
                    // Extend the base object
                    for ( name in options ) {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        //避免死循环
                        if ( target === copy ) {//不理解什么时候会发生？？
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        //在合并普通对象或者数组的时候使用递归调用方式
                        if ( deep && copy && ( this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)) ) ) {
                            if ( copyIsArray ) {//是数组
                                copyIsArray = false;
                                clone = src && this.isArray(src) ? src : [];

                            } else {//是普通对象
                                clone = src && this.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            //递归调用本身进行克隆
                            target[ name ] = this.extend( deep, clone, copy );

                            // Don't bring in undefined values
                            //浅拷贝，且属性值不是undefined
                        } else if ( copy !== undefined ) {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;//返回被更改后的对象
        },
        //文档加载完成函数
        domReady : function (callback){
            document.addEventListener('DOMContentLoaded',callback);
        },
        //ajax函数
        ajax:function(opts){
            return new ajax(opts).initAjax();
        },
        //获取浏览器前缀
        getPrefix:function(){
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/rv:([\d.]+)/)) ? Sys.rv = s[1] :
                    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

            var  prefix =  /(msie|firefox|chrome|opera|rv|safari)/ig.exec(s)[1];
            switch(prefix){
                case 'msie':return 'ms';break;
                case 'rv':return 'ms';break;
                case 'firefox':return 'moz';break;
                case 'chrome':return 'webkit';break;
                case 'opera':return 'o';break;
                case 'safari':return 'webkit';break;
                default:return 'o';break;
            }
        },
        //空函数(在一些特定的场合用到)
        noop:function(){}
    };


    //获取所有的事件类型
    var allEvents = (function(){
        var x = document.createElement('div'),
            fEvent = /^on\w+$/i,
            tmp = [];
        for(var i in x){
            fEvent.test(i) && tmp.push(i.replace(/^on/i,''));
        }

        return tmp.join(' ');

    })();

    /*
     * 核心对象的原型方法
     * */


    xQuery.fn = xQuery.prototype = {
        /*
         *  异常情况处理
         *  1.传入的选择器为空
         *  2.如果选择集为空
         * */
        init:function(selector){
            var nodeList;
            /*判断所有非真值的情况，如 '',0，undefined*/
            if(!selector){
                nodeList = [];
            }else if(_util.isFunction(selector)){
                _util.domReady(selector);
                return this;
            } else if(typeof selector == 'string'){
                nodeList= document.querySelectorAll(selector);
            }else if(_util.isArraylike(selector)){
                nodeList = selector;
            }else{
                throw '你好歹传个对的参数啊！';
                //return null;
            }
            nodeList = _util.toArray(nodeList);//转成数组对象
            //return new xQuery(nodeList,selector);

            var that = this;
            this.domElemList = nodeList;
            [].map.call(this.domElemList,function(v,i){
                that[i] = v;
            });
            this.opIndex = 0;
            this.length = this.domElemList.length;
        },
        constructor:xQuery,
        //原生方法splice借用（这个其实没用，就是防止在控制台把整个对象打出来）
        splice:function(args){
            //[].splice.apply(this,arguments);
            //return this;
        },
        //这个没用的,就是用来作为xQuery对象的唯一
        __id__:'xuhuaiyuan',
        ////原生方法slice借用
        //slice: function (args) {
        //    [].slice.apply(this,arguments);
        //    return this;
        //},
        //原生方法each借用
        each: function (args) {
            [].map.apply(this,arguments);
            return this;
        },

        /*
         获取元素相对窗口的位置
         * */

        offset: function () {
            var opELem = this.getOpElem(),
                parentElem = opELem.offsetParent,
                oLeft = opELem.offsetLeft,
                oTop = opELem.offsetTop;
            while(parentElem.tagName.toLocaleLowerCase() !== 'body'){
                var borderWidth  = xQuery([parentElem]).css('border-width').slice(0,-2)*1;
                oLeft += (borderWidth+parentElem.offsetLeft);
                oTop += (borderWidth+parentElem.offsetTop);
                parentElem = parentElem.offsetParent;
            }

            return {
                left:oLeft,
                top:oTop
            }
        },
        /*
         * 元素宽度
         * */
        width:function(){
            return  this.getOpElem().offsetWidth;
        },

        /*
         * 元素高度
         * */
        height: function () {
            return  this.getOpElem().offsetHeight;
        },

        //获取当前操作元素
        getOpElem: function (index) {
            index  = index || this.opIndex;
            return this.domElemList[index];
        },
        //动画函数(为实现，这个还是有问题的)
        /*
         *  @param1 prop css对象
         *  @param2 speed 动画持续时间
         *  @param3 easing 动画曲线
         *  @param4 delay 延迟时间
         *  @param5 callback 完成后的回调
         * */
        animate:function(prop, speed, easing,delay,callback,innerUse){
            easing = easing || 'linear';
            var convertTime = function(speed){
                if(/^([^s]+)s$/i.test(speed)){
                    return speed;
                }else if(/^\d+$/i.test(speed)){
                    return speed*1/1000+'s';
                }

                return null;

            };
            speed = convertTime(speed);
            delay = delay && convertTime(delay) || '0s';
            callback = callback || _util.noop;
            var prefix = _util.getPrefix(),
                transStr = 'all '+speed+' '+easing+' '+delay;
            //prop['-'+prefix+'-transition'] = transStr;
            //prop['transition'] = transStr;

            var tmp = {};
            tmp['-'+prefix+'-transition'] = transStr;
            tmp['transition'] = transStr;
            if(!innerUse){
                this.css(tmp);
                this.animate(prop,speed,easing,delay,callback,true);
            }
            else{
                return this.css(prop);
            }

        },
        //获取元素
        get : function(index){
            //index不传也没事，直接交给getOpElem去处理空值
            return this.getOpElem(index);
        },
        //设置样式值
        css: function (prop,value) {
            var opElems = this.domElemList,
                _arguments = arguments;
            if(_arguments.length < 1){
                return null;
            }else if(_arguments.length === 1 && typeof _arguments[0] !== 'object'){
                prop = _util.camelCase(prop);
                return window.getComputedStyle(this.getOpElem(),null)[prop];
            }

            [].map.call(opElems,function (opElem) {
                if(_arguments.length === 1){
                    for(var obj in _arguments[0]){
                        opElem.style[_util.camelCase(obj)] = _arguments[0][obj];
                    }
                }else{
                    prop = _util.camelCase(prop);
                    /*这里单次的操作style可能会有性能的问题，
                     * 下次换成cssText方式*/
                    opElem.style[prop] = value;
                }
            });

            return this;

        },
        //获取className的工具函数
        _getClassArr:function (callback) {
            var opElems = this.domElemList;
            [].map.call(opElems,function(v,i){
                var classArr = v.className.split(/\s+/);
                v.className = callback(classArr).trim();
            });
            return this;
        },
        //添加类
        addClass:function(className){
            return this._getClassArr(function(classArr){
                if(classArr.indexOf(className) === -1){
                    classArr.push(className);
                }
                return classArr.join(' ');
            });
        },
        //判断是都有类
        hasClass:function(className){
            var opElem = this.getOpElem();

            return opElem.className.indexOf(className) !== -1;
        },
        //移除class
        removeClass: function (className) {
            return this._getClassArr(function(classArr){
                var index = classArr.indexOf(className);
                if(index !== -1){
                    classArr.splice(index,1);
                }
                return classArr.join(' ');
            });
        },
        //切换class
        toggleClass:function(className){
            return this._getClassArr(function (classArr) {
                var index = classArr.indexOf(className);
                if(index !== -1){
                    classArr.splice(index,1);
                }else{
                    classArr.push(className);
                }

                return classArr.join(' ');
            });
        },
        //创建fragment的公用方法
        buildFragment:function(arg,callback){
            /*
             * 可以接受以下参数类型
             * 1. 字符串类型
             * 2. 元素集合
             * 3. xQuery对象
             * */
            var fragment = document.createDocumentFragment(),
                container = document.createElement('div'),
                opElems = this.domElemList,
                cN,
                obj =   {
                    'string': function () {
                        container.innerHTML = arg;
                        cN = container.childNodes;
                        for (var i = 0; i < cN.length; i++) {
                            fragment.appendChild(cN[i].cloneNode(true));
                        }

                        [].map.call(opElems, function (opElem, i) {
                            callback(fragment.cloneNode(true),opElem);
                        });

                    },
                    'array'://直接当做domList
                    //直接鸭式辩型,反正都把arg当做节点数组,如果不是,直接强行弄成数组
                        function(){
                            if(arg.length == 0){
                                arg = [arg];
                            }
                            for (var i = 0; i < arg.length; i++) {
                                fragment.appendChild(arg[i].cloneNode(true));
                            }

                            [].map.call(opElems, function (opElem, i) {
                                callback(fragment.cloneNode(true),opElem);
                            });
                        },

                    'xQuery'://xQuery对象的话,那就取出domList
                        function () {
                            var domList = arg.domElemList;
                            for (var i = 0; i < domList.length; i++) {
                                fragment.appendChild(domList[i].cloneNode(true));
                            }

                            [].map.call(opElems, function (opElem, i) {
                                callback(fragment.cloneNode(true),opElem);
                            });
                        }

                },
                type = _util.getType(arg);
            if(type === 'string'){
                obj['string']();
            }else if(type === 'obj' && arg.__id__ !== 'xuhuaiyuan'){
                obj['array']();
            }else if(arg.__id__ === 'xuhuaiyuan'){
                obj['xQuery']();
            }
            return this;

        },
        //在元素前面插入元素
        insertBefore: function (str) {
            return this.buildFragment(str,function(elems,opElem){
                opElem.parentNode.insertBefore(elems, opElem);
            });
        },
        //在元素后面插入元素
        insertAfter: function (str) {
            return this.buildFragment(str,function(elems,opElem){
                if(opElem.nextSibling){//如果有后项元素节点
                    opElem.parentNode.insertBefore(elems,opElem.nextSibling);
                }else{//如果没有的话
                    opElem.parentNode.appendChild(elems);
                }
            });
        },
        //向文档中append元素
        append:function(str){
            return this.buildFragment(str, function (elems,opElem) {
                opElem.appendChild(elems);
            });
        },
        //向文档中prepend元素
        prepend: function (str) {
            return this.buildFragment(str, function (elems,opElem) {
                if(opElem.firstChild){//如果存在子节点的话
                    opElem.insertBefore(elems,opElem.firstChild);
                }else{
                    opElem.appendChild(elems);
                }

            });
        },
        //移除元素
        //这里其实还应该加上一个移除时候的dom事件解绑，
        // 懒得做了，自己在用的时候注意就好了
        remove:function(){
            var opElem = this.getOpElem(),
                opElems = this.domElemList;
            opElem.parentNode.removeChild(opElem);
            /*this.domElemList = */[].shift.call(opElems);
            //console.log(this.domElemList);
            //this.opIndex = 0;
            return this._stateChange(opElems);
        },
        //选择
        //为防止引用传递对原来对象的影响，这里返回一个独立的克隆对象
        eq:function(index){
            index = index||0;
            if(index > this.length-1){
                throw 'Array out of Range';
            }
            return this._stateChange([this.domElemList[index]]);
        },
        //回到第一个元素
        end:function(){
            return this.eq();
        },
        //事件绑定
        /*
         *  param [proxyObj] 事件代理对象(这里被希望传入的是一个选择器字符串)
         *  param eventType 事件类型
         *  param callback 事件回调函数
         *  param [data] 事件所需的数据，可以不传
         *  tips
         *  有些事件无法冒泡,暂时不处理了,不用代理的方式来绑定
         *  事件即可
         *
         *  、、、、、、、、、、、、、、、、、、、、、
         *    在这里使用的一个缓存对象cache，用于自主
         *    控制事件处理函数的管理，在一定程度上可以
         *    避免可能的内存泄露所带来的性能浪费
         *  、、、、、、、、、、、、、、、、、、、、、
         * */
        bind:function(/*proxyObj,eventType,callback,data*/){
            var opElem  = this.getOpElem(),
                self = this,
            //进行一些参数修正
                funcIndex = (function(args){
                    var index = -1;
                    [].map.call(args,function(v,i){
                        if(_util.isFunction(v)){
                            index = i+1;
                        }
                    });

                    return index;
                })(arguments),
                obj = {},
            /*(这个就不循环绑定了，只绑定选择集中的操作元素)
             *考虑实际情况下，代理元素一般都是一个特定的对象，故在此放弃了循环
             * 如有需要，在外部使用时候进行循环绑定
             * 当需要批量绑定时，推荐使用代理绑定方式
             *
             * 这里还有一些情况没有进行处理
             * 1、当一个对象被两次或两次以上代理时，后面的代理会覆盖前面的代理
             * 2、批量绑定多个事件的情况没有予以处理
             * 3、这种处理方式确实很不优雅，会元素上生成一堆无用的data-uuid属性，
             *    这样的实现方式还需要斟酌，这里就留待以后处理了
             * 4、同一个元素绑定两次相同事件会造成后面的绑定覆盖前面的绑定，这个是个巨大的！！硬伤！！，
             *    暂时还没有完美的解决方案，先研究一些jQuery的事件系统，再回来改这里的实现
             * */
                bindEvent = function (opElem,ob) {
                    var uniqueId = getUnique();
                    //设置uuid
                    self.eq(0).data('uuid',uniqueId);
                    cache[uniqueId] = cache[uniqueId] || {};
                    if(typeof ob.proxyObj === 'undefined'){//无代理
                        cache[uniqueId][ob.type] = function(event){
                            event.data = ob.data;
                            ob.callback(event);
                        };

                        opElem.addEventListener(ob.type,cache[uniqueId][ob.type],false);

                    }else if(typeof ob.proxyObj === 'string'){
                        cache[uniqueId][ob.type] = function(event){
                            event.data = ob.data;
//                            var targetArr = _util.findElement(opElem,ob.proxyObj);

                            var targetArr = self.domElemList;
                            for(var i = 0;i<targetArr.length;i++){
                                //console.log(_util.ifContain(targetArr[i],event.target));
                                if(_util.ifContain(targetArr[i],event.target)){
                                    event.preventDefault();
                                    ob.callback.call([targetArr[i]],event);
                                    break;
                                }
                            }

                        };

                        $(ob.proxyObj).getOpElem().addEventListener(ob.type,cache[uniqueId][ob.type],false);

                    }
                    // opElem.addEventListener(ob.type,cache[uniqueId][ob.type],false);
                };

            //根据funcIndex判断是否有代理
            if(funcIndex === 2){//在2位置上,说明没有proxy
                obj = {
                    type : arguments[0],
                    callback : arguments[1],
                    data : arguments[2]
                }

            }else if(funcIndex === 3){//在3位置上,说明有proxy
                obj = {
                    proxyObj : arguments[0],
                    type : arguments[1],
                    callback : arguments[2],
                    data : arguments[3]
                }
            }

            bindEvent(opElem,obj);

            return this;

        },
        //事件绑定解除
        unbind:function(eventType/**/){
            var self = this,
                opElem = this.getOpElem(),
                uuid = self.eq(0).data('uuid');

            opElem.removeEventListener(eventType,$.cache[uuid][eventType]);
            delete $.cache[uuid][eventType];//移除缓存的事件处理函数

            return this;
        },
        //执行一些dom操作，这个会破坏链式操作(这里指操作对象会被替换)
        _stateChange: function (domElem) {
            domElem = _util.isArraylike(domElem) ? domElem : [domElem];
            //domElem = _util.getType(domElem).toLowerCase() !== 'array' ? [domElem]:domElem;
            var copy = _util.extend(true,{},this);
            copy.domElemList = domElem;
            [].map.call(copy.domElemList,function(v,i){
                copy[i] = v;
            });
            copy.opIndex = 0;
            copy.length = copy.domElemList.length;
            return copy;
        },
        //找到父元素，
        parent:function(){
            var opElem = this.getOpElem();
            return this._stateChange(opElem.parentNode);
        },
        //孩子元素
        children:function(selector){
            var opElem = this.getOpElem(),
                retElem;
            selector = selector ? selector : '*';
            retElem = _util.findElement(opElem,selector,true);
            return this._stateChange(retElem);
        },
        //递归寻找子元素
        find: function (selector) {
            var opElem = this.getOpElem(),
                retElem;
            selector = selector ? selector : '*';
            retElem = _util.findElement(opElem,selector);
            return this._stateChange(retElem);
        },
        //向上查找最近的祖先元素
        closest:function(selector){
            if(!selector){
                return this._stateChange(document.body);
            }
            var opElem = this.getOpElem(),
                copyInner = opElem,
                retElem,
                targetElems = document.querySelectorAll(selector);
            while(copyInner = copyInner.parentNode){
                if(retElem = _util.ifArrayIn(copyInner,targetElems)){
                    return this._stateChange(retElem);
                }
            }

            return this._stateChange(document.body);

        },
        //缓存数据
        data:function(dataName,value){
            //这里直接用了html5的dataset属性
            var opElems = this.domElemList,
                opElem = this.getOpElem();
            if(arguments.length === 1){
                if(typeof arguments[0] !== 'object'){//值的获取
                    return opElem.dataset[_util.camelCase(dataName)];
                }else{//以对象的方式传入的(值的设置)
                    [].map.call(opElems,function(outerV,i){//这里有个双重循环了，可以想办法优化一下
                        for(var obj in dataName){
                            outerV.dataset[obj] = dataName[obj];
                        }
                    });
                }

            }else if(arguments.length === 2){
                [].map.call(opElems,function(v,i){
                    v.dataset[dataName] = value;
                });
            }

            return this;

        },
        //移除缓存数据
        removeData:function(dataName){
            var opElems = this.domElemList,
                opElem = this.getOpElem();
            if(typeof dataName !== 'object'){
                delete opElem.dataset[dataName];
            }else if(_util.getType(dataName) === 'array'){
                dataName.map(function(v,i){
                    delete opElem.dataset[v];
                });
            }
            return this._stateChange(opElems);
        },
        //后向查找元素
        next: function (selector) {
            var opElem = this.getOpElem(),
                retElems,
                copyElem = opElem,
                tmp = [];
            //console.log(opElem.nextElementSibling);
            if(selector === undefined){//查找直接后项元素
                var ret = opElem.nextElementSibling || [];
                return this._stateChange(ret);
            }

            retElems = _util.findElement(opElem.parentNode,selector,true);
            while(copyElem = copyElem.nextElementSibling){
                if(_util.ifArrayIn(copyElem,retElems)){
                    tmp.push(copyElem);
                }
            }
            return this._stateChange(tmp);
        },
        //前向查找元素
        prev: function (selector) {
            var opElem = this.getOpElem(),
                retElems,
                copyElem = opElem,
                tmp = [];
            if(selector === undefined){//查找直接后项元素
                var ret = opElem.previousElementSibling || [];
                return this._stateChange(ret);
            }

            retElems = _util.findElement(opElem.parentNode,selector,true);
            while(copyElem = copyElem.previousElementSibling){
                if(_util.ifArrayIn(copyElem,retElems)){
                    tmp.push(copyElem);
                    //return this._stateChange(copyElem);
                }
            }
            return this._stateChange(tmp);
        },
        //设置元素attribute属性
        attr: function (attr,value) {
            var opElem = this.getOpElem(),
                opElems = this.domElemList;
            if(arguments.length === 1){//获取
                if(typeof attr == 'string'){
                    return opElem.getAttribute(attr);
                }else{
                    for(var i in attr){
                        [].map.call(attr[i],function(v,i){
                            v.setAttribute(attr,value);
                        });
                    }
                }

            }else if(arguments.length == 2){
                [].map.call(opElems, function (v,i) {
                    v.setAttribute(attr,value);
                });
            }else{
                return opElem.attributes;//返回元素的attributes属性
            }

            return this._stateChange(opElems);
        },
        //移除属性
        removeAttr: function (attr) {
            var opElem = this.getOpElem();
            if(typeof attr !== 'object'){
                delete opElem.removeAttribute(attr);
            }else if(_util.getType(attr) === 'array'){
                attr.map(function(v,i){
                    delete opElem.removeAttribute(v);
                });
            }
            return this;

        },
        //text和html的公用方法
        _get_set_dom:function(text,type/*1 for text | 2 for html*/){
            var opElem = this.getOpElem(),
                opElems = this.domElemList;
            //console.log(typeof text);
            if(typeof text === 'undefined'){//表示是获取(那就只操作第一个匹配)
                if(type == 1){
                    return opElem.textContent;
                }else{
                    return opElem.innerHTML;
                }
            }else{//表示是设置(对所有匹配集合中得元素操作)
                [].map.call(opElems, function (v,i) {
                    if(type == 1){
                        v.textContent = text;
                    }else{
                        v.innerHTML = text;
                    }
                });
            }
            return this;
        },

        //获取或设置text
        text: function (text) {
            return this._get_set_dom(text,1);
        },

        //设置获取innerHTML
        html: function (strHtml) {
            return this._get_set_dom(strHtml,2);
        },

        //置空元素
        empty:function(){
            return this.html('');
        },

        //在结果集中查找某个元素或者某批元素
        /*
         * tips 只能进行简单的一些匹配
         * 类选择器 .class
         * id选择器 #id
         * 元素选择器 div
         *
         * */
        filter:function(selector){
            selector = selector.trim();
            var opElems = this.domElemList,
                testArr = [//测试选择器类型
                    {
                        slc:selector.slice(1),
                        reg:/^\./,
                        handler:function(ele){
                            return ele.className.indexOf(this.slc) !== -1;
                        }
                    },
                    {
                        slc:selector.slice(1),
                        reg:/^#/,
                        handler:function(ele){
                            return ele.id === this.slc;
                        }
                    },
                    {
                        slc:selector,
                        reg:/([a-zA-Z.]+)/g,
                        handler:function(ele){
                            return ele.tagName.toLowerCase() === this.slc;
                        }
                    }
                ],
                useObj = {},
                tmp = [];

            //遍历测试选择器类型对象
            for(var i = 0;i<testArr.length;i++){
                if(testArr[i].reg.test(selector)){
                    useObj = testArr[i];
                    break;
                }
            }
            //如果有匹配到的话
            if(typeof useObj.reg === 'undefined'){
                return this._stateChange([]);
            }

            //把符合条件的元素都放入一个临时数组中
            [].map.call(opElems,function(v,i){
                if(useObj.handler(v)){
                    tmp.push(v);
                }
            });

            return this._stateChange(tmp);
        }

    };

    /*把xQuery的原型对象赋值给init函数的原型，用以构造工厂方法*/
    xQuery.fn.init.prototype = xQuery.fn;


    var  _$ = xQuery;

    /*
     * 合并工具类到全局对象中
     * */
    for(var i in _util){
        _$[i] = _util[i];
    }

    /*
     * 放弃对全局$的控制权
     * */
    var noConflit = function(deep/*是否连xQuery也给放弃掉*/){
        deep && (window.xQuery = null);
        window.$ = null;
        return _$;
    };

    _$.cache = cache;//缓存对象
    _$.noConflit = noConflit;//放弃$的控制权
    _$.version = 'xQuery_0.1';//版本号
    _$.getTime = function(){//获取当前时间
        return +new Date();
    };

    window.xQuery = window.$ = _$;//赋值给全局变量

})(window,undefined);
