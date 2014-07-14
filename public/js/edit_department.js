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

(function($){
    "use strict";

    // Highlighter CLASS DEFINITON
    // ===============================
    var Highlighter = function($el, options) {
        // global variables
        this.settings = $.extend({}, Highlighter.DEFAULTS);
        this.scrollbarWidth = Utilities.getScrollbarWidth();
        this.isInput = $el[0].tagName.toLowerCase()=='input';
        this.active = false;

        // build HTML
        this.$el = $el;

        this.$el.wrap('<div class=highlightTextarea></div>');
        this.$main = this.$el.parent();

        this.$main.prepend('<div class=container><div class=highlighter></div></div>');
        this.$container = this.$main.children().first();
        this.$highlighter = this.$container.children();

        this.setOptions(options);

        // set id
        if (this.settings.id) {
            this.$main[0].id = this.settings.id;
        }

        // resizable
        if (this.settings.resizable) {
            this.applyResizable();
        }

        // run
        this.updateCss();
        this.bindEvents();
        this.highlight();
    };

    Highlighter.DEFAULTS = {
        words: {},
        ranges: {},
        color: '#ffff00',
        caseSensitive: true,
        resizable: false,
        id: '',
        debug: false
    };

    // PUBLIC METHODS
    // ===============================
    /*
     * Refresh highlight
     */
    Highlighter.prototype.highlight = function() {
        var text = Utilities.htmlEntities(this.$el.val()),
            that = this;

        $.each(this.settings.words, function(color, words) {
            text = text.replace(
                new RegExp('('+ words.join('|') +')', that.regParam),
                '<mark style="background-color:'+ color +';">$1</mark>'
            );
        });

        $.each(this.settings.ranges, function(i, range) {
            text = Utilities.strInsert(text, range.end, '</mark>');
            text = Utilities.strInsert(text, range.start, '<mark style="background-color:'+ range.color +';">');
        });

        this.$highlighter.html(text);
        this.updateSizePosition();
    };

    /*
     * Change highlighted words
     * @param words {mixed}
     */
    Highlighter.prototype.setWords = function(words) {
        this.setOptions({ words: words, ranges: {} });
    };

    /*
     * Change highlighted ranges
     * @param ranges {mixed}
     */
    Highlighter.prototype.setRanges = function(ranges) {
        this.setOptions({ words: {}, ranges: ranges });
    };

    /*
     * Enable highlight and events
     */
    Highlighter.prototype.enable = function() {
        this.bindEvents();
        this.highlight();
    };

    /*
     * Disable highlight and events
     */
    Highlighter.prototype.disable = function() {
        this.unbindEvents();
        this.$highlighter.empty();
    };

    /*
     * Remove the plugin
     */
    Highlighter.prototype.destroy = function() {
        this.disable();

        Utilities.cloneCss(this.$container, this.$el, [
            'background-image','background-color','background-position','background-repeat',
            'background-origin','background-clip','background-size','background-attachment'
        ]);

        this.$main.replaceWith(this.$el);

        this.$el.removeData('highlighter');
    };

    // PRIVATE METHODS
    // ===============================
    /*
     * Change options
     * @param options {object}
     */
    Highlighter.prototype.setOptions = function(options) {
        if (typeof options != 'object' || $.isEmptyObject(options)) {
            return;
        }

        $.extend(this.settings, options);
        this.regParam = this.settings.caseSensitive ? 'gm' : 'gim';

        if (!$.isEmptyObject(this.settings.words)) {
            this.settings.words = Utilities.cleanWords(this.settings.words, this.settings.color);
            this.settings.ranges = {};
        }
        else if (!$.isEmptyObject(this.settings.ranges)) {
            this.settings.words = {};
            this.settings.ranges = Utilities.cleanRanges(this.settings.ranges, this.settings.color);
        }

        if (this.settings.debug) {
            this.$main.addClass('debug');
        }
        else {
            this.$main.removeClass('debug');
        }

        if (this.active) {
            this.highlight();
        }
    };

    /*
     * Attach event listeners
     */
    Highlighter.prototype.bindEvents = function() {
        if (this.active) {
            return;
        }
        this.active = true;

        var that = this;

        // prevent positioning errors by always focusing the textarea
        this.$highlighter.on({
            'this.highlighter': function() {
                that.$el.focus();
            }
        });

        // add triggers to textarea
        this.$el.on({
            'input.highlighter': Utilities.throttle(function() {
                this.highlight();
            }, 100, this),

            'resize.highlighter': Utilities.throttle(function() {
                this.updateSizePosition(true);
            }, 50, this),

            'scroll.highlighter select.highlighter': Utilities.throttle(function() {
                this.updateSizePosition();
            }, 50, this)
        });

        if (this.isInput) {
            this.$el.on({
                // Prevent Cmd-Left Arrow and Cmd-Right Arrow on Mac strange behavior
                'keydown.highlighter keypress.highlighter keyup.highlighter': function() {
                    setTimeout($.proxy(that.updateSizePosition, that), 1);
                },

                // Force Chrome behavior on all browsers: reset input position on blur
                'blur.highlighter': function() {
                    this.value = this.value;
                    this.scrollLeft = 0;
                    that.updateSizePosition.call(that);
                }
            });
        }
    };

    /*
     * Detach event listeners
     */
    Highlighter.prototype.unbindEvents = function() {
        if (!this.active) {
            return;
        }
        this.active = false;

        this.$highlighter.off('click.highlighter');
        this.$el.off('input.highlighter resize.highlighter scroll.highlighter' +
            ' keydown.highlighter keypress.highlighter keyup.highlighter' +
            ' select.highlighter blur.highlighter');
    };

    /*
     * Update CSS of wrapper and containers
     */
    Highlighter.prototype.updateCss = function() {
        // the main container has the same size and position than the original textarea
        Utilities.cloneCss(this.$el, this.$main, [
            'float','vertical-align'
        ]);
        this.$main.css({
            'width':    this.$el.outerWidth(true),
            'height': this.$el.outerHeight(true)
        });

        // the highlighter container is positionned at "real" top-left corner of the textarea and takes its background
        Utilities.cloneCss(this.$el, this.$container, [
            'background-image','background-color','background-position','background-repeat',
            'background-origin','background-clip','background-size','background-attachment',
            'padding-top','padding-right','padding-bottom','padding-left'
        ]);
        this.$container.css({
            'top':        Utilities.toPx(this.$el.css('margin-top')) + Utilities.toPx(this.$el.css('border-top-width')),
            'left':     Utilities.toPx(this.$el.css('margin-left')) + Utilities.toPx(this.$el.css('border-left-width')),
            'width':    this.$el.width(),
            'height': this.$el.height()
        });

        // the highlighter has the same size than the "inner" textarea and must have the same font properties
        Utilities.cloneCss(this.$el, this.$highlighter, [
            'font-size','font-family','font-style','font-weight','font-variant','font-stretch',
            'line-height','vertical-align','word-spacing','text-align','letter-spacing', 'text-rendering'
        ]);

        // now make the textarea transparent to see the highlighter through
        this.$el.css({
            'background': 'none'
        });
    };

    /*
     * Apply jQueryUi Resizable if available
     */
    Highlighter.prototype.applyResizable = function() {
        if (jQuery.ui) {
            this.$el.resizable({
                'handles': 'se',
                'resize': Utilities.throttle(function() {
                    this.updateSizePosition(true);
                }, 50, this)
            });
        }
    };

    /*
     * Update size and position of the highlighter
     * @param forced {boolean} true to resize containers
     */
    Highlighter.prototype.updateSizePosition = function(forced) {
        // resize containers
        if (forced) {
            this.$main.css({
                'width':    this.$el.outerWidth(true),
                'height': this.$el.outerHeight(true)
            });
            this.$container.css({
                'width':    this.$el.width(),
                'height': this.$el.height()
            });
        }

        var padding = 0, width;

        if (!this.isInput) {
            // account for vertical scrollbar width
            if (this.$el.css('overflow') == 'scroll' ||
                this.$el.css('overflow-y') == 'scroll' ||
                (
                    this.$el.css('overflow') != 'hidden' &&
                    this.$el.css('overflow-y') != 'hidden' &&
                    this.$el[0].clientHeight < this.$el[0].scrollHeight
                )
            ) {
                padding = this.scrollbarWidth;
            }

            width = this.$el.width()-padding;
        }
        else {
            // TODO: There's got to be a better way of going about this than just using 99999px...
            width = 99999;
        }

        this.$highlighter.css({
            'width': width,
            'height': this.$el.height() + this.$el.scrollTop(),
            'top': -this.$el.scrollTop(),
            'left': -this.$el.scrollLeft()
        });
    };


    // Utilities CLASS DEFINITON
    // ===============================
    var Utilities = function(){};

    /*
     * Get the scrollbar with on this browser
     */
    Utilities.getScrollbarWidth = function() {
        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div>&nbsp;</div></div>').appendTo('body'),
            child = parent.children(),
            width = child.innerWidth() - child.height(100).innerWidth();

        parent.remove();

        return width;
    };

    /*
     * Copy a list of CSS properties from one object to another
     * @param from {jQuery}
     * @param to {jQuery}
     * @param what {string[]}
     */
    Utilities.cloneCss = function(from, to, what) {
        for (var i=0, l=what.length; i<l; i++) {
            to.css(what[i], from.css(what[i]));
        }
    };

    /*
     * Convert a size value to pixels value
     * @param value {mixed}
     * @return {int}
     */
    Utilities.toPx = function(value) {
        if (value != value.replace('em', '')) {
            var el = $('<div style="font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;">&nbsp;</div>').appendTo('body');
            value = Math.round(parseFloat(value.replace('em', '')) * el.height());
            el.remove();
            return value;
        }
        else if (value != value.replace('px', '')) {
            return parseInt(value.replace('px', ''));
        }
        else {
            return parseInt(value);
        }
    };

    /*
     * Converts HTMl entities
     * @param str {string}
     * @return {string}
     */
    Utilities.htmlEntities = function(str) {
        if (str) {
            return $('<div></div>').text(str).html();
        }
        else {
            return '';
        }
    };

    /*
     * Inserts a string in another string at given position
     * @param string {string}
     * @param index {int}
     * @param value {string}
     * @return {string}
     */
    Utilities.strInsert = function(string, index, value) {
        return string.slice(0, index) + value + string.slice(index);
    };

    /*
     * Apply throttling to a callback
     * @param callback {function}
     * @param delay {int} milliseconds
     * @param context {object|null}
     * @return {function}
     */
    Utilities.throttle = function(callback, delay, context) {
        var state = {
            pid: null,
            last: 0
        };

        return function() {
            var elapsed = new Date().getTime() - state.last,
                    args = arguments,
                    that = this;

            function exec() {
                state.last = new Date().getTime();

                if (context) {
                    return callback.apply(context, Array.prototype.slice.call(args));
                }
                else {
                    return callback.apply(that, Array.prototype.slice.call(args));
                }
            }

            if (elapsed > delay) {
                return exec();
            }
            else {
                clearTimeout(state.pid);
                state.pid = setTimeout(exec, delay - elapsed);
            }
        };
    };

    /*
     * Formats a list of words into a hash of arrays (Color => Words list)
     * @param words {mixed}
     * @param color {string} default color
     * @return {object[]}
     */
    Utilities.cleanWords = function(words, color) {
        var out = {};

        if (!$.isArray(words)) {
            words = [words];
        }

        for (var i=0, l=words.length; i<l; i++) {
            var group = words[i];

            if ($.isPlainObject(group)) {

                if (!out[group.color]) {
                    out[group.color] = [];
                }
                if (!$.isArray(group.words)) {
                    group.words = [group.words];
                }

                for (var j=0, m=group.words.length; j<m; j++) {
                    out[group.color].push(Utilities.htmlEntities(group.words[j]));
                }
            }
            else {
                if (!out[color]) {
                    out[color] = [];
                }

                out[color].push(Utilities.htmlEntities(group));
            }
        }

        return out;
    };

    /*
     * Formats a list of ranges into a hash of arrays (Color => Ranges list)
     * @param ranges {mixed}
     * @param color {string} default color
     * @return {object[]}
     */
    Utilities.cleanRanges = function(ranges, color) {
        var out = [];

        if ($.isPlainObject(ranges) || $.isNumeric(ranges[0])) {
            ranges = [ranges];
        }

        for (var i=0, l=ranges.length; i<l; i++) {
            var range = ranges[i];

            if ($.isArray(range)) {
                out.push({
                    color: color,
                    start: range[0],
                    end: range[1]
                });
            }
            else {
                if (range.ranges) {
                    if ($.isPlainObject(range.ranges) || $.isNumeric(range.ranges[0])) {
                        range.ranges = [range.ranges];
                    }

                    for (var j=0, m=range.ranges.length; j<m; j++) {
                        if ($.isArray(range.ranges[j])) {
                            out.push({
                                color: range.color,
                                start: range.ranges[j][0],
                                end: range.ranges[j][1]
                            });
                        }
                        else {
                            if (range.ranges[j].length) {
                                range.ranges[j].end = range.ranges[j].start + range.ranges[j].length;
                            }
                            out.push(range.ranges[j]);
                        }
                    }
                }
                else {
                    if (range.length) {
                        range.end = range.start + range.length;
                    }
                    out.push(range);
                }
            }
        }

        out.sort(function(a, b) {
            if (a.start == b.start) {
                return a.end - b.end;
            }
            return a.start - b.start;
        });

        var current = -1;
        $.each(out, function(i, range) {
            if (range.start >= range.end) {
                $.error('Invalid range end/start');
            }
            if (range.start < current) {
                $.error('Ranges overlap');
            }
            current = range.end;
        });

        out.reverse();

        return out;
    };


    // JQUERY PLUGIN DEFINITION
    // ===============================
    $.fn.highlightTextarea = function(option) {
        var args = arguments;

        return this.each(function() {
            var $this = $(this),
                data = $this.data('highlighter'),
                options = typeof option == 'object' && option;

            if (!data && option == 'destroy') {
                return;
            }
            if (!data) {
                data = new Highlighter($this, options);
                $this.data('highlighter', data);
            }
            if (typeof option == 'string') {
                data[option].apply(data, Array.prototype.slice.call(args, 1));
            }
        });
    };
}(jQuery));

