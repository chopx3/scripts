// ==UserScript==
// @name         Comments, calls and repremium
// @match        https://adm.avito.ru/users/user/info/*
// @version      1.5
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @updateURL    https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/reprem.js
// @downloadURL  https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/reprem.js
// @grant        GM_xmlhttpRequest
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
" <span class='fill-call-span'>• Заполнить звонок"+
"  <div class='hidden-category-picker'>"+
"   <div class='btn-group btn-group-justified col-lg-3' data-toggle='buttons' id='catButtonGroup'>"+
"     <label class='btn btn-default btn-sm category-label' value='1' >"+
"        <input type='radio' autocomplete='off' >RE"+
"     </label>"+
"     <label class='btn btn-default btn-sm category-label' value='2'>"+
"        <input type='radio' autocomplete='off' >TR"+
"     </label>"+
"     <label class='btn btn-default btn-sm category-label' value='3'>"+
"        <input type='radio' autocomplete='off' >Job"+
"     </label>"+
"     <label class='btn btn-default btn-sm category-label' value='4'>"+
"        <input type='radio' autocomplete='off' >Serv"+
"     </label>"+
"     <label class='btn btn-default btn-sm category-label' value='5'>"+
"        <input type='radio' autocomplete='off' >Gen"+
"     </label>"+
"   </div>"+
"  </div>"+
" <span>"+
"</div>";
var ourDivBlock = '<div class="reprem-block" id=reprem-block>'+
'  <div class="panel panel-default reprem-panel">'+
'    <div class="panel-heading text-center">Клиент</div>'+
'    <div class="panel-body">'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">ID:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-1 reprem-text-id input-number" value=1>'+
'          <label for="" class="reprem-label reprem-label-1"></label>'+
'        </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">Компания:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-2 reprem-text-company input-textarea" value=2>'+
'          <label for="" class="reprem-label reprem-label-2 reprem-label-narrow"></label>'+
'              </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">Контакт:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-3 reprem-text-contact input-textarea" value=3>'+
'          <label for="" class="reprem-label reprem-label-3 reprem-label-narrow"></label>'+
'              </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">Info:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-4 reprem-text-info input-textarea" value=4>'+
'          <label for="" class="reprem-label reprem-label-4 reprem-label-narrow"></label>'+
'              </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">Телефон 1:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-5 reprem-text-mainPhone input-number" value=5>'+
'          <label for="" class="reprem-label reprem-label-5"></label>'+
'              </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"> <label class="reprem-input">Телефон 2:</label></div>'+
'        <div class="col-md-8 reprem-text reprem-text-6 reprem-text-secondPhone input-number" value=6>'+
'          <label for="" class="reprem-label reprem-label-6"></label>'+
'              </div>'+
'      </div>'+
'      <div class="row reprem-row">'+
'        <div class="col-md-4 reprem-icon"><label class="reprem-input">Другие:</label></div>'+
'          <div class="col-md-8 reprem-text reprem-text-7 reprem-text-addPhones input-textarea" value=7>'+
'          <label for="" class="reprem-label reprem-label-7 reprem-label-narrow"></label>'+
'          </div>'+
'      </div>'+
'    </div>'+
'    <div class="panel-footer">'+
'      <div class="row reprem-button-row">'+
'        <div class="col-md-4 reprem-icon"><button class="btn btn-default close-button">Закрыть</button></div>'+
'        <button class="btn btn-default reprem-button edit-button hidden-button">Редактировать</button>'+
'        <button class="btn btn-default reprem-button save-button hidden-button">Сохранить</button>'+
'        <button class="btn btn-default reprem-button create-button hidden-button">Создать</button>'+
'      </div>'+
'    </div>'+
'  </div>';
var numOfCalls = iJump = counter = 0;
var regexp = /\"/g;
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
".reprem-panel{"+
"margin-bottom: 0px !important; "+
"}" +
"#addCommentBlock{"+
" overflow: auto;"+
" resize:none;"+
"}"+
".panel-comments{"+
" margin-bottom: 0 !important;"+
"}"+
".table-scroll{ "+
" max-height: 50vh;"+
" overflow: auto;"+
" margin: 0 0 20px;"+
" max-width: 750px;"+
"}"+
".breakable{"+
" word-break: break-all;"+
" word-wrap: break-word;"+
"}"+
".reprem-block{"+
" z-index: 1;"+
" position: fixed;"+
" overflow-y: hidden;"+
" right: 1%;"+
" top: 6%;"+
" min-height: 465px;"+
" width: 30vw;"+
" background : white;"+
" visibility : hidden;"+
" padding-top:4px;"+
" opacity: 0.5;"+
"}"+
".reprem-block.On{"+
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
 ".reprem-row{ "+
