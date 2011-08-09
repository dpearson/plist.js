/* Copyright (c) 2011, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function $(id) {
	return document.getElementById(id);
}

function arrayToHTML(ar, key, padding) {
	var htmlCont="";
	for (var i=0; i<ar.length; i++) {
		if (typeof ar[i]=="string" || ar[i] instanceof String) {
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\">Item "+i+"<input type=\"text\" style=\"position:absolute; left:50%; width:45%; border-width:0px;\" value=\""+ar[i]+"\" id=\""+key+"_"+i+"\"></div>";
		} else if (typeof ar[i]=="number" || ar[i] instanceof Number) {
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\">Item "+i+"<input type=\"text\" style=\"position:absolute; left:50%; width:45%; border-width:0px;\" value=\""+ar[i]+"\" id=\""+key+"_"+i+"\"></div>";
		} else if (typeof ar[i]=="date" || ar[i] instanceof Date) {
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\">Item "+i+"<span style=\"position:absolute; left:50%; width:45%; border-width:0px;\"><select id=\""+key+"_"+i+"month\">"
			var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			for (var n=1; n<=12; n++) {
				htmlCont+="<option value=\""+n+"\"";
				if (ar[i].getMonth()+1==n) {
					htmlCont+=" selected=\"selected\"";
				}
				htmlCont+=">"+months[n-1]+"</option>";
			}
			var actHours=ar[i].getHours();
			var pm=false;
			if (actHours>12) {
				actHours-=12;
				pm=true;
			}
			htmlCont+="</select> <input type=\"text\" maxlength=2 size=2 id=\""+key+"_"+i+"day\" value=\""+ar[i].getDate()+"\"> <input type=\"text\" maxlength=4 size=4 id=\""+key+"_"+i+"year\" value=\""+ar[i].getFullYear()+"\"><blah style=\"padding-left:50px;\"><input type=\"text\" maxlength=2 size=2 id=\""+key+"_"+i+"hr\" value=\""+actHours+"\">:<input type=\"text\" maxlength=2 size=2 id=\""+key+"_"+i+"min\" value=\""+ar[i].getMinutes()+"\">:<input type=\"text\" maxlength=2 size=2 id=\""+key+"_"+i+"sec\" value=\""+ar[i].getSeconds()+"\"> <select id=\""+key+"_"+i+"tod\"><option value=\"0\">AM</option><option value=\"12\""
			if (pm) {
				htmlCont+=" selected=\"selected\"";
			}
			htmlCont+=">PM</option></select>";
			htmlCont+="</select></span></div>";
		} else if (typeof ar[i]=="boolean" || ar[i] instanceof Boolean || ar[i]==false) {
			var checked=" checked=\"checked\"";
			if (ar[i]==false) {
				checked="";
			}
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\">Item "+i+"<input type=\"checkbox\" style=\"position:absolute; left:50%; border-width:0px;\" value=\""+ar[i]+"\" id=\""+key+"_"+i+"\""+checked+"></div>";
		} else if (ar[i] instanceof Dictionary) {
			htmlCont+="<div style=\"position:relative; left:5%; width:100%;  padding:"+padding+"px;\"><img src=\"res/arrow-right.png\" style=\"width:12px; position:absolute; left:-12px;\" id=\""+key+"_"+i+"arrow\" onclick=\"if($('"+key+"_"+i+"cont').style.display=='none'){$('"+key+"_"+i+"cont').style.display='';$('"+key+"_"+i+"arrow').src='res/arrow-down.png';}else{$('"+key+"_"+i+"cont').style.display='none';$('"+key+"_"+i+"arrow').src='res/arrow-right.png';}\"> Item "+i+"</div><div style=\"position:relative; left:5%; width:90%;  padding-bottom:"+padding+"px; padding-left:"+padding+"px; padding-right:"+padding+"px; display:none;\" id=\""+key+"_"+i+"cont\">"+dictToHTML(ar[i], key+"_"+i, 15)+"</div>";
		} else if (ar[i] instanceof Array) {
			htmlCont+="<div style=\"position:relative; left:5%; width:100%;  padding:"+padding+"px;\"><img src=\"res/arrow-right.png\" style=\"width:12px; position:absolute; left:-12px;\" id=\""+key+"_"+i+"arrow\" onclick=\"if($('"+key+"_"+i+"cont').style.display=='none'){$('"+key+"_"+i+"cont').style.display='';$('"+key+"_"+i+"arrow').src='res/arrow-down.png';}else{$('"+key+"_"+i+"cont').style.display='none';$('"+key+"_"+i+"arrow').src='res/arrow-right.png';}\"> Item "+i+"</div><div style=\"position:relative; left:5%; width:90%;  padding-bottom:"+padding+"px; padding-left:"+padding+"px; padding-right:"+padding+"px; display:none;\" id=\""+key+"_"+i+"cont\">"+arrayToHTML(ar[i], key+"_"+i, 15)+"</div>";
		}		
	}

	return htmlCont;
}

function dictToHTML(dict, parent, padding) {
	var htmlCont="";
	for (var i=0; i<dict.items[0].length; i++) {
		if (typeof dict.items[1][i]=="string" || dict.items[1][i] instanceof String || typeof dict.items[1][i]=="number" || dict.items[1][i] instanceof Number) {
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\"><input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"key\"><input type=\"text\" style=\"position:absolute; left:50%; width:45%; border-width:0px;\" value=\""+dict.items[1][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"val\"></div>";
		} else if (typeof dict.items[1][i]=="date" || dict.items[1][i] instanceof Date) {
			//htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\"><input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\"><input type=\"datetime\" style=\"position:absolute; left:50%; width:50%; border-width:0px;\" value=\""+dict.items[1][i]+"\"></div>";
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\"><input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"key\"><span style=\"position:absolute; left:50%; width:45%; border-width:0px;\"><select id=\""+dict.items[0][i]+"_"+parent+"month\">"
			var months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			for (var n=1; n<=12; n++) {
				htmlCont+="<option value=\""+n+"\"";
				if (dict.items[1][i].getMonth()+1==n) {
					htmlCont+=" selected=\"selected\"";
				}
				htmlCont+=">"+months[n-1]+"</option>";
			}
			var actHours=dict.items[1][i].getHours();
			var pm=false;
			if (actHours>12) {
				actHours-=12;
				pm=true;
			}
			htmlCont+="</select> <input type=\"text\" maxlength=2 size=2 id=\""+dict.items[0][i]+"_"+parent+"day\" value=\""+dict.items[1][i].getDate()+"\"> <input type=\"text\" maxlength=4 size=4 id=\""+dict.items[0][i]+"_"+parent+"year\" value=\""+dict.items[1][i].getFullYear()+"\"><blah style=\"padding-left:50px;\"><input type=\"text\" maxlength=2 size=2 id=\""+dict.items[0][i]+"_"+parent+"hr\" value=\""+actHours+"\">:<input type=\"text\" maxlength=2 size=2 id=\""+dict.items[0][i]+"_"+parent+"min\" value=\""+dict.items[1][i].getMinutes()+"\">:<input type=\"text\" maxlength=2 size=2 id=\""+dict.items[0][i]+"_"+parent+"sec\" value=\""+dict.items[1][i].getSeconds()+"\"> <select id=\""+dict.items[0][i]+"_"+parent+"tod\"><option value=\"0\">AM</option><option value=\"12\""
			if (pm) {
				htmlCont+=" selected=\"selected\"";
			}
			htmlCont+=">PM</option></select>";
			htmlCont+="</select></span></div>";
		} else if (typeof dict.items[1][i]=="boolean" || dict.items[1][i] instanceof Boolean || dict.items[1][i]==false) {
			var checked=" checked=\"checked\"";
			if (dict.items[1][i]==false) {
				checked="";
			}
			htmlCont+="<div style=\"width:100%; padding:"+padding+"px; position:relative; left:5%;\"><input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"key\"><input type=\"checkbox\" style=\"position:absolute; left:50%; border-width:0px;\""+checked+"\" id=\""+dict.items[0][i]+"_"+parent+"val\"></div>";
		} else if (dict.items[1][i] instanceof Dictionary) {
			htmlCont+="<div style=\"position:relative; left:5%; width:100%;  padding:"+padding+"px;\"><img src=\"res/arrow-right.png\" style=\"width:12px; position:absolute; left:-12px; top:20px;\" id=\""+dict.items[0][i]+"_"+parent+"arrow\" onclick=\"if($('"+dict.items[0][i]+"_"+parent+"cont').style.display=='none'){$('"+dict.items[0][i]+"_"+parent+"cont').style.display='';$('"+dict.items[0][i]+"_"+parent+"arrow').src='res/arrow-down.png';}else{$('"+dict.items[0][i]+"_"+parent+"cont').style.display='none';$('"+dict.items[0][i]+"_"+parent+"arrow').src='res/arrow-right.png';}\"> <input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"key\"></div><div style=\"position:relative; left:5%; width:90%;  padding-bottom:"+padding+"px; padding-left:"+padding+"px; padding-right:"+padding+"px; display:none;\" id=\""+dict.items[0][i]+"_"+parent+"cont\">"+dictToHTML(dict.items[1][i], dict.items[0][i]+"_"+parent, 15)+"</div>";
		} else if (dict.items[1][i] instanceof Array) {
			htmlCont+="<div style=\"position:relative; left:5%; width:100%;  padding:"+padding+"px;\"><img src=\"res/arrow-right.png\" style=\"width:12px; position:absolute; left:-12px; top:20px;\" id=\""+dict.items[0][i]+"_"+parent+"arrow\" onclick=\"if($('"+dict.items[0][i]+"_"+parent+"cont').style.display=='none'){$('"+dict.items[0][i]+"_"+parent+"cont').style.display='';$('"+dict.items[0][i]+"_"+parent+"arrow').src='res/arrow-down.png';}else{$('"+dict.items[0][i]+"_"+parent+"cont').style.display='none';$('"+dict.items[0][i]+"_"+parent+"arrow').src='res/arrow-right.png';}\"> <input type=\"text\" style=\"width:45%; border-width:0px; font-size:13px;\" value=\""+dict.items[0][i]+"\" id=\""+dict.items[0][i]+"_"+parent+"key\"></div><div style=\"position:relative; left:5%; width:90%;  padding-bottom:"+padding+"px; padding-left:"+padding+"px; padding-right:"+padding+"px; display:none;\" id=\""+dict.items[0][i]+"_"+parent+"cont\">"+arrayToHTML(dict.items[1][i], dict.items[0][i]+"_"+parent, 15)+"</div>";
		}		
	}

	return htmlCont;
}

var plroot;

function savearray(ar, key) {
	for (var i=0; i<ar.length; i++) {
			if (typeof ar[i]=="string" || ar[i] instanceof String || typeof ar[i]=="number" || ar[i] instanceof Number) {
				if ($(key+"_"+i)!=null) {
					ar[i]=$(key+"_"+i).value;
				}
			} else if (typeof ar[i]=="date" || ar[i] instanceof Date) {
				var d=new Date();
				d.setFullYear($(key+"_"+i+"year").value, $(key+"_"+i+"month").value-1, $(key+"_"+i+"day").value);
				d.setHours(parseInt($(key+"_"+i+"hr").value)+parseInt($(key+"_"+i+"tod").value), $(key+"_"+i+"min").value, $(key+"_"+i+"sec").value);
				ar[i]=d;
			} else if (typeof ar[i]=="boolean" || ar[i] instanceof Boolean) {
				if ($(key+"_"+i)!=null) {
					ar[i]=$(key+"_"+i).checked;
				}
			} else if (ar[i] instanceof Dictionary) {
				if ($(key+"_"+i+"cont")!=null) {
					ar[i]=savedict(ar[i], key+"_"+i);
				}
			} else if (ar[i] instanceof Array || typeof ar[i]=="array") {
				if ($(key+"_"+i+"cont")!=null) {
					ar[i]=savearray(ar[i], key+"_"+i);
				}
			}
	}

	return ar;
}

function savedict(dict, key) {
	for (var i=0; i<dict.items[0].length; i++) {
			if (typeof dict.items[1][i]=="string" || dict.items[1][i] instanceof String || typeof dict.items[1][i]=="number" || dict.items[1][i] instanceof Number) {
				if ($(dict.items[0][i]+"_"+key+"val")!=null) {
					var keyval=$(dict.items[0][i]+"_"+key+"key").value;
					var val=$(dict.items[0][i]+"_"+key+"val").value;
					if (keyval!=dict.items[0][i]) {
						dict.changeKey(dict.items[0][i], keyval);
					}

					if (val!=dict.items[1][i]) {
						dict.set(val, keyval);
					}
				}
			} else if (typeof dict.items[1][i]=="boolean" || dict.items[1][i] instanceof Boolean) {
				if ($(dict.items[0][i]+"_"+key+"val")!=null) {
					var keyval=$(dict.items[0][i]+"_"+key+"key").value;
					var val=$(dict.items[0][i]+"_"+key+"val").checked;
					if (keyval!=dict.items[0][i]) {
						dict.changeKey(dict.items[0][i], keyval);
					}

					if (val!=dict.items[1][i]) {
						dict.set(val, keyval);
					}
				}
			} else if (typeof dict.items[1][i]=="date" || dict.items[1][i] instanceof Date) {
				var keyval=$(dict.items[0][i]+"_"+key+"key").value;
				if (keyval!=dict.items[0][i]) {
					dict.changeKey(dict.items[0][i], keyval);
				}
				var d=new Date();
				d.setFullYear($(dict.items[0][i]+"_"+key+"year").value, $(dict.items[0][i]+"_"+key+"month").value-1, $(dict.items[0][i]+"_"+key+"day").value);
				d.setHours(parseInt($(dict.items[0][i]+"_"+key+"hr").value)+parseInt($(dict.items[0][i]+"_"+key+"tod").value), $(dict.items[0][i]+"_"+key+"min").value, $(dict.items[0][i]+"_"+key+"sec").value);
				dict.items[1][i]=d;
			} else if (dict.items[1][i] instanceof Dictionary) {
				if ($(dict.items[0][i]+"_"+key+"key")!=null) {
					var keyval=$(dict.items[0][i]+"_"+key+"key").value;
					if (keyval!=dict.items[0][i]) {
						dict.changeKey(dict.items[0][i], keyval);
					}

					dict.set(savedict(dict.items[1][i], dict.items[0][i]+"_"+key), keyval);
				}
			} else if (dict.items[1][i] instanceof Array || typeof dict.items[1][i]=="array") {
				if ($(dict.items[0][i]+"_"+key+"key")!=null) {
					var keyval=$(dict.items[0][i]+"_"+key+"key").value;
					if (keyval!=dict.items[0][i]) {
						dict.changeKey(dict.items[0][i], keyval);
					}

					dict.set(savearray(dict.items[1][i], dict.items[0][i]+"_"+key), keyval);
				}
			}
	}

	return dict;
}

function save() {
	alert(savedict(plroot, "root").exportXML());
}

function dragOver(e) {
	e.stopPropagation();
	e.preventDefault();
}

function fload(e) {
		if ($("loadimg")) {
			$("loadimg").style.display="";
		}

		var dict=parseXMLPlist(new DOMParser().parseFromString(e.target.result, "text/xml"));
		if (dict!=null && dict instanceof Dictionary) {
			plroot=dict;
			$("doc").innerHTML=dictToHTML(dict, "root", 15);
			if ($("loadimg")) {
				$("loadimg").style.display="none";
			}
		} else {
			$("start").innerHTML="That isn't an XML plist...";
			setTimeout($("start").innerHTML="Drag a File Here to Start", 2000);
		}
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var files=e.dataTransfer.files;
	var f=files[0];
	if (f.name.split(".plist").length==1) {
		$("start").innerHTML="That isn't a plist...";
		setTimeout(showLaunch, 2000);
		return;
	}

	if (window.FileReader) {
		var fr=new FileReader();
		fr.onload=fload;

		fr.readAsText(f);
	}
}

function fselect(e) {
	e.stopPropagation();
	e.preventDefault();

	var files=e.target.files;
	var f=files[0];
	if (f.name.split(".plist").length==1) {
		$("start").innerHTML="That isn't a plist...";
		setTimeout(showLaunch, 2000);
		return;
	}

	var fr=new FileReader();
	fr.onload=fload;

	fr.readAsText(f);
}

function urlselect() {
	var url=$("fileselect").value;
	if (url.split("file://").length==1 && url.split("http://").length==1 && url.split("https://").length==1 && url.split("//").length==1) {
		url="file://"+url;
	}

	var xr=new XMLHttpRequest();

	xr.onreadystatechange=function() {
		var res=xr.responseXML;

		if (res) {
			var dict=parseXMLPlist(res);
			plroot=dict;
			$("doc").innerHTML=dictToHTML(dict, "root", 15);
		}
	};

	xr.open("GET", url, true);
	xr.send();
}

function showLaunch() {
	if (!window.File || !window.FileList || !window.FileReader) {
		//$("start").innerHTML="Browser not supported :(";
		$("start").innerHTML="<input type=\"url\" id=\"fileselect\" style=\"width:80%; height:50px; position:absolute; left:10%; font-size:26px; border-width:0px;\" placeholder=\"Full File Path\">";
		$("fileselect").addEventListener("change", urlselect, false);
		$("fileselect").focus();
	} else if (window.opera) {
		$("start").innerHTML="<input type=\"file\" id=\"fileselect\" style=\"width:80%; height:50px; position:absolute; left:10%;\">";
		$("fileselect").addEventListener("change", fselect, false);
	} else {
		$("start").innerHTML="Drag a File Here to Start";
	}
}

document.body.addEventListener("dragenter", dragOver, false);
document.body.addEventListener("dragover", dragOver, false);
document.body.addEventListener("drop", drop, false);

showLaunch();