/*
 *
 * Copyright (c) 2010 C. F., Wong (<a href="http://cloudgen.w0ng.hk">Cloudgen Examplet Store</a>)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
﻿(function($,len,createRange,duplicate){
	$.fn.caret=function(options,opt2){
		var start,end,t=this[0],browser=window.navigator.userAgent.indexOf("MSIE ")>=0;
		if(typeof options==="object" && typeof options.start==="number" && typeof options.end==="number") {
			start=options.start;
			end=options.end;
		} else if(typeof options==="number" && typeof opt2==="number"){
			start=options;
			end=opt2;
		} else if(typeof options==="string"){
			if((start=t.value.indexOf(options))>-1) end=start+options[len];
			else start=null;
		} else if(Object.prototype.toString.call(options)==="[object RegExp]"){
			var re=options.exec(t.value);
			if(re != null) {
				start=re.index;
				end=start+re[0][len];
			}
		}
		if(typeof start!="undefined"){
			if(browser){
				var selRange = this[0].createTextRange();
				selRange.collapse(true);
				selRange.moveStart('character', start);
				selRange.moveEnd('character', end-start);
				selRange.select();
			} else {
				this[0].selectionStart=start;
				this[0].selectionEnd=end;
			}
			this[0].focus();
			return this
		} else {
			// Modification as suggested by Андрей Юткин
           if(browser){
				var selection=document.selection;
                if (this[0].tagName.toLowerCase() != "textarea") {
                    var val = this.val(),
                    range = selection[createRange]()[duplicate]();
                    range.moveEnd("character", val[len]);
                    var s = (range.text == "" ? val[len]:val.lastIndexOf(range.text));
                    range = selection[createRange]()[duplicate]();
                    range.moveStart("character", -val[len]);
                    var e = range.text[len];
                } else {
                    var range = selection[createRange](),
                    stored_range = range[duplicate]();
                    stored_range.moveToElementText(this[0]);
                    stored_range.setEndPoint('EndToEnd', range);
                    var s = stored_range.text[len] - range.text[len],
                    e = s + range.text[len]
                }
			// End of Modification
            } else {
				var s=t.selectionStart,
					e=t.selectionEnd;
			}
			var te=t.value.substring(s,e);
			return {start:s,end:e,text:te,replace:function(st){
				return t.value.substring(0,s)+st+t.value.substring(e,t.value[len])
			}}
		}
	}
})(jQuery,"length","createRange","duplicate");

// Render first hash to kick things off
$(document).ready(function() {
  var txt = $("div[time]")[0];
  if(txt !== undefined) txt = txt.getAttribute("hash").replace(/([^{}:\[\],]+)/g,"\"$1\"").replace(/\"\./g,"\"");
  else txt = '{"Department":{"Grocery":"Other"}}';
  $("#jsonTEXTAREA").html(txt);
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
  document.cookie = "devModeUnlock=1";
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

var devModeUnlockIndex = document.cookie.indexOf("devModeUnlock");
if(devModeUnlockIndex < 0 || document.cookie[devModeUnlockIndex+14] != "1")
  $(document).keyup(devListener);

var keyMap = {
    '(': ')',
    '[': ']',
    '<': '>',
    '{': '}'
};

var cur_highlight_ranges = [];

function scanChars(ltr,cha,matchChar,text) {
  var cnt = 1;
  var ind = 0;
  if(!ltr) ind = text.length-1;
  while(ltr ? (ind < text.length) : (ind >= 0)) {
    if(text[ind] == cha) cnt++;
    if(text[ind] == matchChar) {
      cnt--;
      if(cnt == 0) return ind;
    }
    if(ltr)
      ind++;
    else
      ind--;
  }
}

$("textarea.editor").highlightTextarea('setOptions', {color: '#ffdf00'});

$('#edit_department_modal .modal-body').on("keyup click focus", 'div textarea.editor', function(e){
  var new_highlight_ranges = [];
  var curpos = $(this).caret().start;
  // check opening to my right, then left (ensure > 0). then check closing to my left, then right.
  var rightChar = $(this).val()[curpos];
  var leftChar = "";
  var text = $(this).val();
  var innerIndex = -1;
  if(curpos > 0)
    leftChar = text[curpos-1];
  
  if($.inArray(rightChar,Object.keys(keyMap)) >= 0) {
    // find matching close
    if((innerIndex = scanChars(true,rightChar,keyMap[rightChar],text.substring(curpos+1))) >= 0) {
      var matchPos = curpos+innerIndex+1;
      new_highlight_ranges = [[curpos,curpos+1],[matchPos,matchPos+1]];
    }
  } else if($.inArray(leftChar,Object.keys(keyMap)) >= 0) {
    // find matching close
    if((innerIndex = scanChars(true,leftChar,keyMap[leftChar],text.substring(curpos))) >= 0) {
      var matchPos = curpos+innerIndex;
      new_highlight_ranges = [[curpos-1,curpos],[matchPos,matchPos+1]];
    }
  } else {
    var found = false;
    for(var k in keyMap) {
      if(leftChar == keyMap[k]) {
        // find matching open
        if((innerIndex = scanChars(false,leftChar,k,text.substring(0,curpos-1))) >= 0) {
          new_highlight_ranges = [[curpos-1,curpos],[innerIndex,innerIndex+1]];
        }
        found = true;
        break;
      }
    } 
    if(!found) {
      for(var k in keyMap) {
        if (rightChar == keyMap[k]) {
          // find matching open
          if((innerIndex = scanChars(false,rightChar,k,text.substring(0,curpos))) >= 0) {
            new_highlight_ranges = [[curpos,curpos+1],[innerIndex,innerIndex+1]];
          }
          break;
        }
      }
    }
  }
  
  $(this).highlightTextarea('setRanges', new_highlight_ranges);
  cur_highlight_ranges = new_highlight_ranges;
  
});

$("a[dept]").click(function(e) {
  e.preventDefault();
  // Strip dots and insert quotes, then fill in #jsonTEXTAREA. Also clear existing highlights.
  var jt = $("#jsonTEXTAREA");
  jt.siblings("div.container").children(".highlighter").html("");
  jt.val($(this).attr("dept").replace(/([^{}:\[\],]+)/g,"\"$1\"").replace(/\"\./g,"\""));
});