"    line-height: 40px; "+
"} "+
".reprem-label-narrow{ "+
"    line-height: 20px; "+
"    padding-top: 10px; "+
"    overflow-x: hidden; "+
"} "+
".reprem-icon{ "+
"    font-size: 14px; "+
"    text-align: center; "+
"} "+
".reprem-icon-last{ "+
"    margin: 7px 0; "+
"} "+
".reprem-button-row{ "+
"    text-align: center; "+
"} "+
".reprem-button{ "+
"    margin: 0 30px; "+
"} "+
".hidden-button{ "+
"    display: none; "+
"} "+
".reprem-input{ "+
"    margin: 3px 0 !important; "+
"} "+
".reprem-label{ "+
"    margin-bottom: 0 !important; "+
"} "+
".reprem-button-activator{ "+
"    display:none; "+
"} "+
".reprem-input-textarea{ "+
"    resize:none; "+
"    overflow:auto; "+
"} "+
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
"}";
document.body.appendChild(sheet);
var userID = getId(window.location.href);
var catNum = 0;
var login = URL = commentData = callData = agentName = companyName = "";
 var host = "http://"+serverURL+"/firecatchertest/api/";
 var updateRepremURL = host +"premium/update";
  var getRepremURL = host +"premium/avitoid/";
 var addRepremURL = host +"premium/add";
