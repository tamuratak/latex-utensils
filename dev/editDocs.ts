import * as fs from 'fs'

const nodeExpanded = '<a href="latex_latex_parser_types.html#textstring" class="tsd-signature-type" data-tsd-kind="Type alias">TextString</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#command" class="tsd-signature-type" data-tsd-kind="Type alias">Command</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#amsmathtextcommand" class="tsd-signature-type" data-tsd-kind="Type alias">AmsMathTextCommand</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#defcommand" class="tsd-signature-type" data-tsd-kind="Type alias">DefCommand</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#urlcommand" class="tsd-signature-type" data-tsd-kind="Type alias">UrlCommand</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#hrefcommand" class="tsd-signature-type" data-tsd-kind="Type alias">HrefCommand</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#labelcommand" class="tsd-signature-type" data-tsd-kind="Type alias">LabelCommand</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#environment" class="tsd-signature-type" data-tsd-kind="Type alias">Environment</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#group" class="tsd-signature-type" data-tsd-kind="Type alias">Group</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#optionalarg" class="tsd-signature-type" data-tsd-kind="Type alias">OptionalArg</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#inlinemath" class="tsd-signature-type" data-tsd-kind="Type alias">InlineMath</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#displaymath" class="tsd-signature-type" data-tsd-kind="Type alias">DisplayMath</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#mathcharacter" class="tsd-signature-type" data-tsd-kind="Type alias">MathCharacter</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#matchingdelimiters" class="tsd-signature-type" data-tsd-kind="Type alias">MatchingDelimiters</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#mathdelimiters" class="tsd-signature-type" data-tsd-kind="Type alias">MathDelimiters</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#mathenv" class="tsd-signature-type" data-tsd-kind="Type alias">MathEnv</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#mathenvaligned" class="tsd-signature-type" data-tsd-kind="Type alias">MathEnvAligned</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#parbreak" class="tsd-signature-type" data-tsd-kind="Type alias">Parbreak</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#space" class="tsd-signature-type" data-tsd-kind="Type alias">Space</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#softbreak" class="tsd-signature-type" data-tsd-kind="Type alias">Softbreak</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#linebreak" class="tsd-signature-type" data-tsd-kind="Type alias">Linebreak</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#superscript" class="tsd-signature-type" data-tsd-kind="Type alias">Superscript</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#subscript" class="tsd-signature-type" data-tsd-kind="Type alias">Subscript</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#alignmenttab" class="tsd-signature-type" data-tsd-kind="Type alias">AlignmentTab</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#commandparameter" class="tsd-signature-type" data-tsd-kind="Type alias">CommandParameter</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#activecharacter" class="tsd-signature-type" data-tsd-kind="Type alias">ActiveCharacter</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#ignore" class="tsd-signature-type" data-tsd-kind="Type alias">Ignore</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#verb" class="tsd-signature-type" data-tsd-kind="Type alias">Verb</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#verbatim" class="tsd-signature-type" data-tsd-kind="Type alias">Verbatim</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#minted" class="tsd-signature-type" data-tsd-kind="Type alias">Minted</a><span class="tsd-signature-symbol"> | </span><a href="latex_latex_parser_types.html#lstlisting" class="tsd-signature-type" data-tsd-kind="Type alias">Lstlisting</a>'
const nodeAlias = '<a href="latex_latex_parser_types.html#node" class="tsd-signature-type" data-tsd-kind="Type alias">Node</a>'


process.argv.slice(2).forEach((file) => {
    if (fs.existsSync(file)) {
        let s = fs.readFileSync(file).toString()
        for (let i = 0; i < 100; i++) {
            s = s.replace(
                `<span class="tsd-signature-type">undefined</span><span class="tsd-signature-symbol"> | </span>${nodeExpanded}`,
                `${nodeAlias}<span class="tsd-signature-symbol"> | </span><span class="tsd-signature-type">undefined</span>`
            )
        }
        for (let i = 0; i < 100; i++) {
            s = s.replace(
                nodeExpanded,
                nodeAlias
            )
        }
        for (let i = 0; i < 100; i++) {
            s = s.replace(
                `Node<span class="tsd-signature-symbol">:</span> ${nodeAlias}`,
                `Node<span class="tsd-signature-symbol">:</span> ${nodeExpanded}`
            )
        }
        fs.writeFileSync(file, s)
    }
})
