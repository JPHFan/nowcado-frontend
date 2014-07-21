// Format of arr_path_and_vals: [[<Path to new key in hash, with key and default value at end>]]
// Format of arr_path_and_old_val_key: [[<Path through newly dotted key, ending with the new key name pointing to old values (e.g. "Value")>]]
// Format of rename_paths: [[[<Path to old value, including the value itself>],<New Value to rename to>]]
var arr_path_and_vals = [], arr_path_and_old_val_key = [], rename_paths = [];

a_dBg2 = (location.search.indexOf("&debug2") > 0);
a_isIE = (navigator.userAgent.toLowerCase().indexOf('msie') > 0) && (navigator.userAgent.toLowerCase().indexOf('opera') < 0);
a_isWK = (navigator.userAgent.indexOf("AppleWebKit") > 0);
a_popupObj = null;
filldown_options = {};

function a_addListener(a, b, c) {
    if (!a || !b || !c) return;
    if (a.addEventListener) {
        a.addEventListener(b, c, false)
    } else if (a.attachEvent) {
        a.attachEvent("on" + b, c)
    }
}

function a_getTarget(e) {
    var e = e || window.event;
    return e ? e.target || e.srcElement : null
}

function a_getPoint(a) {
    if (!a) return;
    var x = a.offsetLeft;
    var y = a.offsetTop;
    var b = a.offsetParent;
    if (b) {
        var c = a_getPoint(b);
        x += c.x;
        y += c.y
    }
    return {
        x: x,
        y: y
    }
}

function a_getObI(a) {
    return document.getElementById(a)
}

function a_hasClass(a, b) {
    if (!a) return;
    if ((b == "" && a.className == "") || b == null) return a;
    var c = " " + a.className + " ";
    if (c.indexOf(" " + b + " ") >= 0) return a
}

function a_addClass(a, b, c) {
    if (!a || !b) return;
    if (c == null) c = true;
    if (c) {
        if (!a_hasClass(a, b)) a.className += " " + b
    } else {
        a.className = a.className.replace(new RegExp("\\b" + b + "\\b"), "")
    }
}

function a_getAbT(a, b, c) {
    if (!a) return;
    a = a.parentNode;
    if (!a) return;
    if (a.nodeType == 1 && a.tagName.toLowerCase() == b.toLowerCase()) {
        if (a_hasClass(a, c)) return a
    }
    return a_getAbT(a, b, c)
}

function a_getDbT(a, b, c) {
    if (a == null) return;
    var d = a.getElementsByTagName(b.toLowerCase());
    for (var i = 0, a; a = d[i]; i++) {
        if (a_hasClass(a, c)) return a
    }
}

function a_getArrayDbT(a, b, c) {
    if (!a) a = document;
    var d = (!b && a.all) ? a.all : a.getElementsByTagName(b.toLowerCase());
    var e = [];
    if (!d.length) return e;
    for (var i = 0, obj; obj = d[i]; i++) {
        if (!c) e.push(obj);
        else if (a_hasClass(obj, c)) e.push(obj)
    }
    return e
}
a_getElements = a_getArrayDbT;

function a_getSibling(a, b, c) {
    if (!a) return;
    if (!b) b = "next";
    b = b.toLowerCase();
    if (b != "previous" && b != "next") return;
    if (!c) {
        c = a.tagName;
        if (!c) return;
        c = c.toLowerCase()
    }
    var d = (b == "next") ? a.nextSibling : a.previousSibling;
    if (d) {
        if (d.tagName) {
            if (d.tagName.toLowerCase() == c) return d
        }
        return a_getSibling(d, b, c)
    }
}

function a_insertBefore(a, b, c) {
    if (c) a.insertBefore(b, c);
    else a.appendChild(b)
}

function a_trim(a) {
    return a ? a.replace(/^\s*|\s*$/g, "") : ""
}

function a_stripHTML(a) {
    return a.replace(/<\S[^><]*>/g, "")
}

function a_getText(a) {
    if (!a) return;
    if (!a.firstChild) return;
    return a.firstChild.nodeValue
}

function a_setOpacity(a, b) {
    b = (b >= 100) ? 99.999 : b;
    a.style.filter = "alpha(opacity:" + b + ")";
    a.style.KHTMLOpacity = b / 100;
    a.style.MozOpacity = b / 100;
    a.style.opacity = b / 100
}

function a_display(a, b) {
    if (!a) return;
    if (b == null) b = true;
    a.style.display = b ? "" : "none"
}

function a_displayed(a) {
    if (!a) return;
    return a.style.display != "none"
}

function a_visibility(a, b) {
    if (!a) return;
    if (b == null) b = true;
    a.style.visibility = b ? "visible" : "hidden"
}

function a_visible(a) {
    if (!a) return;
    return a.style.visibility != "hidden"
}

function a_enableInput(a, b) {
    if (!a) return;
    if (b == null) b = true;
    a.disabled = !b;
    a_addClass(a, "disabled", !b)
}

function a_newWindow(a, b, c, d) {
    if (a.indexOf("http") != 0) a = "http://" + a;
    a = a.replace("http%3A%2F%2F", "http://");
    var e;
    if (!c) e = window.open(a, b);
    else e = window.open(a, b, c); if (d) {
        e.document.open();
        e.document.write(d);
        e.document.close()
    }
    e.focus();
    return false
}

function a_JSONparse(a) {
    try {
        if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(str)) {
            var j = eval('(' + str + ')');
            return j
        }
    } catch (e) {}
}

function a_decompose(b, c) {
    if (typeof (b) != "object") return "Not an Object";
    if (!c) c = 0;
    var d = "";
    var e;
    for (var i in b) {
        if (typeof (b[i]) == "object") d += pad(c) + i + "|object:\n" + a_decompose(b[i], c + 1);
        else d += pad(c) + i + "|" + typeof (b[i]) + ": " + b[i] + " \n"
    }
    return d;

    function pad(a) {
        e = "";
        while (a > 0) {
            e += " ";
            a--
        }
        return e
    }
}

