// ==UserScript==
// @name         Helper plus
// @version      3.2
// @author       izayats@avito.ru
// @include      https://adm.avito.ru/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @require      https://raw.githubusercontent.com/phstc/jquery-dateFormat/master/dist/jquery-dateFormat.min.js
// @downloadURL  https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/helperplus.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==

'use strict';
var serverURL = "10.10.36.50";
var showRemovedHistory = true;
var showVerificationButton = true;
var phoneVerificationCheck = false;
var checkEmails = true;
var usersComment = true;
var login = "";
var userID = getId(window.location.href);
var comments = [];
var COMM_AMOUNTS = 20;
var MAX_LEN = 600;
var removed = "<span class='item-status  grey'>Removed</span>";
var archived = '<span class="item-status  grey">Archived</span>';
var notSync = 0;
var status_colors = {
    "Blocked":"RED",
    "Rejected":"#FF00BF",
    "Added":"#40FF00",
    "Activated":"#40FF00",
    "Unblocked":"#40FF00"
};
var firstTime = true;
var angryUsers = "";
$(document).ready(function(){
  var todayTime = moment().endOf("day").format("DD/MM/YYYY HH:mm");
  var minusMonthTime =  moment().startOf("day").subtract(30, "days").format("DD/MM/YYYY HH:mm");
  var timeToFind =  minusMonthTime + " - " + todayTime;
  $(".items").after(`<a href="/items/search?user_id=${userID}&date=${timeToFind}&status%5B%5D=rejected&status%5B%5D=blocked" class="items">bl+rej(30)</a>`);
  $("td.item-checkbox").click(function() {
  if ($(this).find("input").prop('checked')){
  $(this).find("input").prop('checked', false)
  }
  else {$(this).find("input").prop('checked', true)}
})
    if(showRemovedHistory)
        turnOnRemovedHistory();
    if(showVerificationButton)
        turnOnPhoneVerificationBut();
    if(phoneVerificationCheck)
        turnOnPhoneVerificationCheck();
    if(checkEmails)
        turnOnEmailChecking();
    if(usersComment)
        turnOnUsersComment();
    if(window.location.href.indexOf('/user/info') != -1){
        login = $('.dropdown-toggle').slice(-1)[0].innerHTML.match(/([^\n]+)/i)[1];
    }
if(window.location.href.indexOf('/item/info') != -1){
    $("button[value=Добавить]").after('<button type="submit" class="btn btn-info pull-left" id="task865"> <i class="glyphicon glyphicon-plus"></i> 865 </button>');
    $("#task865").after('<button type="submit" class="pull-left btn btn-primary col-md-offset-1" id="tn"> <i class="glyphicon glyphicon-plus"></i> ТН </button>');
    $("#tn").after('<button type="submit" class="pull-left btn btn-warning col-md-offset-1" id="pushUp"> <i class="glyphicon glyphicon-plus"></i> Push </button>');
    var itemId = getId(window.location.href);
    var userId = getId($($(".form-group>.col-xs-9>a")[1]).attr("href"));
    $('#task865').bind("click",function(){
    var message = "Таск 865, активация, объявление №" + itemId;
    $.post('https://adm.avito.ru/comment',
                   {objectTypeId:1,
                    objectId:itemId,
                    comment: message
            }).fail(function(resp){
                alert('Ошибка: ' + resp);
                throw 'comment Error...';
            });
    });
    $('#tn').bind("click",function(){
        var message = "Техническая неполадка, объявление №" + itemId;
     addCommentOnPage("https://adm.avito.ru/comment",{
                        objectTypeId:2,
                        objectId:userId,
                        comment: message});
     $.post('https://adm.avito.ru/comment',
                   {
                objectTypeId:1,
                objectId:itemId,
                comment: message
            }).fail(function(resp){
                alert('Ошибка: ' + resp);
                throw 'comment Error...';
            });
    });
    $('#pushUp').bind("click",function(){
     var message = "Техническая неполадка, поднятие, №" + itemId;
     addCommentOnPage("https://adm.avito.ru/comment",{
                        objectTypeId:2,
                        objectId:userId,
                        comment: message});
     $.post('https://adm.avito.ru/comment',
                   {
                objectTypeId:1,
                objectId:itemId,
                comment: message
            }).fail(function(resp){
                alert('Ошибка: ' + resp);
                throw 'comment Error...';
            });
    });
    }
    if (window.location.href.indexOf('/helpdesk') != -1){
    checkAngryUser(); }
    var sum = 0;
    $('.text-right.red').each(function(){
        var reg = /[^\d]([\d\s]+).*/i;
        sum += parseInt($(this).html().match(reg)[1].replace(' ',''));
    });
var currentPage = window.location.href;
setInterval(function(){
    if (currentPage != window.location.href && window.location.href.indexOf('/helpdesk') != -1)    {
        currentPage = window.location.href;
        checkAngryUser();
        console.log("check");
    }
},2000);
});
function checkAngryUser(zEvent){
var URL = "http://"+serverURL+"/firecatchertest/api/angry/all";
GM_xmlhttpRequest({
method: "GET",
headers: {"Accept": "application/json"},
url: URL,
onreadystatechange: function(res) {
},
onload: function(res) {
    angryUsers = JSON.parse(res.response);
}
});
    setTimeout(function(){
    var emailToCheck = "";
    emailToCheck = $("a.hd-ticket-header-email").text();
    console.log(angryUsers.length);
    for (var i=0; i<angryUsers.length;i++){
        if (emailToCheck.indexOf(angryUsers[i].email)>0 && angryUsers[i].active) {
            $(".hd-ticket-header-title").after("<div class='row text-center'><b style='font-size:20px;color:red;'>Жалобы данного пользователя обрабатываются в отдельном <a href="+angryUsers[i].ticket+"?limit=30&p=1&sortField=reactionTxtime&sortType=asc>тикете</a></b></div>");
            break;}
    }}, 500);
}
function turnOnRemovedHistory(){
    $('body').append('<div id="item_info" style="position: fixed; left: 100px; top: 60px;border: 4px double black; overflow:auto;max-width:600px;max-height:500px;z-index:250;background-color:WHITE;visibility:hidden;"></div>');
    $('.form-row:nth-child(4)').after('<div class="form-row"><input type="button" id="checkRemoved" value="История удаленных" class = "btn btn-default mb_activate green"/>');
    $('#checkRemoved').bind("click",function(){
        if(!firstTime)
            return;
        firstTime = false;
        var items = document.getElementById('items').rows;
        for(var i = 1;i < items.length;i++){
            var row = items[i].innerHTML;
            if(row.indexOf('Removed') != -1 || row.indexOf('Archived') != -1){
                var isRemoved = (row.indexOf('Removed') != -1);
                notSync++;
                checkItemHistory($(row).find('.item_title').attr('href'), items[i], isRemoved);
            }
        }
    });
    $('#item_info').click(function(){ $('#item_info').css('visibility','hidden'); });
    $('input[name="query"]').before($('<input id="gnum" type="button" value="|">').click(function(){var e = $('input[name="query"]')[0]; var r = $(e).val().match(/\d{9,}/g);r && $(e).val(r.join('|'));}));
    $('input[name="itemIds"]').before($('<input id="gnum" type="button" value=",">').click(function(){var e = $('input[name="itemIds"]')[0]; var r = $(e).val().match(/\d{9,}/g);r && $(e).val(r.join(','));}));
    $('#checkRemoved').after($('<input type="button" value="ТН combo" class = "btn btn-default mb_activate green"/>').click(function(){
        bleachItems();
        pushUpItems();
        addCommentToItem(true);
        collectItemsNumbers(true);
    }))
    $('#checkRemoved').after($('<input type="button" value="Bleach" class = "btn btn-default mb_activate green"/></div>').click(bleachItems));
    $('#checkRemoved').after($('<input type="button" value="Push up" class = "btn btn-default mb_activate green"/>').click(pushUpItems));
    $('#checkRemoved').after($('<input type="button" value="Оставить комментарий" class = "btn btn-default mb_activate green"/>').click(function(){
        addCommentToItem(false);
    }));
    $('#checkRemoved').after($('<input type="button" value="Номера объявлений" class = "btn btn-default mb_activate green"/>').click(function(){
        collectItemsNumbers(false);
    }));
     $('#checkRemoved').after($('<input type="button" value="Открыть каждое" class = "btn btn-default mb_activate green"/>').click(function(){
        var s = [];
        var counter = 0;
        $('input[name^="item_id"]:checked').each(function(){
            s[counter]= $(this).val();
            counter++;
        });
        if(s.length > 0){
            for (var i=0;i<s.length;i++){
            var url = "https://adm.avito.ru/items/item/info/"+s[i];
            window.open(url, '_blank');
            }
        }
    }));
     $('#checkRemoved').after($('<input type="button" value="Поиск по выделенным" class = "btn btn-default mb_activate green"/>').click(function(){
        var s = "";
        $('input[name^="item_id"]:checked').each(function(){
           s += $(this).val() +'|';
        });
        if(s.length > 0){
            var url = "https://adm.avito.ru/items/search?query="+s;
            window.open(url, '_blank');
        }
    }))
    ;
}
function bleachItems(zEvent){
if(confirm('Вы уверены что хотите отбелить выделенные объявления?')){
            $('input[name^="item_id"]:checked').each(function(){
                $.get('https://adm.avito.ru/items/item/bleach/' + $(this).val()).fail(function(resp){alert('Ошибка: ' + resp);});
            });
            location.reload();
        }
}
function pushUpItems(zEvent){
        if(confirm('Вы уверены что хотите поднять выделенные объявления?')){
            $('input[name^="item_id"]:checked').each(function(){
                $.get('https://adm.avito.ru/items/item/push2up/' + $(this).val()).fail(function(resp){alert('Ошибка: ' + resp);});
            });
            location.reload();
        }
    }
