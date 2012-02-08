/* Copyright (c) 2011, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function parseXMLPlist(xml) {
	if (xml instanceof String) {
		return;
	}

	var node=xml.getElementsByTagName("dict")[0];

	return parseXMLDictionary(node);
}

function objectForChildNode(childNode) {
	var obj;

	switch (childNode.tagName) {
		case "string":
			obj=childNode.childNodes[0].nodeValue;
			break;

		case "integer":
			obj=parseInt(childNode.childNodes[0].nodeValue);
			break;

		case "real":
			obj=parseFloat(childNode.childNodes[0].nodeValue);
			break;

		case "true":
			obj=true;
			break;

		case "false":
			obj=false;
			break;

		case "date":
			var str=childNode.childNodes[0].nodeValue;
			var dt=str.split("T");
			var ymd=dt[0].split("-");
			var hms=dt[1].split("Z")[0].split(":");
			var date=new Date();
			date.setUTCFullYear(ymd[0]);
			date.setUTCMonth(ymd[1]-1);
			date.setUTCDate(ymd[2]);
			date.setUTCHours(hms[0]);
			date.setUTCMinutes(hms[1]);
			date.setUTCSeconds(hms[2]);
			obj=date;
			break;

		case "dict":
			obj=parseXMLDictionary(childNode);
			break;

		case "array":
			obj=parseXMLArray(childNode);
			break;

		default:
			obj=null;
			break;
	}

	return obj;
}

function parseXMLDictionary(node) {
	var children=node.childNodes;
	var i=0;
	var dict={};

	var key;

	var childNode;

	while (children[i]) {
		if (children[i].tagName=="key") {
			key=children[i].childNodes[0].nodeValue;

			childNode=children[i+2];

			dict[key]=objectForChildNode(childNode);
		}

		i++;
	}

	return dict;
}

function parseXMLArray(node) {
	var children=node.childNodes;
	var i=1;
	var ar=new Array();

	var key;

	var childNode;

	while (children[i]) {
		if (children[i].tagName) {
			var obj=objectForChildNode(children[i]);
			if (obj!=null) {
				ar[ar.length]=obj;
			}
		}

		i++;
	}

	return ar;
}

Object.prototype.toPlistXML=function() {
	var ret="<dict>\n";
	var item;

	for (var i in this) {
		if (this[i] && typeof this[i]!="function") {
			ret+="\t<key>"+i+"</key>\n\t"+this[i].toPlistXML()+"\n";
		}
	}

	ret+="</dict>";

	return ret;
};

Object.prototype.exportXML=function() {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n"+this.toPlistXML()+"\n</plist>";
};

String.prototype.toPlistXML=function() {
	return "<string>"+this+"</string>";
};

Number.prototype.toPlistXML=function() {
	if (this.toFixed()==this) {
		return "<integer>"+this.toString()+"</integer>";
	}

	return "<real>"+this.toString()+"</real>";
};

Date.prototype.toPlistXML=function() {
	return "<date>"+this.getUTCFullYear()+"-"+(this.getUTCMonth()+1)+"-"+this.getUTCDate()+"T"+this.getUTCHours()+":"+this.getUTCMinutes()+":"+this.getUTCSeconds()+"Z</date>";
};

Array.prototype.toPlistXML=function() {
	var ret="<array>\n";

	for (var i=0; i<this.length; i++) {
		if (this[1]!=null && this[i].toPlistXML) {
			if (this[i] instanceof Dictionary || this[i] instanceof Array) {
					item=this[i].toPlistXML();
					item=item.replace(/\n/g, "\n\t");
					ret+="\t"+item+"\n";
					item="";
				} else {
					ret+="\t"+this[i].toPlistXML()+"\n";
				}
		}
	}

	ret+="</array>";

	return ret;
};

Boolean.prototype.toPlistXML=function() {
	if (this==true) {
		return "<true/>";
	}

	return "<false/>";
};