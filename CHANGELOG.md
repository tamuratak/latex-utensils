# Change Log

## [6.2.0] (2023-09-03)

- Update packages.

## [6.1.0] (2023-05-27)

- Switch to Peggy from PEG.js

## [6.0.0] (2023-05-20)

### BREAKING CHANGES

- BibTeX parser allows %-style comments.

## [5.0.0] (2023-04-22)

- Fast match optimization

### BREAKING CHANGES

- (#32) Fix isInlienMath to isInlineMath

## [4.6.0] (2022-09-19)

- Fix MathElement locations

## [4.5.0] (2022-09-02)

- Fix parsing environments. Thanks to @lyeyixian
- Fix parsing the verbatim environment and others.

## [4.4.0] (2022-08-23)

- Fix parsing \verbatimfont{\small}

## [4.3.0] (2022-06-18)

- (#31) Fix parsing optional arguments including a tilde.

## [4.2.1] (2022-05-29)

- Fix parsing `\newline`

## [4.2.0] (2022-05-29)

- Fix parsing commands beginning with `\newline` and `\linebreak`

## [4.1.1] (2022-03-27)

- Update packages.

## [4.1.0] (2021-05-09)

- Update packages.

## [4.0.0] (2021-02-14)

- Use `typedoc` to generate https://tamuratak.github.io/latex-utensils/.

### BREAKING CHANGES

- Spaces parsed as `Space`.
- `\\` parsed as `Linebreak`.
- Single `\n` parsed as `Softbreak`.

## [3.0.0] (2021-01-01)

- `latexParser.parse` accepts `enableMathCharacterLocation` as an option.
- Fix a null check in `luparse`.

### BREAKING CHANGES

- (#23) `\url{...}` parsed as `UrlCommand`.
- (#23) `\href{...}{...}` parsed as `HrefCommand`.
- `\label{...}`, `\ref{...}`, and others parsed as `LabelCommand`.
- Stop parsing `\end{document}` and `EOF` as parbreak.
- Unbalanced `\begin{abc} \end{efg} \end{abc}` parsed as three commands.

## [2.3.0] (2020-12-25)

- Fix parsing `alignedat` and `cases*`.

## [2.2.0] (2020-12-23)

- (#22) Fix parsing [] having spaces.

## [2.1.0] (2020-12-21)

- Add `pmatrix` and others to `MathEnvAligned`.
- Set `"types": "./out/types/src/main.d.ts"`.

## [2.0.3] (2020-07-17)

- Executed `npm audit fix`

## [2.0.2] (2020-06-20)

### Fixed

- Fix latexParser.findNodeAt.

## [2.0.0] (2020-06-09)


### Added

- latexParser.find, findAll, findAllSequences, findNodeAt
- latexParser.pattern

### Fixed

- (#17) Performance issue matching \left and \right

### BREAKING CHANGES

- Rename `latexParser.MathMatchingParen` to `latexParser.MatchingDelimiters`.
- `latexParser.parse` parses mathematical delimiters without `\left` and `\right`, `(...)`, `[...]`, and so on now. The type of delimiters is `latexParser.MathDelimiters`.
- Change the name of the property of `latexParser.Superscript` and `latexParser.Subscript` from `content` to `arg`.

## [1.2.3](https://github.com/tamuratak/latex-utensils/compare/v1.2.2...v1.2.3) (2019-12-31)

### Fixed

- (#11) Fix parsing `\verb*`.
- (#12) Fix parsing `verbatim*` env.
- (#13) Fix picking comments.


## [1.2.2](https://github.com/tamuratak/latex-utensils/compare/v1.2.1...v1.2.2) (2019-12-26)


### Fixed

- Fix dependencies.

## [1.2.1](https://github.com/tamuratak/latex-utensils/compare/v1.2.0...v1.2.1) (2019-12-25)

### Added

- (#10) Add `hasArgsArray` to test if node.args exist.

## [1.2.0](https://github.com/tamuratak/latex-utensils/compare/v1.1.10...v1.2.0) (2019-12-22)

### Added

- (#8) Add `DefCommand` type.

### Fixed

- (#9) Allow spaces in optional arguments.

## [1.1.10](https://github.com/tamuratak/latex-utensils/compare/v1.1.9...v1.1.10) (2019-12-18)

### Fixed

- Refactoring `isSyntaxError`.

## [1.1.9](https://github.com/tamuratak/latex-utensils/compare/v1.1.7...v1.1.9) (2019-12-16)

### Fixed

- (#7) Allow `isbn = 1-2-3` in BibTeX files.