function addCommentToItem(isTN){
        var comment = (isTN) ? "ТН, поднятие в поиске, блич" : prompt('Введите пожалуйста комментарий');
        if(comment == null)
            return;
        $('input[name^="item_id"]:checked').each(function(){
            $.post('https://adm.avito.ru/comment',
                   {
                objectTypeId:1,
                objectId:$(this).val(),
                comment:comment
            }).fail(function(resp){
                alert('Ошибка: ' + resp);
                throw 'comment Error...';
            });
        });
        alert('комментарий был успешно оставлен');
    }
function collectItemsNumbers(isTN){
        var s = '';
        $('input[name^="item_id"]:checked').each(function(){
            s += $(this).val() +'|';
        });
        if(s.length > 0){
            var toClipBoard = (isTN) ? "ТН, Объявления №" + s.substring(0,s.length-1) + " , поднятие в поиске, bleach" : s.substring(0,s.length-1);
            GM_setClipboard(toClipBoard);
        }
    }
function checkItemHistory(link, row, status){
    var statusText = (status) ? removed : archived;
    $(row).find('.item-status.grey').parent().html(statusText + "<span style='color:#FF8C00;'>(Проверяем...)</span>");
    $.get( "https://adm.avito.ru" + link+"/frst_history?history=-100", function( data ) {
        var tables = "";
        var array = [];
        var tableMid = "";
        var tableTop = `
        <div class="table-scroll">
          <table class="table table-striped">
        <thead>
            <tr> <th width="145">Дата</th> <th>Admin event</th> <th>Статус</th></tr>
        </thead>
        <tbody class="js-tbody">`;
        var tableBot = `
        </tbody>
        </table>
        </div>`;
        console.log(data);
        var dataLength = (data.length >= 3) ? 3 : data.length;
        for (var i = 0; i< dataLength; i++){
            var time = data[i].formatedDate;
            var event = data[i].event;
            var action = data[i].admin;
            tableMid+=`<tr> <td>${time} </td> <td>${action}</td> <td>${event}</td></tr>`;
        }
        var fullTable = tableTop + tableMid + tableBot;
        $(row).find('.sort-time').html(fullTable);
        $(row).find('.item-status.grey').parent().html("");
        $(row).find('.Spoiler').append("<div id='item_page_data' style='visibility:hidden;width:1px;height:1px;'>" + fullTable + "</div>");
        notSync--;
        tryBind();
    });
}
function tryBind(){
    if(notSync == 0)
        $(".Spoiler").click(function () {
            if($('#item_info').css('visibility') == 'hidden'){
                $('#item_info').css('visibility','visible');
                $('#item_info').html(
                    $(this).find('#item_page_data').html());
            }else{
                $('#item_info').css('visibility','hidden');
            }
        });
}