function a_createXHRObject() {
    var a;
    try {
        a = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (e) {
        try {
            a = new ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {
            try {
                a = new XMLHttpRequest()
            } catch (e) {
                a = false
            }
        }
    }
    return a
}

function a_openXHRObject(a, b, c, d, e, f, g, h) {
    a.open(b, c, d);
    if (f && g) a.setRequestHeader(f, g);
    if (e) a.onreadystatechange = e;
    a.send(h)
}

function a_xhrText(a) {
    if (!a) return "NA";
    return a.responseText != null ? a.responseText : "Error: " + a.status
}

function cookie_get(a) {
    if (!a) return;
    var b = document.cookie.indexOf(a + "=");
    var c = b + a.length + 1;
    if ((!b) && (a != document.cookie.substring(0, a.length))) return null;
    if (b == -1) return null;
    var d = document.cookie.indexOf(";", c);
    if (d == -1) d = document.cookie.length;
    return unescape(document.cookie.substring(c, d))
}

function cookie_set(a, b, c, d, e, f) {
    if (!a) return;
    if (b) document.cookie = a + "=" + escape(b) + ((c) ? ";expires=" + c.toGMTString() : "") + ((d) ? ";path=" + d : "") + ((e) ? ";domain=" + e : "") + ((f) ? ";secure" : "");
    else cookie_delete(a, d, e)
}

function cookie_delete(a, b, c) {
    if (!a) return;
    if (cookie_get(a)) document.cookie = a + "=" + ((b) ? ";path=" + b : "") + ((c) ? ";domain=" + c : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT"
}

function a_expireDays(d) {
    var a = new Date();
    a.setTime(a.getTime() + 86400000 * d);
    return a
}

function a_popupFill(a, b) {
    if (!a || !b) return;
    if (!a_popupObj) {
        a_popupObj = document.createElement("div");
        a_popupObj.style.zIndex = 1000;
        a_display(a_popupObj, false);
        a_popupObj.id = "popupDIV";
        document.body.appendChild(a_popupObj)
    } else {
        if (a_displayed(a_popupObj) && a_popupObj.url == b.urlStr) {
            a_popupClose();
            return
        }
    } if (!b) b = {};
    a_popupObj.url = b.urlStr;
    var c = a_getPoint(a);
    a_popupObj.style.left = c.x - 1 + "px";
    a_popupObj.style.top = c.y + a.offsetHeight + 1 + "px";
    if (b.h) a_popupObj.style.height = b.h;
    var w = b.w;
    if (!w || w > 640) w = 640;
    a_popupObj.style.width = w + "px";
    if (b.urlStr) {
        a_xhrFill(a_popupObj, b.urlStr, popupFillHandler)
    } else if (b.htmlStr) {
        a_fill(a_popupObj, b.htmlStr);
        popupFillHandler()
    }

    function popupFillHandler() {
        a_fill(a_popupObj, a_popupObj.innerHTML);
        var a = a_getDbT(a_popupObj, "img", "closeButton");
        if (!a) {
            a = document.createElement("img");
            a.src = "/img/g_s_close2.gif";
            a_addClass(a, "pseudoA closeButton");
            a_addListener(a, "click", a_popupClose);
            a.title = "close";
            a_insertBefore(a_popupObj, a, a_popupObj.firstChild)
        }
        a_display(a_popupObj)
    }
}

function a_popupClose() {
    a_display(a_popupObj, false);
    a_popupObj.url = "";
    a_fill(a_popupObj, "")
}

function a_fill(a, b, c) {
    if (a) a.innerHTML = c ? a.innerHTML + b + " " : b
}

function a_xhrFill(a, b, c, d) {
    if (!a || !b) return;
    var f = a.innerHTML;
    a_fill(a, "loading...");
    var e = a_createXHRObject();
    a_openXHRObject(e, "GET", b, true, popupHandleHttpReceive);

    function popupHandleHttpReceive() {
        if (e.readyState == 4) {
            if (e.status == 200 || e.status == 304) {
                a_fill(a, (d ? f : "") + a_xhrText(e));
                if (c) c()
            }
        }
    }
}

jsonEditor = {
	jsonObj: null,
	xMLflag: null,
	xMLdoctypeStr: "",
	xMLRootStr: "",
	jsonFormDIVObj: null,
	jsonFormDataDIVObj: null,
	formatStrArray: ["JSON", "Formatted JSON", "XML"],
	jsonToForm: function(g) {
		a_fill(jE.jsonFormDIVObj, "<span class='red'>Processing..</span>");
		jE.jsonFormDataDIVObj = null;
		jE.xMLflag = false;
		jE.xMLdoctypeStr = "";
    $("IMG.pasteIMG").hide();
    $("IMG.pasteChildnodesIMG").hide();
    $("IMG.pasteAttributesIMG").hide();
//		jE.alterCSS("IMG.pasteIMG", "display", "none");
//		jE.alterCSS("IMG.pasteChildnodesIMG", "display", "none");
//		jE.alterCSS("IMG.pasteAttributesIMG", "display", "none");
    if(g) return delayedJsonToForm();
    else setTimeout(delayedJsonToForm, 100);
		function delayedJsonToForm() {
			var a = a_getObI("jsonTEXTAREA");
			if (a) {
				var b = a_trim(a.value);
				if (b) {
					var c = "";

					b = b.replace(/\n/g, "");
					try {
            jE.jsonObj = eval("(" + b + ")");
            if(b.match(/\"\"/g) || b.match(/\{\}/g) || b.match(/\[\]/g))
              throw {message:"Cannot have empty nodes",name:"Invalid Hash"};
            if(!b.match(/^{\"Department\":/))
              throw {message:"Must begin hash with only \"Department\" key",name:"Invalid Hash"};
            var arrStack = XRegExp.matchRecursive(b,'\\[','\\]','g');
            while(arrStack.length > 0) {
              if(arrStack[0] != "") {
                var tempTopObj = eval("([" + arrStack[0] + "])");
                for(var tempObjInd in tempTopObj) {
                  var tempObj = tempTopObj[tempObjInd];
                  if(typeof(tempObj) == "object" && tempObj.length === undefined && Object.keys(tempObj).length > 1)
                    throw {message:"Hash inside of array must have only one root key",name:"Invalid Hash"}
                }
                var tempStack = XRegExp.matchRecursive(arrStack[0],'\\[','\\]','g');
                arrStack = arrStack.concat(tempStack);
              }
              arrStack.shift();
            }
            if(Object.keys(jE.jsonObj).length != 1)
              throw {message:"Must only have the \"Department\" key at the root",name:"Invalid Hash"};
            if(typeof jE.jsonObj["Department"] == "string")
              throw {message:"Please specify an additional subdepartment",name:"Invalid Hash"};
            if(Object.keys(jE.jsonObj["Department"]).length != 1)
              throw {message:"Department must only have one key below it",name:"Invalid Hash"};
					} catch(e) {
						c = "JS " + e.name + ": " + e.message;
						jE.jsonObj = null
					}
					if (jE.jsonObj) {
						var d = jE.jsonObj.length != undefined;
						var f = jE.xMLflag ? "XML Root:<br><input id='xmlRootINPUT' value='" + jE.xMLRootStr + "'> ": "";
						f += "Form | <span onclick='jE.expandCollapseAllFormItems(true); ' class='clickable'>Expand all nodes</span> | <span onclick='jE.expandCollapseAllFormItems(false); ' class='clickable'>Collapse all nodes</span>" + "<br/><div id='jsonFormDataDIV'>" + jE.jsonToFormStep("", jE.jsonObj, d,[]) + "</div>" + "<br/>";
						f += "<input type='button' class='buttonINPUT' onclick='jE.form2json(0);' value='Convert Form to " +
              jE.formatStrArray[0] + "'> ";
						f += "<br/><textarea class='editor' id='newJsonTEXTAREA'></textarea>";						
						a_fill(jE.jsonFormDIVObj, f);
            $("#newJsonTEXTAREA.editor").highlightTextarea('setOptions', {color: '#ffdf00'});
						jE.jsonFormDataDIVObj = a_getObI("jsonFormDataDIV");
            fixDeptWidth();
            renderAutocomplete();
						a_addListener(jE.jsonFormDataDIVObj, "click", jE.formClicked)
					} else {
						a_fill(jE.jsonFormDIVObj, "");
						alert("Source was invalid.\n\n" + c);
            return -1;
					}
				} else {
					a_fill(jE.jsonFormDIVObj, "");
					alert("Source was invalid.\n\nMust provide input.");
          return -1;
				}
			}
		}
	},
	xmlToJs: function(a) {
		var b;
		if (window.ActiveXObject) {
			b = new ActiveXObject("Microsoft.XMLDOM");
			b.async = "false";
			b.loadXML(a);
			if (b.parseError.errorCode) {
				return "Microsoft.XMLDOM XML Parsing Error: " + b.parseError.reason + "Line Number " + b.parseError.line + ", " + "Column " + b.parseError.linepos + ":" + "\n\n" + b.parseError.srcText
			}
		} else {
			b = (new DOMParser()).parseFromString(a, "text/xml")
		}
		var c = b.documentElement;
		if (c.tagName == "parserError" || c.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml") {
			return "DOMParser " + c.childNodes[0].nodeValue + "\n\n" + c.childNodes[1].childNodes[0].nodeValue
		}
		jE.xMLflag = true;
		jE.xMLRootStr = c.tagName;
		if (a.indexOf("<?xml ") == 0) {
			var L = a.indexOf("?>");
			if (L > 0) jE.xMLdoctypeStr = a.substr(0, L + 2)
		}
		return jE.xmlToJsStep(c)
	},
	xmlToJsStep: function(a) {
		var b = {};
		if (a.attributes) {
			b.attributes = [];
			if (a.attributes.length > 0) {
				for (var i = 0,
				xmlChildObj; xmlChildObj = a.attributes[i]; i++) {
					if (xmlChildObj = a.attributes[i]) {
						if (xmlChildObj.nodeName != undefined) {
							e = {};
							e[xmlChildObj.nodeName] = xmlChildObj.value;
							b.attributes.push(e)
						}
					}
				}
			}
		}
		if (a.childNodes) {
			b.childNodes = [];
			if (a.childNodes.length > 0) {
				for (var i = 0,
				xmlChildObj; xmlChildObj = a.childNodes[i]; i++) {
					var c = xmlChildObj.nodeName;
					if (c == "#text") {
						var d = a_trim(xmlChildObj.nodeValue);
						if (d) {
							e = {
								textNode: d
							};
							b.childNodes.push(e)
						}
					} else if (c != undefined) {
						var e = {};
						e[c] = jE.xmlToJsStep(xmlChildObj);
						b.childNodes.push(e)
					}
				}
			}
		}
		return b
	},
	copyObj: {},
	activeLI: null,
	jsonToFormStep: function(a, b, c, path, disabled) {
		if (typeof(b) != "object") return "NOT AN OBJECT";
		var d = false;
		if (b) {
			d = b.length != undefined
		}
		var e = "objectNameINPUT";

    var tempPath = $.extend(true,[],path);
    tempPath.splice(path.length-1,1);
		var f = (!d && Object.keys(b).length > 1);//jE.xMLflag ? jE.getReadonly(a) : false;
    var g = "<ol class=\"hashOL" + (f ? " dotted": "") + "\">";
    if(!c) {
      var g = jE.inputHTML(a, "leftINPUT " + e, disabled, tempPath) + "<ol" + (!d ? (" class='hashOL" + (f ? " dotted": "") + "'"): "") + ">";
      if(a != "") {
        if(path.length == 1)
          disabled = true;
        g = jE.inputHTML(a, "leftINPUT " + e, disabled, tempPath) + "\n<ol" + (!d ? (" class='hashOL" + (f ? " dotted": "") + "'"): "") + ">";
        g += jE.addActionsHTML(a, d, disabled, f);
      }
    }
		for (var a in b) {
			if (typeof(b[a]) == "object" && b[a] != null) {
				if (b[a].length == undefined) {
					g += "<li>"
				} else {
					g += "<li class='arrayLI'>"
				}
        var extended_path = $.extend(true,[],path);
        if(!d)
          extended_path.splice(extended_path.length,0,a);
				g += jE.jsonToFormStep(a, b[a], d, extended_path, f);
			} else {
				g += "<li>";
				var e;
        var extended_path = $.extend(true,[],path);
				if (d) {
					e = "arrayIndex"
				} else {
          extended_path.splice(extended_path.length,0,a);
					e = "objectNameINPUT"
				}
				var h = typeof(b[a]) == "string" ? "stringTEXTAREA": "";
				var i = b[a];
				if (typeof(i) === "undefined") i = "undefined";
				else if (typeof(i) == "number" && !i) i = "0";
				else if (i === null) i = "null";
				else if (i === false) i = "false";
        var tempObj = {};
        tempObj[b[a]] = {};
				g += jE.jsonToFormStep(a, tempObj, d, extended_path, f);
			}
			g += "</li>\n"
		}
		return g + "</ol>\n"
	},
	inputHTML: function(a, b, d, path, del) {
		if (b.indexOf("arrayIndex") >= 0) {
			return jE.leftActionsHTML(b, !d && del) + "<input type='hidden' class='leftINPUT'><span class='indexSPAN'>[" + a + "]</span>"
		} else {
			var e = b;
			if (d) e += " readonlyINPUT";
			var f = e ? (" class='" + e + "'") : "";
			if (!a && b.indexOf("objectNameINPUT") >= 0) {
				return "<input type='hidden' " + f + ">"
			} else {
				if (b.indexOf("leftINPUT") >= 0) {
					if (d) f += " readonly";
          var extended_path = $.extend(true, [], path);
          //extended_path.splice(extended_path.length-1,1);
					return jE.leftActionsHTML(b, !d && del) + "<input type='text' path='" + extended_path + "' value='" + a + "'" + f + ">" + ((d && extended_path.length>0) ? "<span class=\"clickable\" onclick=\"enableRename($(this).prev())\">Rename</span>" : "") + "<span class='indexSPAN'></span>"
				} else {
					return jE.textareaHTML(a, path) + jE.checkboxHTML(b)
				}
			}
		}
	},
	leftActionsHTML: function(a, del) {
		if (!a) a = "";
		var c = "<img src='/img/je/collapse.gif' class='clickable expandCollapseIMG' onclick='jE.expandCollapseFormItem(this); ' title='Expand/Collapse Node'> ";
		if (del) {
			c += "<img src='/img/je/close.gif' class='clickable' onclick='jE.deleteFormItem(this); ' title='Delete Node (Toggle)'> "
		}
		return c
	},
	textareaHTML: function(a, path) {
		if (!a) a = "";
    return "<textarea path='" + path + "' class='rightTEXTAREA'>" + a + "</textarea>";
		//"<img src='/img/je/expand2.gif' class='clickable expandCollapse2IMG' onclick='jE.expandCollapseTextarea(this); ' title='Expand/Collapse Textarea'>
	},
	checkboxHTML: function(a) {
		var b = "";
		if (!jE.xMLflag) {
			b = "<input type='checkbox' style='display:none' class='checkbox'";
			if (true) {
				if (a.indexOf("stringTEXTAREA") >= 0) b += " checked "
			}
		}
		return b
	},
	addActionsHTML: function(a, b, f, g) {
		var c = "";
		var d = "<div>ADD ";
    if(!g)
      d += "<span class='clickable' onclick='callAddFormItem($(this),2)'>Object</span>";
    if(!f) {
      if(!g)
        d += "<span> | </span>";
      d += "<span class='clickable' onclick='callAddFormItem($(this),1)'>Name:Object</span>";
    }
    d += "</div>";
		//if (d) d += " <img src='/img/je/paste.gif' class='clickable pasteIMG" + c + "' onclick='jE.pasteFormItem(this); ' title='Paste'>";
		return d
	},
	expandCollapseAllFormItems: function(a) {
		if (imgObjs = a_getArrayDbT(jE.jsonFormDataDIVObj, "img", "expandCollapseIMG")) {
			for (var i in imgObjs) jE.expandCollapseFormItem(imgObjs[i], a, "jE_global")
		}
	},
	expandCollapseFormItem: function(a, b, c) {
		var d = a_getSibling(a, "next", "ol");
		if (d) {
			if (b == undefined) b = a.src.indexOf("collapse") < 0;
			a_display(d, b);
			a.src = "/img/je/" + (b ? "collapse": "expand") + ".gif";
			if (!c) jE.getLI(a)
		}
	},
	expandCollapseTextarea: function(a) {
		var b = a_getSibling(a, "next", "textarea");
		if (b) {
			jE.getLI(a);
			var c = a.src.indexOf("collapse") < 0;
			a_addClass(b, "expandedTEXTAREA", c);
			a.src = "/img/je/" + (c ? "collapse": "expand") + "2.gif"
		}
	},
	deleteFormItem: function(a) {
		var b = jE.getLI(a);
		if (b) {
			var c = a_hasClass(b, "deleted");
			if (c) {
				jE_globalRestoreLiObj = b;
				var d = "<input type='button' class='buttonINPUT' onclick='jE.restoreFormItem(); ' value='Restore THIS Node'>" + "<br><br><input id='removeAllDeletedINPUT' type='button' onclick='jE.allDeletedFormItems(); ' value='Remove ALL Deleted Nodes'>";
				jE.messageRight(a, d, 0)
			} else {
				a_addClass(b, "deleted")
			}
		}
	},
	restoreFormItem: function() {
		a_addClass(jE_globalRestoreLiObj, "deleted", false);
		jE.messageClose()
	},
	allDeletedFormItems: function() {
		var a = a_getArrayDbT(jE.jsonFormDataDIVObj, "li", "deleted");
		if (a) {
			for (var i in a) {
        $(a[i].parentNode).children("div").children("span").show();
        // May need to delete "Value" (with "autocreated" class) if nothing else is at this level now and push everything below it up
        var other_key = $(a[i]).siblings("li");
        a[i].parentNode.removeChild(a[i]);
        if (other_key.length == 1){
          if (other_key.children("input").hasClass("autocreated")){
            // Push its children up and then remove the li with the "Value" input.
            var old_parent = other_key.parent();
            other_key.children("ol").insertAfter(old_parent);
            old_parent.remove();
          }
        }
      }
		}
    fixDeptWidth();
		jE.messageClose()
	},
	addFormItem: function(a, c, path, del) {
		var d = a_getAbT(a, "ol");
		if (d) {
			var e = document.createElement("li");
			var f = false;
      if(c == 4)
        f = true;
			var h = "objectNameINPUT";

			//if (b) h = "arrayIndex";
			var i = jE.inputHTML( (c==3 ? "textNode" : "*"), "leftINPUT " + h, f, path.split(","), del);
      if (c == 2) {
        i += "<ol class='hashOL'>" + jE.addActionsHTML("", true) + "</ol>"
      } else {
        if(c == 1) {
          i += "Default:<input type=\"text\" class=\"leftINPUT\" />";
        }
        i += "<ol" + ((c==4 || c==1) ? " class=\"hashOL\"" : "") + ">" + jE.addActionsHTML("", false, true) + "</ol>"
      }

			if (c == 2) a_addClass(e, "arrayLI");
			a_fill(e, i);
      if(c == 1 && !$(d).hasClass("dotted")) {
        var oLiArr = $(d).children("li");
        if(oLiArr.length > 0) {
          jE.addFormItem(a_getDbT(d,"div"),4,path,0);
          var valueObj = $(a_getDbT(a_getDbT(d,"li"),"input"));
          valueObj.val("Value");
          valueObj.addClass("autocreated");
          valueObj.siblings("ol").append(oLiArr);
        }
        $(d).addClass("dotted");
      }
			a_insertBefore(d, e, a_getDbT(d, "li"));
			jE.setActiveLI(e);
      if(c == 1)
        jE.addFormItem(a_getDbT(a_getDbT(e,"ol"),"div"),2,path,del);
      fixDeptWidth();
      renderAutocomplete()
		}
	},
	moveFormItem: function(a, b) {
		var c = jE.getLI(a);
		if (c) {
			var d = a_getAbT(c, "ol");
			if (d) {
				var e;
				if (e = a_getSibling(c, (b ? "next": "previous"))) {
					if (b) e = a_getSibling(e, "next")
				} else if (b) {
					e = jE.getChildrenByTag(d, "li", "first")
				}
				a_insertBefore(d, c, e)
			}
		}
	},
	copyFormItem: function(a) {
		var b = jE.getLI(a);
		if (b) {
			var c = a_getAbT(b, "ol");
			if (c) {
				jE.copyObj.liObj = b.cloneNode(true);
				jE.copyObj.olClassStr = c.className;
				a_addClass(jE.copyObj.liObj, "deleted", false);
				var d = (c.className == "hashOL");
				var e;
				if (!jE.xMLflag) {
					e = b
				} else {
					if (e = jE.getChildrenByTag(b, "ol", "first")) {
						e = a_getDbT(e, "li")
					}
				}
				var f = "";
				if (e) {
					var g = a_getDbT(e, "input", "leftINPUT");
					if (g) {
						if (g.type == "hidden") f += "#";
						else f += '"' + g.value + '"';
						f += ":";
						var h = jE.getChildrenByTag(e, "textarea", "first");
						if (h) {
							f += '"' + h.value + '"'
						} else {
							if (a_hasClass(e, "arrayLI")) {
								f += "[]"
							} else {
								f += "{}"
							}
						}
					}
				}
				jE.messageRight(a, "<b>" + (d ? "Array item": "Object") + " copied:</b><br>" + f);
				var j = "none";
				if (!jE.xMLflag) {
					j = "pasteIMG";
          $("IMG.pasteIMG").show();
					//jE.alterCSS("IMG.pasteIMG", "display", "inline")

				} else {
					var k = a_getAbT(c, "li");
					if (k) {
						var l = jE.getChildrenByTag(k, "input", "leftINPUT");
						if (l) {
							var m = (l.value == "attributes");
							j = m ? "pasteAttributesIMG": "pasteChildnodesIMG";
							var n = m ? "pasteChildnodesIMG": "pasteAttributesIMG";
              $("IMG."+j).show();
              $("IMG."+n).hide();
							//jE.alterCSS("IMG." + j, "display", "inline");
							//jE.alterCSS("IMG." + n, "display", "none")
						}
					}
				}
				var o = a_getArrayDbT(jE.jsonFormDataDIVObj, "img", j);
				if (o) {
					for (var i in o) o[i].title = "Paste: " + f
				}
			}
		}
	},
	pasteFormItem: function(a, b) {
		if (jE.copyObj.liObj) {
			var c = a_getAbT(a, "ol");
			if (c) {
				var d = jE.copyObj.liObj.cloneNode(true);
				jE.setActiveLI(d);
				a_insertBefore(c, d, a_getDbT(c, "li"));
				if (c.className != jE.copyObj.olClassStr) {
					var e = a_getDbT(d, "input", "leftINPUT");
					var f = a_getDbT(d, "span", "indexSPAN");
					if (c.className == "hashOL") {
						f.innerHTML = "[*]";
						e.type = "hidden"
					} else {
						f.innerHTML = "";
						e.type = "text";
						e.value = "*"
					}
				}
				var g = a.title.replace("Paste: ", "<b>Pasted:</b><br>");
				jE.messageRight(a, g)
			}
		} else {
			jE.messageRight(a, "</b>Nothing in clipboard.</b>")
		}
	},
	formClicked: function(e) {
		var a = a_getTarget(e);
		if (!a_hasClass(a, "clickable")) {
			var b = a_getAbT(a, "li");
			if (b) jE.setActiveLI(b)
		}
	},
	getLI: function(a) {
		var b = a_getAbT(a, "li");
		if (b) {
			jE.setActiveLI(b);
			return b
		}
	},
	setActiveLI: function(a) {
		a_addClass(jE.activeLI, "activeLI", false);
		a_addClass(a, "activeLI");
		jE.activeLI = a
	},
	getReadonly: function(a) {
		return (a == "attributes" || a == "childNodes" || a == "textNode")
	},
	formatNum: 0,
	linebreakStr: "",
	errorCount: [],
	error1Msg: "",
	form2json: function(a) {
		jE.errorCount = [0, 0];
		jE.error1Msg = "";
		jE.formatNum = a;
		jE.linebreakStr = a ? "\n": "";
		var b = jE.jsonFormDataDIVObj;
		if (b) {
			var c = a_getObI("newJsonTEXTAREA");
			c.value = "Processing..";
			if (a == 2) jE.xMLRootStr = a_getObI("xmlRootINPUT").value;
			var d = "";
			var e = 0;
			if (a == 2) {
				e = 1;
				if (jE.xMLdoctypeStr) {
					d += jE.xMLdoctypeStr + jE.linebreakStr
				}
				d += "<" + jE.xMLRootStr
			}
			d += jE.form2jsonStep(b, e, "", false, []);
			if (a == 2) {
				d += "</" + jE.xMLRootStr + ">"
			}
			c.value = d;
			//a_display(a_getObI("evalButtonINPUT"), (a < 2));
			var f = "";
			if (jE.errorCount[0]) f = jE.getPluralStr(jE.errorCount[0], 'name') + 'left empty, replaced by "Unspecified".\n';
			if (jE.errorCount[1]) f += jE.getPluralStr(jE.errorCount[1], 'nonstring value') + "left empty, replaced by 0 in " + jE.error1Msg.substr(0, jE.error1Msg.length - 2) + ".";
			if (f) {
				f = "\n\nWarning:\n" + f;
				alert("Form convert to " + jE.formatStrArray[a] + "." + f)
			}
		}
	},
	form2jsonStep: function(d, e, f, in_arr, path) {
		var h = jE.getChildrenByTag(d, "input");
		if (!h){
			h = $(d).find("input")[0];
			d = $(h).parent()[0];
		}
		else{
			h = h[0];
		}
		if (h) {
			var j = "";
			var p;
			var k = "";
			var l = processText(h.value);
			var n = jE.getChildrenByTag(d, "ol", "first");
      var s = e;
			
			if (n){
				p = jE.getChildrenByTag(n, "li");
			}
			if (h.type != "hidden") {
				if (!l || l == "*") {
					jE.errorCount[0]++;
					l = "Unspecified";
					h.value = l
				}
				if (!p){
					k += '"' + l + '"';
				} else {
          s = e + 1;
          if (in_arr) {
  					k += '{"' + l + '":';
  				} else {
  					k += '"' + l + '":';
  				}
        }
        // Check if this is a renamed key.
        var oldval = h.getAttribute("oldval");
        if (oldval != null && oldval != l){
          var this_path = $.extend(true,[],path);
          this_path.push(oldval);
          // First check if it was the auto-injected "Value" key that was renamed (pointing to the old vals). Note if "Value" is not renamed, the backend will just assume that the name is "Value" anyway.
          var sibs = $(d).siblings("li");
          var key_to_old_vals = sibs.length > 0;
          $.each(sibs, function(index, val){
            if ($(val).children("input").length != 2){
              key_to_old_vals = false;
            }
          });
          if (key_to_old_vals){
            // Add to path pointing to new key for old values.
            var path_and_key_to_old = $.extend(true, [], path);
            path_and_key_to_old.push(l);
            for (var idx = 0; idx < arr_path_and_old_val_key.length; idx++){
              if (JSON.stringify(arr_path_and_old_val_key[idx]) == JSON.stringify(path_and_key_to_old)){
                arr_path_and_old_val_key.splice(idx,1);
                break;
              }
            }
            arr_path_and_old_val_key.push(path_and_key_to_old);
          } else {
            for(var idx = 0; idx < rename_paths.length; idx++){
              if (JSON.stringify(rename_paths[idx][0]) == JSON.stringify(this_path)){
                rename_paths.splice(idx,1);
                break;
              }
            }
            rename_paths.push([this_path, l]);
          }
        }
        // Check if this is a new key (and has a sibling Default input)
        var defaultInput = $(h).siblings("input.leftINPUT:not(.objectNameINPUT)");
        if (defaultInput.length == 1 && $(d).siblings("li").length > 0){
          var path_new_key_and_default = $.extend(true,[],path).concat([l, defaultInput.val()]);
          for (var idx = 0; idx < arr_path_and_vals.length; idx++){
            if (JSON.stringify(arr_path_and_vals[idx]) == JSON.stringify(path_new_key_and_default)){
              arr_path_and_vals.splice(idx,1);
              break;
            }
          }
          arr_path_and_vals.push(path_new_key_and_default);
        }
			}
			j += padHTML(k, e);
			if (n) {
				var o = a_hasClass(n, "hashOL");
				var p_ol_children = null;
				if (p && p.length >= 1){
					var p_ol = jE.getChildrenByTag(p[0], "ol", "first");
		
					if (p_ol){
						p_ol_children = jE.getChildrenByTag(p_ol, "li");
					}
				}
        var one_child = (p && p.length == 1);
				j += p ? (o ? (p_ol_children ? "{" : "") : (one_child ? "" : "[")) : "";
				j += jE.linebreakStr;
				if (p) {
					var q = 0;
          if (p_ol_children && p.length > 1 && o) l = "." + l;
					for (var i in p) {
						if (!a_hasClass(p[i], "deleted")) {
							q++;              
              var ext_path = $.extend(true,[],path);
              if (l != "") ext_path.push(l);
							j += jE.form2jsonStep(p[i], s, ",", !o, ext_path);
						}
					}
					if (q) {
						var L = j.lastIndexOf(",");
						j = j.substring(0, L) + j.substring(L + 1)
					}
				}
				k = p ? (o ? (p_ol_children ? "}" : "") : (one_child ? "" : "]")) : "";
			}
      if (k) j += padHTML(k, e);
			if (h.type != "hidden" && p && in_arr){
				j += "}"
			}
			j += f + jE.linebreakStr;
			return j
		}
		function processText(a) {
			if (typeof a != "string")
				return "";
			return a_trim(a.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n"))
		}
		function padHTML(a, b) {
			if (!jE.formatNum) return a;
			var c = "";
			while (b > 0) {
				c += "\t";
				b--
			}
			return c + a
		}
	},
	evalNewJson: function() {
		var a = a_getObI("newJsonTEXTAREA");
		if (a) {
			var b = null;
			try {
				jE.jsonObj = eval("(" + a.value + ")");
        try {
          // Ensure department at root with only one key
          var jERootKeys = Object.keys(jE.jsonObj);
          if(jERootKeys.length != 1 || jERootKeys[0] != "Department" || 
            !(jE.jsonObj[jERootKeys[0]] instanceof Object) || (jE.jsonObj[jERootKeys[0]] instanceof Array) || 
            Object.keys(jE.jsonObj[jERootKeys[0]]).length != 1)
            throw {message:"Must have \"Department\" key at root pointing to a hash with only one key",name:"Invalid Hash"};
          dfs(jE.jsonObj);
        } catch(e) {
          b = e.name + ": " + e.message;
        }
			} catch(e) {
				b = "Invalid.\n\nJS " + e.name + ": " + e.message;
			} finally {
        if(b != null) {
          alert(b);
          return -1;
        }        
			}
		}
	},
	getChildrenByTag: function(a, b, c) {
		if (!a || !b) return;
		var d = [];
		for (var i = 0,
		domObj; domObj = a.childNodes[i]; i++) {
			if (domObj.nodeName != '#text') {
				if (domObj.tagName.toLowerCase() == b) {
					if (c) return domObj;
					d.push(domObj)
				}
			}
		}
		return d.length ? d: null
	},
	alterCSS: function(a, b, c) {
		if (!a || !b || !c) return;
		var d;
		if (document.all) {
			d = "rules"
		} else if (document.getElementById) {
			d = "cssRules"
		} else {
			return
		}

		var a = jE.lcSelectorTag(a);

		//lowercase for chrome
		if (a_isWK) {
			var parts_arr= a.split(".");
			if (parts_arr.length>1) {
				parts_arr[1]= parts_arr[1].toLowerCase();
				a= parts_arr.join(".");
			}
		}

		var e = document.styleSheets[0][d];
		for (var i= 0, ruleObj; ruleObj = e[i]; i++) {
			if (jE.lcSelectorTag(ruleObj.selectorText)==a) ruleObj.style[b]= c;
		}
	},
	lcSelectorTag: function(a) {
		var x = a.indexOf("#");
		if (x < 0) x = a.indexOf(".");
		if (x > 0) a = a.substr(0, x).toUpperCase() + a.substr(x);
		return a
	},
	messageDivObj: null,
	messageCloseObj: null,
	messageDivContentObj: null,
	messageTimer: null,
	fadeObj: null,
	messageRight: function(a, b, c) {
		clearTimeout(jE.messageTimer);
		a_fill(jE.messageDivContentObj, b);
		if (a) {
			var d = a_getPoint(a);
			d.x += a.offsetWidth;
			jE.messageDivObj.style.left = d.x - 254 + "px";
			jE.messageDivObj.style.top = d.y - 88 + "px";
			a_display(jE.messageDivObj);
			if (c == undefined) c = 2;
			if (c > 0) jE.messageTimer = window.setTimeout(delayedClose, c * 1000);
			a_addClass(jE.messageDivObj, "messageAutoCloseDIV", (c > 0));
			jE.messageCloseObj.src = "/img/je/" + (c > 0 ? "countdown": "popupClose") + ".gif"
		}
		function delayedClose() {
			if (a_displayed(jE.messageDivObj)) {
				jE.displayFade(jE.messageDivObj, false)
			}
		}
	},
	messageClose: function() {
		clearTimeout(jE.messageTimer);
		a_display(jE.messageDivObj, false)
	},
	displayFade: function(a, b) {
		if (!a) return;
		clearTimeout(jE.messageTimer);
		a_display(a);
		a.fadeIncrement = (b ? 4 : -4);
		a.opacityNum = b ? 1 : 99;
		a_setOpacity(a, a.opacityNum);
		jE.displayFadeStep(a)
	},
	displayFadeStep: function(a, b) {
		jE.fadeObj = a;
		a.opacityNum += a.fadeIncrement;
		a_setOpacity(a, a.opacityNum);
		if (a.opacityNum > 0 && a.opacityNum < 100) {
			window.setTimeout('jE.displayFadeStep(jE.fadeObj); ', 5)
		} else {
			a_setOpacity(a, 100);
			if (a.fadeIncrement < 0) a_display(a, false)
		}
	},
	getPluralStr: function(a, b) {
		return a + " " + b + (a != 1 ? "s": "") + " "
	},
	sampleClicked: function(e) {
		var a = a_getObI("jsonTEXTAREA");
		if (a) {
			var b = a_getTarget(e);
			if (a_hasClass(b, "clickable")) {
				var c = b.innerHTML;
				var d = a_getObI("sample" + c);
				if (d) {
					if (jE.jsonFormDataDIVObj) {
						if (!confirm("Clear existing Form?")) return
					}
					var f = d.innerHTML;
					f = f.substring(4, f.length - 3);
					a.value = a_trim(f);
					a_fill(jE.jsonFormDIVObj, "");
					jE.jsonFormDataDIVObj = null
				}
			}
		}
	},
	pageInit: function(a, b, c) {
		a_addListener(a_getObI("pickSampleSPAN"), "click", jE.sampleClicked);
		jE.jsonFormDIVObj = a_getObI("jsonFormDIV");
		jE.messageDivObj = a_getObI("messageDIV");
		a_display(jE.messageDivObj, false);
		jE.messageCloseObj = a_getObI("messageCloseIMG");
		jE.messageDivContentObj = a_getObI("messageContentDIV")
	},
  checkValidDepartment: function(f) {
    // Runs through all steps that have not been completed, and if have not broken at any point, then execute delegated function
    // In this case, the function does a backend call to update department
    // In other case (add item) we will have one modal and update its current row (and wipe existing department modal view on render), so we know what the global var corresponds to.
    if(jE.jsonObj == null) {
      if(jE.jsonToForm(true) == -1) return -1;
    }    
    if($("#newJsonTEXTAREA").val() == "") {
      jE.form2json(0);
    }
    if(jE.evalNewJson() == -1) return -1;
    // Check if this object is the same. If so, alert there was no change and return -1.
    // if(JSON.stringify(jE.jsonObj).replace(/\"/g,"") == $("ul#dept_datetime_list li:first a").attr("dept")) {
    //   $.growl("You did not change the department.",growl_resp.pass);
    //   return -1;
    // }
    f();
  }
};
jE = jsonEditor;
a_addListener(window, "load", jE.pageInit);

function fixDeptWidth() {
  var max=null;
  $("#jsonFormDataDIV [path]").each(function(){
    if(max==null||$(this).attr("path").split(",").length > $(max).attr("path").split(",").length)
      max=this;
  });
  if(max != null)
    $("#jsonFormDataDIV").width(490+49*$(max).attr("path").split(",").length + "px");
}

function renderAutocomplete() {
  $(":not([data-provide=typeahead])[path]").each(function(i,e){
    $.ajax({
      url: domain + "/items/subdepartments/global",
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      data: {path: e.getAttribute("path")},
      xhrFields: {withCredentials: true},
      crossDomain: true,
      success: function(json) {
        var lookahead_choices = "[]";
        if(json.success) {
          for(var i = 0; i < json.result.options.length; i++) {
            if(json.result.options[i][0] == ".")
            {
              json.result.options[i] = json.result.options[i].substring(1);
            }
          }
          lookahead_choices = JSON.stringify(json.result.options);
          for(var k in json.result.filldown_options) {
            var temp_path = e.getAttribute("path").split(",");
            var undotted_key = k;
            if(k[0]=='.')
              undotted_key = k.substring(1);
            temp_path.push(undotted_key);
            filldown_options[temp_path] = [];
            for(var k_idx = 0; k_idx < json.result.filldown_options[k].length; k_idx++) {
              var undotted_val = json.result.filldown_options[k][k_idx];
              if(undotted_val[0]=='.')
                undotted_val = undotted_val.substring(1);
              filldown_options[temp_path].push(undotted_val);
            }
          }

          $(e).attr({
            "data-provide":"typeahead",
            "autocomplete": "off",
            "data-updater":'return typeaheadUpdater(this.$element,k);',
            "data-source": lookahead_choices
          });
          $(".typeahead").typeahead();
        }
      }
    });
  });
}

function typeaheadUpdater(t,k) {
  var p=t.attr("path").split(",");p.push(k);
  if(t.attr("value")!=k){
    t.attr("value",k);
    var a=t.siblings("ol");
    var d=filldown_options;
    a.children("li").remove();
    if(d[p]!==undefined){
      var e=a.children("div").children("span")[0];
      if(d[p].length==0){
        jE.addFormItem(e,2,p.toString(),1);
        a.children("li:first").children("input").attr("path",p);
      }
      for(var i=0;i<d[p].length;i++){
        var g=p.concat(d[p][i]).toString();
        jE.addFormItem(e,4,g,1);
        var b=a.children("li:first");var c=b.children("input");c.val(d[p][i]);
        var f=b.children("ol");
        jE.addFormItem(f.children("div").children("span")[0],2,g,1);
        f.children("li:first").children("input").attr("path",g);
      }
      renderAutocomplete();
    }
  }
  return k;
}

function callAddFormItem(e,c) {
  var a=e.parents("ol").first().siblings("input");
  if(a.attr("type")=="hidden"){
    a=e.parents("ol").first().parents("ol").first().siblings("input");
  }
  if(c==1) {
    if(confirm("WARNING: This will add this new property to every other " + a.val() + ".")) {
      postCallAddFormItem(a,c,e);
    }
  } else {
    e.parents("ol").first().removeClass("hashOL");
    postCallAddFormItem(a,c,e);
  }
}

function postCallAddFormItem(a,c,e) {
  jE.addFormItem(
    e.parent()[0], c, a.attr("path")+","+a.val(), !0);
  e.siblings("span").hide();
}

function enableRename(ele) {
  if(confirm("WARNING: This will enable renaming this attribute. Doing so will force every other item sharing this attribute to also be changed.")) {
    ele.attr("readonly",false);
    ele.removeClass("readonlyINPUT");
    ele.attr("oldVal",ele.val());
    ele.next().hide();
  }
}

function hasDuplicates(obj) {
  var o = {}, i, l = obj.length, dupes = [];
  for(i=0; i<l;i+=1) {
    if(o[obj[i]] !== undefined) dupes.push(obj[i]);
    o[obj[i]] = obj[i];
  }
  return dupes;
}

// Dot keys for multiple children under object. Also throw if:
//   1) 2 children have same name (note this is impossible within an object by eval rules)
//   2) Arrays are in arrays
//   3) Hashes have more than one key in an array
function dfs(obj) {
  if(obj instanceof Object) {
    var badStrings = [];
    if(obj instanceof Array) {
      var objEles = obj.map(function(val,ind) {
        if(typeof val == "string") return val;
        if(val instanceof Object) {
          if(val instanceof Array) {
            throw {message:"Cannot have array as child of array",name:"Invalid Hash"};
          } else {
            var objKeys = Object.keys(val);
            if(objKeys.length != 1) {
              throw {message:"Hashes in arrays must have exactly one key",name:"Invalid Hash"};
            } else return objKeys[0];
          }
        }
      });
      if((badStrings = hasDuplicates(objEles)).length > 0) {
        throw {message:"Cannot have duplicate keys " + badStrings.toString() + " for the same parent",name:"Invalid Hash"};
      }      
      for(var i = 0; i < obj.length; i++) {
        dfs(obj[i]);
      }
    } else {          
      var objKeys = Object.keys(obj);
      for(var i = 0; i < objKeys.length; i++) {
        var k = objKeys[i];
        if(obj[k] instanceof Object && !(obj[k] instanceof Array) && Object.keys(obj[k]).length > 1) {
          var old_k = k;
          k = "." + k;
          obj[k] = obj[old_k];
          delete obj[old_k];
        }
        dfs(obj[k]);
      }
    }
  }
}