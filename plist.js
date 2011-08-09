/* Copyright (c) 2011, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Dictionary() {
	this.items=new Array(new Array(), new Array());

	Dictionary.prototype.getIndexForItem=function(key) {
		for(var i=0; i<this.items[0].length; i++) {
			if (this.items[0][i]==key) {
				return i;
			}
		}

		return -1;
	};

	Dictionary.prototype.get=function(key) {
		var i=this.getIndexForItem(key);

		if (i>=0) {
			return this.items[1][i];
		}

		return null;
	};

	Dictionary.prototype.set=function(item, key) {
		var i=this.getIndexForItem(key);

		if (i<0) {
			this.items[0][this.items[0].length]=key;
			this.items[1][this.items[1].length]=item;
		} else {
			this.items[1][i]=item;
		}
	};

    Dictionary.prototype.changeKey=function(oldk, newk) {
        var i=this.getIndexForItem(oldk);

		if (i>=0) {
			this.items[0][i]=newk;
		}
    };

	Dictionary.prototype.remove=function(key) {
		var i=this.getIndexForItem(key);
		this.items[0].splice(i, 1);
		this.items[1].splice(i, 1);
	};

	Dictionary.prototype.removeAll=function() {
		this.items=new Array(new Array(), new Array());
	};
}