function turnOnPhoneVerificationBut(){
    if($('#phones') && $('#phones').length){
        $('input[name^=phone]').each(function(){
            if($(this).attr('value').length && !$(this).parents('tr').find('.i-verify-unchecked').length)
                $(this).parents('tr').append('<td  style="width:10px;"><span class="verification-but" style="background-color:BLACK;color:white;cursor:pointer;border:5px solid BLACK;">О</span></td>');
        });
    }
    $('.verification-but').unbind().click(function(){
        var url = prompt('Открепить для(вставьте ссылку на учетную записи или адрес электнронной почты):');
        if(url == ''){
            alert('Введите адрес!');
            return;
        }
        if(url != null){
            var phone = $(this).parents('tr').find('input[name^=phone]').attr('value');
            var o = {id:userID,phone:phone};
            var mailPattern = /.+@.+\..+/i;
            if(mailPattern.test(url)){
                try{
                    addCommentOnPage("https://adm.avito.ru/comment",{
                        objectTypeId:2,
                        objectId:userID,
                        comment:phone + " откреплен для " + url});
                    unverify(o);
                    return;
                }catch(e){alert(e);}
            }
            $.get(url).done(
                function(){
                    try{
                        addCommentOnPage("https://adm.avito.ru/comment",{
                            objectTypeId:2,
                            objectId:getId(url),
                            comment:phone + " откреплен от " + window.location.href});
                        addCommentOnPage("https://adm.avito.ru/comment",{
                            objectTypeId:2,
                            objectId:userID,
                            comment:phone + " откреплен для " + url});
                        unverify(o);
                    }catch(e){
                        alert(e);
                    }
                }).fail(
                function(){
                    alert('Введен неправильный адрес');
                });
        }
    });
}
function addCommentOnPage(link,params){
    $.post(link, params).fail(function(e){
        throw "Ошибка, что то пошло не так:(";
    });
}
function getId(url){
    return url.substring(url.lastIndexOf('/')+1);
}
function unverify(o){
    $.post('https://adm.avito.ru/users/user/phone/cancel_confirm',o).done(
        function(){
            alert('Номер успешно откреплен');
            location.reload();
        }
    ).fail(
        function(){alert('Не удалось открепить номер');}
    );
}

