// ==UserScript==
// @name Calls and comments
// @version 1.2
// @match https://adm.avito.ru/users/user/info/*
// @require http://code.jquery.com/jquery-latest.js
// @updateURL   https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/callscomments.js
// @downloadURL   https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/callscomments.js
// @require https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @grant GM_xmlhttpRequest
// ==/UserScript==
var serverURL = "10.10.36.50";
var commentBlock =
'<div class="comment-block" id="comment-block">'+
'  <div class="panel panel-default panel-comments">'+
'    <div class="panel-heading text-center" style="font-size: 16px; font-weight: bold;">Комментарии</div>'+
'    <div class="panel-body" id="forComments">'+
'    </div>'+
'    <div class="panel-footer">'+
'      <div class="row text-center">'+
'        <div class="col-md-5"><button class="btn btn-default close-comments-button">Закрыть</button></div>'+
'        <div class="col-md-7"><button class="btn btn-default firecatcher-button">Открыть в firecatcher</button></div>'+
'      </div>'+
'    </div>'+
'   </div>'+
'</div>';
var categoryBlock =
    "<div class='category-block ah-indicators-item' style='color:#5cb85c;'>"+
    "  <span class='fill-call-span'>• Заполнить звонок"+
    "    <div class='hidden-category-picker'>"+
"  <div class='btn-group btn-group-justified col-lg-3' data-toggle='buttons' id='catButtonGroup'>"+
" <label class='btn btn-default btn-sm category-label' value='1' >"+
"        <input type='radio' autocomplete='off' >RE"+
"    </label>"+
"    <label class='btn btn-default btn-sm category-label' value='2'>"+
"        <input type='radio' autocomplete='off' >TR"+
"    </label>"+
"    <label class='btn btn-default btn-sm category-label' value='3'>"+
"        <input type='radio' autocomplete='off' >Job"+
"    </label>"+
"    <label class='btn btn-default btn-sm category-label' value='4'>"+
"        <input type='radio' autocomplete='off' >Serv"+
"    </label>"+
"    <label class='btn btn-default btn-sm category-label' value='5'>"+
"        <input type='radio' autocomplete='off' >Gen"+
"    </label>"+
"  </div>"+
    "    </div>"+
    "  <span>"+
    "</div>";
