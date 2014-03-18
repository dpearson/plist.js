## plist.js ##

plist.js is just a simple library to read and create Apple property lists from Javascript.

### Installation ###

	npm install plistjs

### Usage ###

First, import `plistjs` with:

	plist = require "plistjs"

#### Parsing a Property List ####

	plist.parse(contents)

`contents` is a string containing the contents of either an XML or ASCII plist, the type of which is automatically detected.

A Javascript object is returned, representing the plist file.

#### Exporting a Javascript Object as a Property List ####

	plist.serialize(pl, format)

`pl` is the object to serialize, and `format` is either `plist.XML` or `plist.ASCII`.

A string is returned that contains the resulting property list.

#### Example ####

	fs = require "fs"
	plist = require "./lib/plist"
	
	txt = fs.readFileSync("tests/test.plist").toString()
	pl = plist.parse txt
	
	pl["testbool"] = true
	
	output = plist.serialize pl, plist.XML

### Supported Types ###

Current:

* XML
* ASCII

Planned:

* Binary

### License ###

	Copyright (c) 2011-2014, David Pearson
	All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
	
	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.