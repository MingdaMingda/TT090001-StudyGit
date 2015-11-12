
function pageLoad() {
	console.log("page load");

	var content = document.getElementById("content");
	content.onmouseup = textSelect;
}

function textSelect() {
	console.log("text select");

	var userSelection, text;

	if (window.getSelection) { 
		console.log("select 1");
		text = window.getSelection().toString();
	} else if (document.selection) { 
		console.log("select 2");
		text = document.selection.createRange().text;
	} else {
		console.log("cannot select");
		return;
	}

	if (text) {
		console.log(text);
		//alert(text);
		$sinaMiniBlogShare(document.getElementById("imgSinaShare"));
	} else {
		console.log("null text");
		return;
	}
}

var $sinaMiniBlogShare = function(eleShare, eleContainer) {
	var eleTitle = document.getElementsByTagName("title")[0];
	eleContainer = eleContainer || document;
	var funGetSelectTxt = function() {
		var txt = "";
		if(document.selection) {
			txt = document.selection.createRange().text;	// IE
		} else {
			txt = document.getSelection();
		}
		return txt.toString();
	};
	eleContainer.onmouseup = function(e) {
		e = e || window.event;
		var txt = funGetSelectTxt(), sh = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		var left = (e.clientX - 40 < 0) ? e.clientX + 20 : e.clientX - 40, top = (e.clientY - 40 < 0) ? e.clientY + sh + 20 : e.clientY + sh - 40;
		//var left = e.clientX, top = e.clientY;
		if (txt) {
			eleShare.style.display = "inline";
			eleShare.style.left = left + "px";
			eleShare.style.top = top + "px";
		} else {
			eleShare.style.display = "none";
		}
	};
	eleShare.onclick = function() {
		var txt = funGetSelectTxt(), title = (eleTitle && eleTitle.innerHTML)? eleTitle.innerHTML : "未命名页面";
		if (txt) {
			var share_text = txt + '(来自《' + title + '》)';
			window.open('http://v.t.sina.com.cn/share/share.php?title=' + encodeURIComponent(share_text) + '&url=' + window.location.href);	
		}
	};
};