var htmlmask = /<(?:.|\n)*?>/gm;
var linkmask = /(https?:\/\/[^\s,]+)/gm;
var imgmask = /(.jpe?g)|(.gif)|(.png)|(.bmp)|(.icon)/gi;
function preprocess(msg){
    msg = msg.replace(htmlmask,'');
    var counter = 0;
    msg = msg.replace(linkmask,function(a){
        if(imgmask.test(a)){
            return '</p><img src="' + a + '" style="border:10px solid #FFEBCD;"><p>';
        }
        counter++;
        return '<a href="' + a + '" target="_blank" style="color:green;"> ' +(a.length < 60 ? a : 'ссылка №' +  (counter) +'('+ extractDomain(a) +')') + '</a>';
    });
    return msg.replace(/\n/g,'<br>');
}

function extractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
}
var emailHistory = null;
var emailMask = /[^@]*@.*/i;
function turnOnEmailChecking(){
    $('.js-history.history.pseudo-link').click(function(){
        var interval = setInterval(
            function(){
                var historyPopUp = $('.popover-content');
                if(historyPopUp.length != 0){
                    clearInterval(interval);
                    if(emailHistory != null){
                        markFakeEmails();
                    }else{
                        getEmailHistory();
                    }
                }
            },300
        );
    });
}
function markFakeEmails(){
    $('.popover-content').find('td').each(function(){
        var s = $(this).text();
        if(emailMask.test(s)){
            $(this).css('color', (emailHistory[s]?"green":"red"));
        }
    });
}
function getEmailHistory(){
    emailHistory = {};
    emailHistory.len = 0;
    $('.popover-content').find('td').each(function(){
        var s = $(this).text();
        if(emailMask.test(s)){
            if(emailHistory[s] == undefined){
                emailHistory.len++;
                emailHistory[s] = true;
            }
        }
    });
    for(var o in emailHistory){
        if(o != 'len'){
            (function(e){
                $.get('https://adm.avito.ru/users/fakeemail?email=' + encodeURIComponent(e))
                    .done(function(data){
                    if(data.indexOf('Emails not found') == -1 && data.indexOf('&#10003;') == -1){
                        emailHistory[e] = false;
                    }
                    emailHistory.len--;
                    if(emailHistory.len == 0){
                        markFakeEmails();
                    }
                })
                    .fail(function(){
                    alert('Ошибка при запросе истории email.');
                });
            })(o);
        }
    }
}
function turnOnUsersComment(){
    if(location.href.indexOf('users/search') == -1)
        return;
    $('.table.table-striped tr td:first-child').css('width','100');
    $($('.table.table-striped tr th:first-child')[0]).append(
        $('<input type="checkbox">').click(function(){
            $('.commentsCheck').prop('checked', $(this).prop('checked'));
        })
    );
    $('.table.table-striped tr td:first-child').each(
        function(){
            var id = $(this).html();
            $(this).html(
                '<input type="checkbox" class="commentsCheck" value="' + id + '">' + $(this).html()
            );
        }
    );
    $('button[type="submit"]').after(
        $('<input type="button" value="Оставить комментарии" class = "btn btn-default mb_activate green"/>').click(
            function(){
                var comment = prompt('Введите комментарий пожалуйста');
                if(comment == null)
                    return;
                $('.commentsCheck').each( function(){
                    if(!$(this).prop('checked')){
                        return;
                    }
                    $.post('https://adm.avito.ru/comment',
                           {
                        objectTypeId:2,
                        objectId:$(this).attr('value'),
                        comment:comment
                    }).fail(function(resp){
                        alert('Ошибка: ' + resp);
                        throw 'comment Error...';
                    });
                });
                alert('комментарий был успешно оставлен');
            }
        )
    );
}
