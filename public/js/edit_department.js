/*var cur_dept_render_index = 1;
var dept_row_idx = 0;
var dotted_options = {};
// Take in hash string and render view
function render_department_view(hash) {
  hash = hash.replace(/([^{}:\[\],]+)/g,"\"$1\"");
  var hashObj = JSON.parse(hash);
  var editDepartmentDiv = $("#edit_department");
  editDepartmentDiv.html("");
  cur_dept_render_index = 1;
  dept_row_idx = 0;
  dfs(hashObj, [], editDepartmentDiv, render_department_row);
}

function render_department_row(editDepartmentDiv,path, str, dotted,idx) {
  $.ajax({
    url: domain + "/items/subdepartments/global",
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    data: {path: path},
    xhrFields: {withCredentials: true},
    crossDomain: true,
    success: function(json) {
      dotted_options[path] = {};
      var lookahead_choices = "[]";
      if(json.success) {
        for(var i = 0; i < json.result.length; i++) {
          if(json.result[i][0] == ".")
          {
            json.result[i] = json.result[i].substring(1);
            dotted_options[path][json.result[i]] = true;
          } else {
            dotted_options[path][json.result[i]] = false;
          }
        }
        lookahead_choices = JSON.stringify(json.result);
      }
      append_department_row(editDepartmentDiv, path, str, dotted, lookahead_choices,idx);
    },
    error: function() {
      append_department_row(editDepartmentDiv, path, str, dotted, "[]",idx);
    }
  });

}

function append_department_row(editDepartmentDiv, path, str, dotted, lookahead_choices, idx) {
  if(cur_dept_render_index == idx) {
    console.log(idx +" : "+ str);
    var div_str = '<div style="margin-left: ' + 20*path.length + 'px">' +
                  '<input type="text" data-provide="typeahead" autocomplete="off" style="margin-bottom: 0;width:166px" path="' + path + '" value="' + str + '" dotted="' + dotted + '" data-source=\'' + lookahead_choices + '\' />';
    if(path.length > 0 && path[path.length-1][0] != ".") {
      div_str += '<button class="btn btn-info plusinfo" data-original-title="Add Extra ' + path[path.length-1] + ' Info">+</button>';
    }
    div_str += '</div><div>' +
               '<button class="btn btn-primary" style="width: 180px;margin-left:' + 20*(1+path.length) + 'px">Add field to ' + str  + '</button>' +
               '</div>';
    editDepartmentDiv.append(div_str);
    $(".typeahead").typeahead();
    $(".plusinfo").tooltip('hide');
    cur_dept_render_index++;
  } else {
    setTimeout(function(){append_department_row(editDepartmentDiv, path, str, dotted, lookahead_choices, idx);},50);
  }
}

function dfs(obj, path, editDepartmentDiv, fnc) {
  if(obj instanceof Object) {
    if(obj instanceof Array) {
      for(var i = 0; i < obj.length; i++) {
        dfs(obj[i],$.extend(true,[],path),editDepartmentDiv,fnc);
      }
    } else {
      for(var k in obj) {
        var dotted = k[0] == ".";
        dept_row_idx++;
        fnc(editDepartmentDiv, $.extend(true,[],path), dotted ? k.substring(1) : k,dotted, dept_row_idx);
        var extended_path = $.extend(true,[],path);
        extended_path.splice(extended_path.length,0,k);
        dfs(obj[k], extended_path,editDepartmentDiv,fnc);
      }
    }
  } else {
    dept_row_idx++;
    fnc(editDepartmentDiv, $.extend(true,[],path),obj,false, dept_row_idx);
  }
  return path;
}                      */

// Render first hash to kick things off
$(document).ready(function() {
  $("#jsonTEXTAREA").html($("div[time]")[0].getAttribute("hash").replace(/([^{}:\[\],]+)/g,"\"$1\"").replace(/\"\./g,"\""));
  //render_department_view($("div[time]")[0].getAttribute("hash"));
});

var devSnd = new Audio("/DevMode.mp3");
var devInp = "POWEROVERWHELMING";
var devIndex = 0;

function initDevMode() {
  devSnd.play();
  console.log("Dev mode unlock!");
  $(".text-editor-wrap").fadeIn(300).delay(2000).fadeOut(600);
  $("#typed").delay(300).typed();
  $(".dev-mode-lock").removeClass("dev-mode-lock");
}

function devListener(e) {
  if(devInp[devIndex] == String.fromCharCode(e.keyCode)) {
    devIndex++;
if(devIndex == devInp.length - 1)
{
 // Init dev mode
 initDevMode();
 // Disable dev listener
 $(document).unbind("keyup",devListener);
}
  } else {
    devIndex = 0;
  }
}

