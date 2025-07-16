-- docusaurus.lua
-- Copyright (C) 2023 Posit Software, PBC

local kQuartoRawHtml = "quartoRawHtml"
local rawHtmlVars = pandoc.List()

local code_block = require("fumadocs_utils").code_block

local reactPreamble = pandoc.List()

local function addPreamble(preamble)
	if not reactPreamble:includes(preamble) then
		reactPreamble:insert(preamble)
	end
end

local function Pandoc(doc)
	-- insert exports at the top if we have them
	if #rawHtmlVars > 0 then
		local exports = ("export const %s =\n[%s];"):format(
			kQuartoRawHtml,
			table.concat(
				rawHtmlVars:map(function(var)
					return "`" .. var .. "`"
				end),
				","
			)
		)
		doc.blocks:insert(1, pandoc.RawBlock("markdown", exports .. "\n"))
	end

	-- insert react preamble if we have it
	if #reactPreamble > 0 then
		local preamble = table.concat(reactPreamble, "\n")
		doc.blocks:insert(1, pandoc.RawBlock("markdown", preamble .. "\n"))
	end

	return doc
end

-- strip image attributes (which may result from
-- fig-format: retina) as they will result in an
-- img tag which won't hit the asset pipeline
local function Image(el)
	el.attr = pandoc.Attr()
	-- if el.src is a relative path then prepend it with ./
	if el.src:sub(1, 1) ~= "/" and el.src:sub(1, 2) ~= "./" then
		el.src = "./" .. el.src
	end
	return el
end

-- header attributes only support id
local function Header(el)
	el.attr = pandoc.Attr()
	return el
end

-- transform 'mdx' into passthrough content, transform 'html'
-- into raw commamark to pass through via dangerouslySetInnerHTML
local function RawBlock(el)
	if el.format == "mdx" then
		-- special mdx-code-block is not handled if whitespace is present after backtrick (#8333)
		return pandoc.RawBlock("markdown", "````mdx-code-block\n" .. el.text .. "\n````")
	elseif el.format == "html" then
		-- track the raw html vars (we'll insert them at the top later on as
		-- mdx requires all exports be declared together)
		local html = string.gsub(el.text, "`", "\\`")
		local html_normalized = html:gsub("s+", ""):gsub("%s+", " "):gsub("^%s+", ""):gsub("%s+$", "")
		-- rawHtmlVars:insert(html)

		-- generate a div container for the raw html and return it as the block
		local html_div = ("<div className='cell-output-stdout'><div className='cell-output-html' dangerouslySetInnerHTML={{ __html: `%s` }} /></div>"):format(
			html
		) .. "\n"
		return pandoc.RawBlock("html", html_div)
	end
end

local function DecoratedCodeBlock(node)
	local el = node.code_block
	return code_block(el, node.filename)
end

local function jsx(content)
	return pandoc.RawBlock("markdown", content)
end

local function tabset(node)
	-- note groupId
	local groupId = ""
	local group = node.attr.attributes["group"]
	if group then
		groupId = ([[ groupId="%s"]]):format(group)
	end

	-- create tabs
	local tabs = pandoc.Div({})
	local items = {}
	for i = 1, #node.tabs do
		local title = node.tabs[i].title
		local value = pandoc.utils.stringify(title)
		table.insert(items, '"' .. value .. '"')
	end
	tabs.content:insert(jsx(("<Tabs items={[%s]}"):format(table.concat(items, ", ")) .. groupId .. ">"))

	-- iterate through content
	for i = 1, #node.tabs do
		local content = node.tabs[i].content
		local title = node.tabs[i].title

		tabs.content:insert(jsx(([[<Tab value="%s">]]):format(pandoc.utils.stringify(title))))
		if type(content) == "table" then
			tabs.content:extend(content)
		else
			tabs.content:insert(content)
		end
		tabs.content:insert(jsx("</Tab>"))
	end

	-- end tab and tabset
	tabs.content:insert(jsx("</Tabs>"))

	-- ensure we have required deps
	-- addPreamble("import Tabs from '@theme/Tabs';")
	-- addPreamble("import TabItem from '@theme/TabItem';")
	addPreamble("import { Tab, Tabs } from 'fumadocs-ui/components/tabs';")

	return tabs
end

local function Table(tbl)
	local out = pandoc.write(pandoc.Pandoc({ tbl }), FORMAT, PANDOC_WRITER_OPTIONS)
	-- if the table was written in a way that looks like HTML, then wrap it in the right RawBlock way
	if string.match(out, "^%s*%<table") then
		local unwrapped = pandoc.RawBlock("html", out)
		return RawBlock(unwrapped)
	end
end

quarto._quarto.ast.add_renderer("Tabset", function()
	return quarto._quarto.format.isDocusaurusOutput()
end, function(node)
	return tabset(node)
end)

quarto._quarto.ast.add_renderer("Callout", function()
	return quarto._quarto.format.isDocusaurusOutput()
end, function(node)
	local admonition = pandoc.Div({})
	if node.title then
		admonition.content:insert(jsx("<Callout type='" .. node.type .. "' title='" .. pandoc.utils.stringify(node.title) .. "'>"))
	else
		admonition.content:insert(jsx("<Callout type='" .. node.type .. "'>"))
	end
	local content = node.content
	if type(content) == "table" then
		admonition.content:extend(content)
	else
		admonition.content:insert(content)
	end
	admonition.content:insert(jsx("</Callout>"))
	return admonition
end)

quarto._quarto.ast.add_renderer("DecoratedCodeBlock", function()
	return quarto._quarto.format.isDocusaurusOutput()
end, function(node)
	local el = node.code_block
	return code_block(el, node.filename)
end)

quarto._quarto.ast.add_renderer("FloatRefTarget", function()
	return quarto._quarto.format.isDocusaurusOutput()
end, function(float)
	float = quarto.doc.crossref.decorate_caption_with_crossref(float)
	if quarto.doc.crossref.cap_location(float) == "top" then
		return pandoc.Blocks({
			pandoc.RawBlock("markdown", '<div id="' .. float.identifier .. '">'),
			pandoc.Div(quarto.utils.as_blocks(float.caption_long)),
			pandoc.Div(quarto.utils.as_blocks(float.content)),
			pandoc.RawBlock("markdown", "</div>"),
		})
	else
		return pandoc.Blocks({
			pandoc.RawBlock("markdown", '<div id="' .. float.identifier .. '">'),
			pandoc.Div(quarto.utils.as_blocks(float.content)),
			pandoc.Div(quarto.utils.as_blocks(float.caption_long)),
			pandoc.RawBlock("markdown", "</div>"),
		})
	end
end)

return {
	{
		traverse = "topdown",
		Image = Image,
		Header = Header,
		RawBlock = RawBlock,
		DecoratedCodeBlock = DecoratedCodeBlock,
		CodeBlock = CodeBlock,
		Table = Table,
	},
	{
		Pandoc = Pandoc,
	},
}
