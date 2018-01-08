// ==UserScript==
// @name         Dash
// @namespace    http://tampermonkey.net/
// @version      1.0
// @include      https://adm.avito.ru/helpdesk/dashboard*
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @updateURL    https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/dash.js
// @downloadURL  https://raw.githubusercontent.com/chopx3/production/dev/src/main/webapp/resources/script/dash.js
// @grant        none
// ==/UserScript==


//Dash - info about new tickets
const timeIntervalInMinutes = 2;
var queues = [339, 706, 763, 354, 535, 351, 1081];
var queueNames = ["Магазины", "Магазины (В УЗ есть менеджер)", "Gold General", "Запросы менеджеров", "RE Premium", "ProTools", "Context General"];
var targetTime = [3600, 3600, 3600, 3600, 3600, 7200, 3600];
var finalResult = [];
function getReactionTime(zEvent){
    finalResult = [];
    for (var i=0; i<queues.length; i++){
     var limit = 20;
     var URL = "https://adm.avito.ru/helpdesk/api/1/ticket/search/filter/"+queues[i]+"?sortField=reactionTxtime&sortType=asc&p=1";
     getRequest(URL, i);
 }
}
function getRequest(URL, i){
     $.get(URL).done(function (data) {
         var info = data;
         var reaction = 0, newTicket = 0, reopen = 0, inWorkTicket = 0;
         var totalCount = info.count;
         var tickets = info.tickets;
         var firstTicket = true;
         if (tickets.length > 0){
         for (var j=0;j<tickets.length;j++){
             if (tickets[j].statusId == 1){
                 if(firstTicket){
                     firstTicket = !firstTicket;
                     reaction = moment().valueOf() - moment(tickets[j].reactionTxtime, "YYYY-MM-DD HH:mm:ss").valueOf();
                 }
                 newTicket++;
             }
             if (tickets[j].statusId == 2){
                 inWorkTicket++;
             }
             if (tickets[j].statusId == 6){
                 reopen++;
             }
         }
             finalResult.push({name: queueNames[i], reaction: Math.floor(reaction/1000), count: totalCount, target: targetTime[i], reopen: reopen, inWork: inWorkTicket, new: newTicket});
         }
         else {finalResult.push({name: queueNames[i], reaction: 0, count: totalCount, target: targetTime[i], reopen: reopen, inWork: inWorkTicket, new: newTicket});}
     });
}
var dashURL = "https://adm.avito.ru/helpdesk/api/1/dashboard/pro"; // Ссылка, откуда берется информация
function getDashboardData()	{ // функция получения данных и передачи данных на отрисовку
    getReactionTime();
    console.log(finalResult);
    setTimeout(function() {
$.get(dashURL).done(function (data) { // получаем информацию
    var react = finalResult; // сохраняем сюда массив с временем реакции
	sorting(react, "reaction"); // сортируем его, от большего к меньшему
    console.log(react);
	var satisf = data.satisfactions; // теперь с сатисфакцией
	sortingMarks(satisf); // сортируем по количеству оценок
	var firstColumn = "Очередь"; // просто
	var secondColumn = "Ожидание"; // названия
	var thirdColumn = "Реальность"; // очередей
	var reactBody= satisfBody=""; // обнуления и объявления переменных
	var reactHead = '<table id="dashboardTableReactTime" class="table table-condensed table-hover" ><thead><tr><th class="col-lg-7">' + firstColumn + '</th><th class="col-lg-2 centered">' + secondColumn + '</th><th class="col-lg-3 centered">' + thirdColumn + '</th></tr></thead><tbody>'; // верх таблицы времени реакции
	for (var i = 0; i< react.length; i++){ // массив заполнения строк времени реакции
        if (react[i].reaction > 0){
		var isReactionSlow = (react[i].reaction > react[i].target ) ? 'style="color:red;"' : 'style="color:green;"'; // цвет времени, если больше - красный, меньше - зеленый
		var name = react[i].name; // название очереди
		name=(name.length>=24)? name.substr(0,22)+"..": name; // не более 24 символов выводить, обрезка слишком длинных названий
		var targetInHours = react[i].target / 3600 + 'ч'; // добавить в выводе букву ч в Ожидание
		var minutes = (Math.floor((react[i].reaction % 3600) / 60)>=10) ? Math.floor((react[i].reaction % 3600) / 60) : "0" + Math.floor((react[i].reaction % 3600) / 60); // посчитать количество минут, дописать 0 в случае, если минут меньше 10
		var reactionHoursMinutes = Math.floor(react[i].reaction / 3600) + 'ч ' + minutes + 'м'; // вывести часы и минуты в реальности
		reactBody+= '<tr><td class="noBottomBorderLine">'+name+'</td><td class="centered bold noBottomBorderLine">'+targetInHours+'</td><td class="centered bold noBottomBorderLine" '+isReactionSlow+'>'+reactionHoursMinutes+'</td></tr>'; // собрать все с одну строку, убрать нижнюю полосу подчеркивания у td элементов
	}
    }
	var satisfTableName = "Топ хороших оценок '4' и '5'"; // название таблицы оценок
	var satisfHead = '<table id="dashboardTableSatisfaction" class="table table-condensed table-hover"><thead><tr><th colspan=2 class="col-lg-12">' + satisfTableName + '</th></tr></thead><tbody>'; // начало таблицы с оценками
	var maxMarkCount = satisf[0].four + satisf[0].five; // количество оценок максимальное
	for (var i=0; i<satisf.length; i++){ // основной цикл отрисовки
		var markCount = satisf[i].four + satisf[i].five; // количество оценок в списке общее
		if (markCount > 0){ // если оценки есть - рисуй
        var four = satisf[i].four; // четверки
		var five = satisf[i].five; // пятерки
        console.log(maxMarkCount);
        console.log(markCount);
        console.log(four);
        console.log(five);
        console.log(satisf[i].name);
		var percent = (markCount > 0) ? Math.ceil(markCount / maxMarkCount * 100): 0; // процент от максимального значения
		var fourProgress = (four > 0) ? '<div class="progress-bar" role="progressbar" aria-valuenow="'+Math.floor(four / maxMarkCount * 100)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+Math.floor(four / maxMarkCount * 100)+'%;"><span class="count bold">'+four+'</span></div>' : ""; // отрисовка четверок, если есть
		var fiveProgress = (five > 0) ? '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+Math.floor(five / maxMarkCount * 100)+'" aria-valuemin="0" aria-valuemax="100" style="width: '+Math.floor(five / maxMarkCount * 100)+'%;"><span class="count bold">'+five+'</span></div>' : ""; // отрисовка пятерок, если есть
		var progressBar = '<div class="progress">'+ fourProgress + fiveProgress + '</div>';
		satisfBody+='<tr ><td class="col-lg-6 noBottomBorderLine">'+satisf[i].name+'</td><td class="col-lg-6 noBottomBorderLine">'+progressBar+'</td></tr>';}
	}
    var leftTable = reactHead + reactBody+'</table>'; // левая таблица
    var rightTable = satisfHead + satisfBody +'</table>'; //правая таблица
	$("div.hd-flex_justify-content-space-between>div.hd-flex-item:first-child>div.panel>div.panel-body").html(leftTable); // находим элемент в этой сложной структуре отрисовки дашборда для левой таблицы
    $("div.heldesk-dashboard-users-panel").html(rightTable); // и для правой, он чуть легче
} ); }, 500);
}
function sortingMarks(json_object) { // сортировка по оценкам
    function sortByKey(a, b) { // сам принцип сортировки, берем два элемента, сравниваем количество 4 и 5, при этом приоритет у 5 чуть выше (1.1), чтобы они выводились выше при одинаковом количестве оценок
        var x = a["four"]+a["five"]*1.1;
        var y = b["four"]+b["five"]*1.1;
        return ((x > y) ? -1 : ((x < y) ? 1 : 0)); // и возвращаем результат сравнения, встроенная функция сортировки
    }
    json_object.sort(sortByKey);
}
function sorting(json_object, key_to_sort_by) { // сортировка по времени реакции
    function sortByKey(a, b) { // тут просто - если выше, то и стоит раньше
        var x = a[key_to_sort_by];
        var y = b[key_to_sort_by];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    }
    json_object.sort(sortByKey);
}
$(document).ready(function() {
getDashboardData();
var sheet = document.createElement('style'); // сложные манипуляции с css файлом, я не знал как его встроить - вшил просто в сам текст скрипта, кривовато
sheet.innerHTML = ".progress{"+ // класс прогресс, для отрисовки прогрессбара, высота, отступы
"	margin-bottom: 0px;"+
"	height:30px;"+
"	margin-top: 7px;"+
"}"+
".count{"+ // спан элемент, показывающий количество оценок внутри прогрессбара. Блок - чтобы отцентровать, остальное - размер шрифта+отступ
"	display: block;"+
"	font-size:	25px;"+
"	margin-top: 5px;"+
"}"+
".bold{"+ // жирное выделение
"	font-weight: bold;"+
"}"+
".noBottomBorderLine{"+ // убрать рамку внизу у таблиц
"	border-top: 0px !important;"+
"}"+
".centered{"+ // по центру отображать
"	text-align: center;"+
"}"+
"#dashboardTableReactTime, #dashboardTableSatisfaction{"+ // убрать у таблиц отступ внизу + размер шрифта
"	font-size:	30px;"+
    "margin-bottom:0px ! important;"+
"}";
document.body.appendChild(sheet); // добавить данные стили в тэг body
 // первоначальная отрисовка, чтобы сразу закрыть отображение стандартное
	window.setInterval(function(){ // и потом каждые 60 секунд - в миллисекундах указывается
	getDashboardData();
}, 300000);
});
