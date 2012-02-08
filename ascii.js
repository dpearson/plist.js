/* Copyright (c) 2011, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

//parseASCIIPlist("{ Filter = { Bundles = ( \"com.apple.mobilesafari\" ); }; }");
//alert(parseASCIIPlist("{ Test = This; Test2 = \"This too\"; }"));

function startsWithIgnoringSpace(str, what) {
	return str.replace(/ /g, "").substring(0, what.length)==what;
}

function parseASCIIPlist(ascii) {
	return parseASCIIDictionary(ascii);
}

function parseASCIIDictionary(item) {
	var i=0;
	var n=0;
	var comp=0;
	var countOpen=0;
	var workingQuotes=false;
	var txt="";
	var keys=new Array();
	var vals=new Array();

	var sp=item.split("{");

	if (sp.length==1) {
		return null;
	}

	for (var k=1; k<sp.length; k++) {
		txt+="{"+sp[k];
	}

	txt=txt.substring(1, txt.length);
	item="";

	sp=txt.split("}");

	if (sp.length==1) {
		return null;
	}

	for (var l=0; l<sp.length-1; l++) {
		item+=sp[l]+"}";
	}

	item=item.substring(0, item.length-1);

	while (item[i]) {
		if (!keys[n]) {
			keys[n]="";
		}

		if (!vals[n]) {
			vals[n]="";
		}

		if (comp==0) {
			while (item[i] && item[i]!="=") {
				keys[n]+=item[i];
				i++;
			}

			comp=1;
			i++;
		} else if (comp==1) {
			while (item[i] && (item[i]!=";" || countOpen!=0)) {
				vals[n]+=item[i];

				if (item[i]=="\"" && i-1>=0 && item[i-1]!="\\") {
					workingQuotes=!workingQuotes;
				}

				if (!workingQuotes && (item[i]=="{" || item[i]=="(")) {
					countOpen++;
				}

				if (!workingQuotes && (item[i]=="}" || item[i]==")")) {
					countOpen--;
				}

				i++;
			}

			comp=0;
			i++;
			n++;
		}
	}

	if (keys.length!=vals.length) {
		return -1;
	}

	var dict={};

	for (var j=0; j<keys.length; j++) {
		var key=keys[j].replace(/ /g, "");

		if (key=="") {
			continue;
		}

		if (startsWithIgnoringSpace(vals[j], "{")) {
			dict[key]=parseASCIIDictionary(vals[j]);
		} else if (startsWithIgnoringSpace(vals[j], "(")) {
			dict[key]=parseASCIIArray(vals[j]);
		} else {
			dict[key]=vals[j];
		}
	}

	return dict;
}

function parseASCIIArray(item) {
	var i=0;
	var n=0;
	var countOpen=0;
	var workingQuotes=false;
	var txt="";
	var vals=new Array();

	var sp=item.split("(");

	if (sp.length==1) {
		return null;
	}

	for (var k=1; k<sp.length; k++) {
		txt+="("+sp[k];
	}

	txt=txt.substring(1, txt.length);
	item="";

	sp=txt.split(")");

	if (sp.length==1) {
		return null;
	}

	for (var l=0; l<sp.length-1; l++) {
		item+=sp[l]+")";
	}

	item=item.substring(0, item.length-1);

	while (item[i]) {
		if (!vals[n]) {
			vals[n]="";
		}

		while (item[i] && (item[i]!=";" || countOpen!=0)) {
			vals[n]+=item[i];

			if (item[i]=="\"" && i-1>=0 && item[i-1]!="\\") {
				workingQuotes=!workingQuotes;
			}

			if (!workingQuotes && (item[i]=="{" || item[i]=="(")) {
				countOpen++;
			}

			if (!workingQuotes && (item[i]=="}" || item[i]==")")) {
				countOpen--;
			}

			i++;
		}

		i++;
		n++;
	}

	var ar=new Array();

	for (var j=0; j<vals.length; j++) {
		if (startsWithIgnoringSpace(vals[j], "{")) {
			ar.push(parseASCIIDictionary(vals[j]));
		} else if (startsWithIgnoringSpace(vals[j], "(")) {
			ar.push(parseASCIIArray(vals[j]));
		} else {
			ar.push(vals[j]);
		}
	}

	return ar;
}

Object.prototype.toPlistASCII=function() {
	var ret="{ ";
	var item;

	for (var i in this) {
		if (this[i]!=null && this[i].toPlistASCII && typeof this[i]!="function") {
			ret+=i+" = "+this[i].toPlistASCII()+"; ";
		}
	}

	ret+="}";

	return ret;
};

Object.prototype.exportASCII=function() {
	return this.toPlistASCII();
};

String.prototype.toPlistASCII=function() {
	return "\""+this.replace(/\"/g, "\\\"")+"\"";
};

Number.prototype.toPlistASCII=function() {
	return this.toString().toPlistASCII();
};

Date.prototype.toPlistASCII=function() {
	return this.toString().toPlistASCII();;
};

Array.prototype.toPlistASCII=function() {
	var ret="( ";

	for (var i=0; i<this.length; i++) {
		if (this[1]!=null && this[i].toPlistASCII) {
			ret+=this[i].toPlistASCII()+", ";
		}
	}

	ret+=")";

	return ret;
};

Boolean.prototype.toPlistASCII=function() {
	return this.toString().toPlistASCII();
};