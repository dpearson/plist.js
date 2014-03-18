###
	Copyright (c) 2011-2014, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

DOMParser
unless DOMParser?
	{DOMParser} = require "xmldom"

Data
if module?.exports?
	Data = require "./data"

parseXMLPlist = (xml) ->
	if typeof xml is "string"
		xml = new DOMParser().parseFromString(xml, "text/xml")

	node = xml.getElementsByTagName("dict")[0]

	parseXMLDictionary node

objectForChildNode = (childNode) ->
	obj = null

	switch childNode.tagName
		when "string"
			obj = childNode.childNodes[0].nodeValue
		when "integer"
			obj = parseInt childNode.childNodes[0].nodeValue
		when "real"
			obj = parseFloat childNode.childNodes[0].nodeValue
		when "true"
			obj = true
		when "false"
			obj = false
		when "date"
			str = childNode.childNodes[0].nodeValue
			dt = str.split "T"
			ymd = dt[0].split "-"
			hms = dt[1].split("Z")[0].split ":"
			date = new Date()
			date.setUTCFullYear ymd[0]
			date.setUTCMonth ymd[1] - 1
			date.setUTCDate ymd[2]
			date.setUTCHours hms[0]
			date.setUTCMinutes hms[1]
			date.setUTCSeconds hms[2]
			obj = date
		when "data"
			obj = new Data()
			if childNode.childNodes.length > 0
				obj.value = childNode.childNodes[0].nodeValue
		when "dict"
			obj = parseXMLDictionary childNode
		when "array"
			obj = parseXMLArray childNode
		else
			obj = null

	obj

parseXMLDictionary = (node) ->
	children = node.childNodes
	i = 0
	dict = {}

	key = null
	childNode = null

	while children[i]?
		if children[i].tagName is "key"
			key = children[i].childNodes[0].nodeValue

			childNode = children[i + 2]

			dict[key] = objectForChildNode childNode

		i++

	dict

parseXMLArray = (node) ->
	children = node.childNodes
	i = 1
	ar = []

	key = null
	childNode = null

	while children[i]?
		if children[i].tagName?
			obj = objectForChildNode children[i]
			if obj?
				ar.push obj

		i++

	ar

Object::toPlistXML = ->
	ret = "<dict>\n"

	for i of this
		if this[i]?.toPlistXML? and typeof this[i] isnt "function"
			key = "<key>" + i + "</key>"
			xml = this[i].toPlistXML()
			if xml.indexOf("<dict>") >= 0 or xml.indexOf("<array>") >= 0
				item = xml
				item = item.replace /\n/g, "\n\t"
				ret += "\t" + key + "\n\t" + item + "\n"
				item = ""
			else
				ret += "\t" + key + "\n\t" + xml + "\n"

	ret += "</dict>"

Object::exportXML = ->
	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \
	\"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\
	\n<plist version=\"1.0\">\n" + this.toPlistXML() + "\n</plist>"

String::toPlistXML = ->
	"<string>" + this + "</string>"

Number::toPlistXML = ->
	if @toFixed() is this
		"<integer>" + @toString() + "</integer>"
	else
		"<real>" + @toString() + "</real>"

Date::toPlistXML = ->
	"<date>" + @getUTCFullYear() + "-" + (@getUTCMonth() + 1) + "-" + @getUTCDate() + "T" + @getUTCHours() + ":" + @getUTCMinutes() + ":" + @getUTCSeconds() + "Z</date>"

Array::toPlistXML = ->
	ret = "<array>\n"

	i = 0
	while i < this.length
		if this[1]?.toPlistXML?
			xml = this[i].toPlistXML()
			if xml.indexOf("<dict>") >= 0 or xml.indexOf("<array>") >= 0
				item = xml
				item = item.replace /\n/g, "\n\t"
				ret += "\t" + item + "\n"
				item = ""
			else
				ret += "\t" + xml + "\n"
		i++

	ret += "</array>"

Boolean::toPlistXML = ->
	"<" + @toString() + "/>"

Data::toPlistXML = ->
	"<data>" + this.value + "</data>"

if module?.exports?
	exports.parseXMLPlist = parseXMLPlist