var repremInfoId = 0;
var reprem = "";
var dataToDraw = "";
$(document).ready(function(){

    agentName = $('ul.nav>li:last-child>a').text().trim();
    if(window.location.href.indexOf('/user/info') != -1){
    login = $('a.js-user-id').attr("data-user-id");
    companyName = $('input[name="name"]').attr("value");
    var commentURL = host +"comment/user/" + login;
    var callURL = host +"call/user/"+login + "/all";
    console.log(URL);
    commentGetRequest(0);
        getRepremRequest();
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
reprem = GM_xmlhttpRequest({
  method: "GET",
  headers: {"Accept": "application/json"},
  url: getRepremURL+login,
  ignoreCache : true,
  onreadystatechange: function(res) {
  },
  onload: function(res) {
    console.log(res);
    setTimeout(function() {
    var ourResponse = (res.response === undefined) ? undefined : JSON.parse(res.response).id ;
    $(".form-group.js-passwords").after(ourDivBlock);
        $("[data-indicator=REPremium]").attr('id', 'repremClick');
        $("[data-indicator=REPremium]").css('cursor', 'pointer');
    if (ourResponse != undefined) {$("[data-indicator=REPremium]>span").after("<span style='color:red;'> ✔ </span>");}
      else {$("[data-indicator=REPremium]>span").after("<span style='color:red;'> ✖ </span>");}
    $("#repremClick").click(function(){
    $(".reprem-block").toggleClass('On');
    console.log(dataToDraw);
    getRepremData(dataToDraw);
});
   $(".edit-button").click( editButton);
   $(".save-button").click( saveButton);
   $(".create-button").click( createButton);
   $(".close-button").click(function() {
   $(".reprem-block").removeClass('On');
   });
}, 1000) ;
}
});
}
});
function createButton(zEvent){
 var clientNewData = {
                    "avitoId" : login,
                    "username" : companyName.replace(regexp, "''"),
                    "admPhone" : "89000000000",
                    "contactPhone" : "89000000001"
                };
                RestPost(clientNewData, addRepremURL);
                location.reload();
}
function saveButton(zEvent){
 var premiumClientData = [];
            $(".reprem-input").each(function() {
                var index = $(this).attr('name');
                var classArray = document.getElementsByClassName("reprem-text-"+index);
                var savedValue = $(this).val();
                premiumClientData[index-1] = savedValue;
                if ($(this).hasClass('input-number')){
                    classArray[0].innerHTML = '<label class="reprem-label-'+index+' reprem-label reprem-input input-number" name="'+index+'" value="'+savedValue+'">'+savedValue+'</label>';
                }
                if ($(this).hasClass('input-textarea')){
                    console.log("poof");
                    classArray[0].innerHTML = '<label class="reprem-label-'+index+' reprem-label reprem-input input-textarea reprem-label-narrow" name="'+index+'" value="'+savedValue+'">'+savedValue+'</label>';
                }
            });
            var clientNewData = {
                    "id" : repremInfoId,
                    "avitoId" : login,
                    "username" : premiumClientData[1],
                    "contactPerson" : premiumClientData[2],
                    "comments" : premiumClientData[3],
                    "admPhone" : premiumClientData[4],
                    "contactPhone" : premiumClientData[5],
                    "additionalPhones" : premiumClientData[6]
                };
                dataToDraw = clientNewData;
                console.log(clientNewData);
                RestPost(clientNewData, updateRepremURL);
                oneActiveButton(".edit-button");
}
function editButton(zEvent){
    $(".reprem-text").each(function() {
                var index = $(this).attr('value');
                var classArray = document.getElementsByClassName("reprem-text-"+index);
                var savedValue = $(".reprem-label-"+index).text();
                if ($(this).hasClass('input-number')){
                if (index != 1) {
                    classArray[0].innerHTML = '<input type="number" class="reprem-label-'+index+' form-control reprem-input input-number" name="'+index+'" value="'+savedValue+'">';}
                }
                if ($(this).hasClass('input-textarea')){
                    classArray[0].innerHTML = '<textarea class="reprem-label-'+index+' form-control reprem-input reprem-input-textarea input-textarea" name="'+index+'" rows=2  value="'+savedValue+'">'+savedValue+'</textarea>';
                }
                oneActiveButton(".save-button");
            });
}
function RestPost(data, url){
 GM_xmlhttpRequest({
                method: "POST",
                url:  url,
                data: JSON.stringify(data),
                headers: {"Content-Type": "application/json; charset=cp1251",},
                onload: function(res) {
                getRepremData(JSON.parse(res.response));
                }
        });
}
function getId(url){
    return url.substring(url.lastIndexOf('/')+1);
}
function getRepremRequest(zEvent){
 GM_xmlhttpRequest({
  method: "GET",
  headers: {"Accept": "application/json"},
  url: getRepremURL+login,
  ignoreCache : true,
  onreadystatechange: function(res) {
  },
  onload: function(res) {
    console.log(res.response);
    if (res.response === undefined){dataToDraw = "";}
    else {dataToDraw = JSON.parse(res.response);}
  }
});
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
  };
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
function getRepremData(data){
    var repremFields = ["avitoId", "username", "contactPerson", "comments", "admPhone", "contactPhone", "additionalPhones"];
        console.log(data.avitoId+"id");
        console.log(data+"data");
        repremInfoId = data.id;
        if (data.avitoId>1){
        oneActiveButton(".edit-button");
        var regExpMultiLines = /(\n)+/gm;
        for (var i = 0; i < 7; i++) {
            var info = (data[repremFields[i]] === null) ? "" : data[repremFields[i]];
      if (repremFields[i] ===  "additionalPhones"){
      info = info.replace(regExpMultiLines, "\n").trim();
      }
            $(".reprem-label-"+(i+1)).text(info);
        }
    }
    else {
        oneActiveButton(".create-button");
        $(".reprem-label").text("");
        $(".reprem-label-1").text("Нет информации о клиенте");
        $(".reprem-input-textarea").text("");
    }
}
function oneActiveButton(value){
        $(".reprem-button").addClass("hidden-button");
        $(value).removeClass("hidden-button");
}
