###
	Copyright (c) 2011-2014, David Pearson
	All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
###

startsWithIgnoringSpace = (str, what) ->
	start = str.replace /\s/g, ""
		.substring 0, what.length

	start is what

parseASCIIPlist = (ascii) ->
	parseASCIIDictionary ascii

parseASCIIDictionary = (item) ->
	i = 0
	n = 0
	comp = 0
	countOpen = 0
	workingQuotes = false
	txt = ""
	keys = []
	vals = []

	sp = item.split "{"

	if sp.length is 1
		return null

	k = 1
	while k < sp.length
		txt += "{" + sp[k]
		k++

	txt = txt.substring 1, txt.length
	item = ""

	sp = txt.split "}"

	if sp.length is 1
		return null

	l = 0
	while l < sp.length - 1
		item += sp[l] + "}"
		l++

	item = item.substring 0, item.length - 1

	while item[i]?
		unless keys[n]?
			keys[n] = ""

		unless vals[n]
			vals[n] = ""

		if comp is 0
			while item[i]? and item[i] isnt "="
				keys[n] += item[i]
				i++

			comp = 1
			i++
		else if comp is 1
			while item[i]? and (item[i] isnt ";" or countOpen isnt 0)
				vals[n] += item[i]

				if item[i] is "\"" and i - 1 >= 0 and item[i - 1] != "\\"
					workingQuotes = not workingQuotes

				if not workingQuotes and (item[i] is "{" or item[i] is "(")
					countOpen++

				if not workingQuotes and (item[i] is "}" or item[i] is ")")
					countOpen--

				i++

			comp = 0
			i++
			n++

	if keys.length isnt vals.length
		return null

	dict = {}

	j = 0
	while j < keys.length
		key = keys[j].replace /\s/g, ""

		if key is ""
			continue

		if startsWithIgnoringSpace vals[j], "{"
			dict[key] = parseASCIIDictionary vals[j]
		else if startsWithIgnoringSpace vals[j], "("
			dict[key] = parseASCIIArray vals[j]
		else
			dict[key] = vals[j]

		j++

	dict

parseASCIIArray = (item) ->
	i = 0
	n = 0
	countOpen = 0
	workingQuotes = false
	txt = ""
	vals = []

	sp = item.split "("

	if sp.length is 1
		return null

	k = 1
	while k < sp.length
		txt += "(" + sp[k]
		k++

	txt = txt.substring 1, txt.length
	item = ""

	sp = txt.split ")"

	if sp.length is 1
		return null

	l = 0
	while l < sp.length - 1
		item += sp[l] + ")"
		l++

	item = item.substring 0, item.length - 1

	while item[i]?
		unless vals[n]?
			vals[n] = ""

		while item[i]? and (item[i] isnt ";" or countOpen isnt 0)
			vals[n] += item[i]

			if item[i] is "\"" and i - 1 >= 0 and item[i - 1] isnt "\\"
				workingQuotes = not workingQuotes

			if not workingQuotes and (item[i] is "{" or item[i] is "(")
				countOpen++

			if not workingQuotes and (item[i] is "}" or item[i] is ")")
				countOpen--

			i++

		i++
		n++

	ar = []

	j = 0
	while j < vals.length
		if startsWithIgnoringSpace vals[j], "{"
			ar.push parseASCIIDictionary vals[j]
		else if startsWithIgnoringSpace vals[j], "("
			ar.push parseASCIIArray vals[j]
		else
			ar.push vals[j]

	ar

Object::toPlistASCII = ->
	ret = "{ "

	for i of this
		if this[i]?.toPlistASCII? && typeof this[i] isnt "function"
			ret += i + " = " + this[i].toPlistASCII() + "; "

	ret += "}"

Object::exportASCII = ->
	@toPlistASCII()

String::toPlistASCII = ->
	"\"" + @replace(/\"/g, "\\\"") + "\""

Number::toPlistASCII = ->
	@toString().toPlistASCII()

Date::toPlistASCII = ->
	@toString().toPlistASCII()

Array::toPlistASCII = ->
	ret = "( "

	i = 0
	while i < @length
		if this[1]?.toPlistASCII?
			ret += this[i].toPlistASCII() + ", "
		i++

	ret += ")"

Boolean::toPlistASCII = ->
	@toString().toPlistASCII()