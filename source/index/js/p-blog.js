//alert($("#p-tag li a").length);
//$('#p-tag li a').addClass("tag-bgcolor-1");
var obj = $("#p-tag li a"); // obj
var objspan = $("#p-tag li a span"); // obj
var len = obj.length; // len
//alert(len);
var n = 4;
var str = 'tag-bgcolor-';
for (var i = 1; i <= len; i++) {
    if (i % 4 == 0) {
        obj.eq(i - 1).addClass(str + 1);
        objspan.eq(i - 1).addClass(str + 1);
    }
    if (i % 4 == 1) {
        obj.eq(i - 1).addClass(str + 2);
        objspan.eq(i - 1).addClass(str + 2);
    }
    if (i % 4 == 2) {
        obj.eq(i - 1).addClass(str + 3);
        objspan.eq(i - 1).addClass(str + 3);

    }
    if (i % 4 == 3) {
        obj.eq(i - 1).addClass(str + 4);
        objspan.eq(i - 1).addClass(str + 4);
    }
};
var urlstr = location.href;  
$(".blog-nav a").each(function () {  
    if ((urlstr) === $(this).attr('href')) {  
        $(this).addClass('active');
    } else {  
        $(this).removeClass('active');  
    }  
});  
function getEmote(obj) {
    var emote = $(obj).parent().parent().siblings('.emote-img');
    var is_display = emote.css("display");
    if (is_display == 'none') {
        var emote_img = 1;
    } else {
        var emote_img = 0
    }
    if (emote_img) {
        emote.show();
        var alt = ['Kiss', 'Love', 'Yeah', '啊！', '背扭', '顶', '抖胸', '88', '汗', '瞌睡', '鲁拉', '拍砖', '揉脸', '生日快乐', '摊手', '睡觉', '瘫坐', '无聊', '星星闪', '旋转', '也不行', '郁闷', '正Music', '抓墙', '撞墙至死', '歪头', '戳眼', '飘过', '互相拍砖', '砍死你', '扔桌子', '少林寺', '什么？', '转头', '我爱牛奶', '我踢', '摇晃', '晕厥', '在笼子里', '震荡'];
        var str = '';
        for (var i = 1; i < 41; i++) {
        str += '<img src="http://www.piaoyifa.com/uploads/emote/' + i + '.gif" title="' + alt[i - 1] + '">';
    };
    emote.html(str);
} else {
    emote.hide();
}
}
// 点击添加表情
$('html').on('click', '.emote-img img',
function(event) {
var str = $(this).prop("outerHTML"); //用来获取当前节点的html代码
//console.log($(this).parent().siblings("#area").append(str));
$(this).parent().siblings('.box-content').focus(); //.append(str);//在文字光标后面插入元素;
insertHtmlAtCaret(str); // 在文字前面插入元素
$(this).parents('.emote-img').hide();
});

/**
* 在textarea光标后插入内容
* @param  string  str 需要插入的内容
*/
function insertHtmlAtCaret(str) {
var sel, range;
if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var el = document.createElement("div");
        el.innerHTML = str;
        var frag = document.createDocumentFragment(),
        node,
        lastNode;
        while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
} else if (document.selection && document.selection.type != "Control") {
    document.selection.createRange().pasteHTML(str);
}
}
// trim
function myTrim(x) {
return x.replace(/^\s+|\s+$/gm,'');
}
// 删除提示和样式
function del_hint(obj) {
var word = myTrim($(obj).text());
if (word == '请先登录后发表评论' || word == '请先登录后回复评论') {
    $(obj).text('');
    $(obj).css('color', '#333');
}
}
function reply(obj) {
console.log($('.media-list'));
var boxTextarea = $('.media-list').find('.box-textarea');
if (boxTextarea.length == 1) {
    boxTextarea.remove();
}
//alert(boxTextarea.length);
var aid=$(obj).attr('aid');
var pid=$(obj).attr('pid');
var parent_name=$(obj).attr('parent_name');
    var images = $(".fa").attr("src");
    var str = '<div class="box-textarea"><div class="box-content" contenteditable="true" onfocus="del_hint(this)">请先登录后发表评论</div><ul class="emote-submit"><li class="emote col-sm-10 col-xs-10"><img class="fa fa-smile-o" onclick="getEmote(this)" src="'+images+'"></li><li class="submit-button col-sm-2 col-xs-2"><input type="button" class="btn btn-info pull-right" value="评 论" aid="'+aid+'" pid="'+pid+'" parent_name="'+parent_name+'" onclick="comment(this)"></li></ul><div class="emote-img "></div></div>';
    $(obj).parents('.media-body').eq(0).append(str);
}



            // 发布评论
            function comment(obj){
                        var contents = $(obj).parents('.box-textarea').eq(0).find('.box-content').html();
                        if(contents != '' && contents != '请先登录后发表评论'){
                            var aid=$(obj).attr('aid'),
                                pid=$(obj).attr('pid'),
                                parent_name = $(obj).attr('parent_name'),
                                postData={
                                    "aid":aid,
                                    "pid":pid,
                                    "contents":contents
                                };
                            var url = "http://127.0.0.1/comments/add";
                            $.post(url, postData, function(data) {
                                var dataObj = JSON.parse(data);
                                var newpid = dataObj.cid; // 评论pid
                                var uid = dataObj.uid; // 用户id
                                var nickname = dataObj.nickname; // 用户
                                var headpath = 'http://127.0.0.1/uploads/avatar/';
                                var headimg = headpath+uid+".jpg";
                                var replyName = $(obj).attr('username');
                                var create_time = dataObj.create_time;
                                // 获取当前时间
                                var nickName=$('#b-login-word .b-nickname').text();
                                if(pid==0){
                                    // pid为0表示新增评论
                                    var str = '<li class="media"><div class="media-left" href="#"><img class="media-object" src="'+headimg+'" alt="通用的占位符图像"></div><div class="media-body"><span class="p-time">'+create_time+'</span><span class="p-reply" onclick="reply(this)" pid="'+newpid+'" aid="'+aid+'" parent_name="'+nickname+'"ref="javascript:;"> 回复 </span><p class="p-comment">'+nickname+' ：'+contents+'</p></p></div></li>';
                                    $('.media-list').prepend(str);
                                }else{
                                    // pid不为0表示是回复评论
                                    var str = '<div class="media"><div class="media-left" href="#"><img class="media-object" src="'+headimg+'" alt="通用的占位符图像"></div><div class="media-body"><span class="p-time">'+create_time+'</span><span class="p-reply" onclick="reply(this)" pid="'+newpid+'" aid="'+aid+'" parent_name="'+parent_name+'" href="javascript:;"> 回复 </span><p class="p-comment">'+nickname+' @ '+parent_name+'：'+contents+'</p></p></div></div>';
                                    //$(obj).parents(".media-body").css({"color":"red","border":"2px solid red"});
                                    $(obj).parents('.media-body').eq(-1).append(str);
                                    $(obj).parents('.box-textarea').eq(0).remove();
                                }
                            });
                        }
            }

