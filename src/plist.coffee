###
	Copyright (c) 2011-2014, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

ascii =
	if module?.exports?
		require "./ascii"
	else
		{parseASCIIPlist : parseASCIIPlist}
xml =
	if module?.exports?
		require "./xml"
	else
		{parseXMLPlist : parseXMLPlist}

Data = require "./data"

XML = 0
ASCII = 1

parse = (pl) ->
	if pl.indexOf("<plist") >= 0 and pl.indexOf("<dict") >= 0
		xml.parseXMLPlist pl
	else if pl.search(/\s*\{/) is 0
		ascii.parseASCIIPlist pl
	else
		null

serialize = (pl, format) ->
	if format is XML
		pl.exportXML()
	else if format is ASCII
		pl.exportASCII()
	else
		""

if module?.exports?
	exports.XML = XML
	exports.ASCII = ASCII

	exports.Data = Data

	exports.parse = parse
	exports.serialize = serialize