var numOfCalls = iJump = counter = 0;
var oktell = "http://"+serverURL+"/firecatcher/oktell/calls?name=Avito_get_file_by_id_conn&startparam1=";
var sheet = document.createElement('style');
sheet.innerHTML = "#comment-block{"+
" z-index: 1;"+
" position: fixed;"+
" overflow-y: hidden;"+
" right: 1%;"+
" top: 6%;"+
" background : white;"+
" width: 30vw; "+
" visibility : hidden;"+
" padding-top:4px;"+
" padding-top:4px;"+
" opacity: 0.5;"+
"}"+
"#comment-block.On{"+
" visibility : visible;"+
" overflow-y: hidden; "+
" overflow-x: hidden; "+
" background : #eee;"+
" border: solid 1px #f0f0f0;"+
" border-radius : 5px;"+
" z-index : 5;"+
" opacity : 1;"+
" transition:all linear 0.3s;"+
"}"+
"#addCommentBlock{"+
" overflow: auto;"+
" resize:none;"+
"}"+
".panel-comments{"+
" margin-bottom: 0 !important;"+
"}"+
".table-scroll{ "+
" height: 70vh;"+
" overflow: auto;"+
" margin: 0 0 20px;"+
" max-width: 750px;"+
"}"+
".breakable{"+
" word-break: break-all;"+
" word-wrap: break-word;"+
"}"+
".fill-call-span {"+
" cursor:pointer;"+
"}"+
".fill-call-span .hidden-category-picker{"+
" display:none;"+
" width:300px;"+
" margin-left:-50px;"+
"}"+
".hidden-category-picker.On{"+
" display: block;"+
" position:absolute;"+
"}"+
"#commentForm h1{"+
" margin-left:3px;"+
"}";
//updated version
document.body.appendChild(sheet);
var userID = getId(window.location.href);
var catNum = 0;
var login = URL = commentData = callData = agentName = "";
$(document).ready(function(){
agentName = $('ul.nav>li:last-child>a').text().trim();
if(window.location.href.indexOf('/user/info') != -1){
login = $('a.js-user-id').attr("data-user-id");
callURL = "http://"+serverURL+"/firecatcher/api/call/user/"+login + "/all";
console.log(URL);
commentGetRequest(0);
var calls = GM_xmlhttpRequest({
method: "GET",
headers: {"Accept": "application/json"},
url: callURL,
onreadystatechange: function(res) {
},
onload: function(res) {
numOfCalls = JSON.parse(res.response).length;
if (numOfCalls >0) {
    var lastCall = JSON.parse(res.response)[numOfCalls-1];
$("#commentClick").after("<div class='ah-indicators-item' style='color: rgb(92, 184, 92); cursor: pointer;' title='"+lastCall.agent.russianName+" "+moment.unix(lastCall.timeStart/1000).format("DD.MM.YY HH:mm")+"' id='callClick'>• Звонки("+numOfCalls+") </div>");}
else {$("#commentClick").after("<div class='ah-indicators-item' style='color:rgb(189, 189, 189); cursor: pointer;' id='callClick'>• Звонки("+numOfCalls+") </div>");}
$("#callClick").after(categoryBlock);
$("#callClick").click(function(){
var url = "http://"+serverURL+"/firecatcher/?calls=true&id="+login;
window.open(url, '_blank');
});
$(".fill-call-span").click(function(){
    $(".hidden-category-picker").toggleClass('On');
});
$('.category-label').click(function(){
         console.log($(this).attr("value"));
var url = "http://"+serverURL+"/firecatcher/?lastcall=true&id="+login+"&cat="+$(this).attr("value");
window.open(url, '_blank');
});
}
});
}
});
function getId(url){
return url.substring(url.lastIndexOf('/')+1);
}
function commentGetRequest(newComment){
commentURL = "http://"+serverURL+"/firecatcher/api/comment/user/" + login;
GM_xmlhttpRequest({
method: "GET",
headers: {"Accept": "application/json"},
url: commentURL,
onreadystatechange: function(res) {
},
onload: function(res) {
var numOfComments = JSON.parse(res.response).length;
commentData = JSON.parse(res.response);
    if (!counter){
$(".form-group.js-passwords").after(commentBlock);
    counter++;
}
    if (newComment){document.getElementById("commentClick").innerHTML = '• Комментарии('+numOfComments+')';
                    document.getElementById("commentClick").style.color = '#5cb85c';}
    else {if (numOfComments >0) {
$("[data-indicator=REPremium]").after("<div class='ah-indicators-item' style='color: rgb(92, 184, 92); cursor: pointer;' id='commentClick'>• Комментарии ("+numOfComments+") </div>");}
else {$("[data-indicator=REPremium]").after("<div class='ah-indicators-item' style='color:rgb(189, 189, 189); cursor: pointer;' id='commentClick'>• Комментарии("+numOfComments+") </div>");}}
$("#commentClick").click(getComments);
$(".close-comments-button").click(function() {
   $("#comment-block").removeClass('On');
   });
$(".firecatcher-button").click(function() {
    var url = "http://"+serverURL+"/firecatcher/?comments=true&id="+login;
    window.open(url, '_blank');
});
}
});
}
function postComment(zEvent){
       var comment = {
      "avitoUserId":login,
      "postTime": new Date().getTime(),
      "message": agentName + "~"+$('#addCommentBlock').val()
  }
    var addCommentURL = "http://"+serverURL+"/firecatchertest/api/comment/addFromAdm" ;
  RestPost(comment, addCommentURL);
    setTimeout(function() {commentGetRequest(1);}, 500);
    setTimeout(function() {$("#commentClick").trigger("click");}, 1000);
}
function getComments(zEvent){
$("#comment-block").toggleClass('On');
document.getElementById("forComments").innerHTML = '';
var addComment =  '<div class="row"><div class="col-lg-12"><div class="input-group"><textarea class="form-control" id="addCommentBlock" rows="3" placeholder="Добавить комментарий"></textarea>'+
          '<span class="input-group-addon btn btn-success post-comment">+</span>'+
          '</div></div></div>'; // поле добавления комментария
var outputComments = thead = tbot = ''; // обнуление инфы и объявление переменных
if (commentData.length !== 0) { // если есть комментарии
thead = '<div class="row"><div class="table-scroll col-lg-12"><table id="commentTable" class="table table-striped table-hover" ><thead><tr><th >Агент</th><th>Комментарий</th></tr></thead><tbody>'; // шапка
tbot = '</tbody></table></div></div>'; // низ
for (var i = 0; i < commentData.length; i++) { // тело
var message = commentData[i].message;
if (commentData[i].agent === null) {
    console.log(message.indexOf("~"));
    var nametag = (message.indexOf("~")>0) ? message.substring(0, message.indexOf("~")) : "Из админки";
    message = message.substring(message.indexOf("~")+1, message.length);                               }
    else {var nametag = commentData[i].agent.username;}
var timetag = moment.unix(commentData[i].postTime/1000).format("DD.MM.YY HH:mm");
var elem = document.getElementById("div-table-content-"+i);
outputComments += '<tr class="table-row"><td>'+timetag +'\n'+ nametag +'</td><td class="breakable"><div class="table-content" id="div-table-content-'+i+'">'+message+'</div></td></tr>';
} // отрисовка комментариев
}
else { outputComments='<div class="text-center">На данной учетной записи еще не оставляли комментариев</div>'; } // если комментариев нет
document.getElementById("forComments").innerHTML = thead + outputComments + tbot + addComment;
 $(".post-comment").click(postComment);
}
function RestPost(data, url){
 GM_xmlhttpRequest({
                method: "POST",
                url:  url,
                data: JSON.stringify(data),
                headers: {"Content-Type": "application/json; charset=cp1251",},
                onload: function(res) {

                }
        });
}