!function($){

"use strict";

var Typed = function(el, options){

// for variable scope's sake
self = this;

// chosen element to manipulate text
self.el = $(el);
// options
self.options = $.extend({}, $.fn.typed.defaults, options);

// text content of element
self.text = self.el.text();

// typing speed
self.typeSpeed = self.options.typeSpeed;

// amount of time to wait before backspacing
self.backDelay = self.options.backDelay;

// input strings of text
self.strings = self.options.strings;

// character number position of current string
self.strPos = 0;

// current array position
self.arrayPos = 0;

// current string based on current values[] array position
self.string = self.strings[self.arrayPos];

// number to stop backspacing on.
// default 0, can change depending on how many chars
// you want to remove at the time
self.stopNum = 0;

// number in which to stop going through array
// set to strings[] array (length - 1) to stop deleting after last string is typed
self.stopArray = self.strings.length-1;

// All systems go!
self.init();
}

Typed.prototype =  {

constructor: Typed
, init: function(){
// begin the loop w/ first current string (global self.string)
// current string will be passed as an argument each time after this
self.typewrite(self.string, self.strPos);
self.el.after("<span id=\"typed-cursor\">|</span>");
}

// pass current string state to each function
, typewrite: function(curString, curStrPos){

// varying values for setTimeout during typing
// can't be global since number changes each time loop is executed
var humanize = Math.round(Math.random() * (100 - 30)) + self.typeSpeed;

// custom backspace delay for the typo
if (self.arrayPos == 1){
self.backDelay = 50;
}
else{ self.backDelay = 500; }

// containg entire typing function in a timeout
setTimeout(function() {

// make sure array position is less than array length
if (self.arrayPos < self.strings.length){
// start typing each new char into existing string
// curString is function arg
self.el.text(self.text + curString.substr(0, curStrPos));

// check if current character number is the string's length
// and if the current array position is less than the stopping point
// if so, backspace after backDelay setting
if (curStrPos > curString.length && self.arrayPos < self.stopArray){
clearTimeout();
setTimeout(function(){
self.backspace(curString, curStrPos);
}, self.backDelay);
}

// else, keep typing
else{
// add characters one by one
curStrPos++;
// loop the function
self.typewrite(curString, curStrPos);
// if the array position is at the stopping position
// finish code, on to next task
if (self.arrayPos == self.stopArray && curStrPos == curString.length){
// animation that occurs on the last typed string
// place any finishing code here
self.shift();
clearTimeout();
}
}
}

// humanized value for typing
}, humanize);
}

, backspace: function(curString, curStrPos){

// varying values for setTimeout during typing
// can't be global since number changes each time loop is executed
var humanize = Math.round(Math.random() * (100 - 30)) + self.typeSpeed;

setTimeout(function() {

// ----- this part is optional ----- //
// check string array position
// on the first string, only delete one word
// the stopNum actually represents the amount of chars to
// keep in the current string. In my case it's 9.
if (self.arrayPos == 1){
self.stopNum = 3;
}
//every other time, delete the whole typed string
else{
self.stopNum = 0;
}

// ----- continue important stuff ----- //
// replace text with current text + typed characters
self.el.text(self.text + curString.substr(0, curStrPos));

// if the number (id of character in current string) is
// less than the stop number, keep going
if (curStrPos > self.stopNum){
// subtract characters one by one
curStrPos--;
// loop the function
self.backspace(curString, curStrPos);
}
// if the stop number has been reached, increase
// array position to next string
else if (curStrPos <= self.stopNum){
clearTimeout();
self.arrayPos = self.arrayPos+1;
// must pass new array position in this instance
// instead of using global arrayPos
self.typewrite(self.strings[self.arrayPos], curStrPos);
}

// humanized value for typing
}, humanize);

}

, shift: function(){
self.terminalHeight();
}

, terminalHeight: function(){

var termHeight = $(".terminal-height");
var value = termHeight.text();
value = parseInt(value);

setTimeout(function(){

if (value > 10){
value = value-1;
this.txtValue = value.toString();
termHeight.text(this.txtValue);
self.terminalHeight();
}
else{
clearTimeout();
}
}, 10);

}

}

$.fn.typed = function (option) {
   return this.each(function () {
     var $this = $(this)
       , data = $this.data('typed')
       , options = typeof option == 'object' && option
     if (!data) $this.data('typed', (data = new Typed(this, options)))
     if (typeof option == 'string') data[option]()
   });
}

$.fn.typed.defaults = {
strings: ["./DeveloperModeUnlock"],
// typing and backspacing speed
typeSpeed: 30,
// time before backspacing
backDelay: 500
}



}(window.jQuery);

$(document).keyup(devListener);