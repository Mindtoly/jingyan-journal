\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{jingyan}[2026/11/23 Economics bulletin article template]
\LoadClass[UTF8,a4paper,zihao=-4,fontset=none,scheme=chinese]{ctexart}
\RequirePackage{iftex}
\ifXeTeX\else\ClassError{jingyan}{Please use XeLaTeX}{Select XeLaTeX as the compiler.}\fi
% Windows uses the sample fonts; other systems use TeX Live's Fandol family.
\IfFontExistsTF{SimSun}{
  \setCJKmainfont{SimSun}[AutoFakeBold=2.2]
  \setCJKsansfont{SimHei}
  \setCJKmonofont{FangSong}
  \setCJKfamilyfont{zhsong}{SimSun}[AutoFakeBold=2.2]
  \setCJKfamilyfont{zhhei}{SimHei}
  \setCJKfamilyfont{zhfs}{FangSong}[AutoFakeBold=2.2]
  \setCJKfamilyfont{zhkai}{KaiTi}
}{
  \setCJKmainfont{FandolSong-Regular}[BoldFont=FandolSong-Bold]
  \setCJKsansfont{FandolHei-Regular}
  \setCJKmonofont{FandolFang-Regular}
  \setCJKfamilyfont{zhsong}{FandolSong-Regular}
  \setCJKfamilyfont{zhhei}{FandolHei-Regular}
  \setCJKfamilyfont{zhfs}{FandolFang-Regular}
  \setCJKfamilyfont{zhkai}{FandolKai-Regular}
}
\IfFontExistsTF{Times New Roman}{\setmainfont{Times New Roman}}{\setmainfont{TeX Gyre Termes}}
\providecommand{\songti}{\CJKfamily{zhsong}}
\providecommand{\heiti}{\CJKfamily{zhhei}}
\providecommand{\fangsong}{\CJKfamily{zhfs}}
\providecommand{\kaishu}{\CJKfamily{zhkai}}
\RequirePackage[left=31.75mm,right=31.75mm,top=25.4mm,bottom=25.4mm,
  headheight=12bp,headsep=14bp,footskip=25bp]{geometry}
\RequirePackage{amsmath,amssymb,graphicx,booktabs,longtable,enumitem,fancyhdr}
\RequirePackage[unicode,hidelinks,bookmarksnumbered]{hyperref}
\urlstyle{same}
\newcommand{\BulletinTitle}{经济研学动态}
\renewcommand{\normalsize}{%
  \@setfontsize\normalsize{12bp}{24.4bp}%
  \abovedisplayskip=10bp plus 2bp minus 2bp
  \belowdisplayskip=10bp plus 2bp minus 2bp
  \abovedisplayshortskip=4bp plus 2bp
  \belowdisplayshortskip=6bp plus 2bp minus 2bp}
\linespread{1}
\AtBeginDocument{\normalsize\setlength{\parindent}{2em}\setlength{\parskip}{0pt}}
\pagestyle{fancy}
\fancyhf{}
\fancyhfinit{\fontsize{9bp}{12bp}\selectfont}
\fancyhead[R]{{\songti\fontsize{9bp}{12bp}\selectfont《\BulletinTitle》}}
\fancyfoot[C]{{\fontsize{9bp}{12bp}\selectfont\thepage}}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}
\raggedbottom
\setlength{\emergencystretch}{2em}
\clubpenalty=10000 \widowpenalty=10000 \displaywidowpenalty=10000
\ctexset{
 section={format=\centering\songti\fontsize{14bp}{24.4bp}\selectfont,
   name={,、},number=\chinese{section},aftername=\quad,
   beforeskip=12bp,afterskip=6bp},
 subsection={format=\songti\fontsize{12bp}{24.4bp}\selectfont,
   name={（,）},number=\chinese{subsection},aftername=\quad,
   beforeskip=8bp,afterskip=3bp},
 subsubsection={format=\songti\fontsize{12bp}{24.4bp}\selectfont,
   number=\arabic{subsubsection},aftername={.\quad},beforeskip=6bp,afterskip=0bp}
}
\setlist{nosep,leftmargin=2em,topsep=4bp,partopsep=0pt}
\setlist[enumerate,1]{label=\arabic*）}
\newcommand{\ArticleTitle}[2]{%
  {\centering\songti\fontsize{16bp}{25bp}\selectfont #1\par}
  \vspace{10bp}
  \if\relax\detokenize{#2}\relax\else{\centering #2\par}\vspace{6bp}\fi}
\newcommand{\ArticleAbstract}[1]{\begingroup\fangsong\fontsize{10.5bp}{24.4bp}\selectfont\setlength{\parindent}{2em}\textbf{摘要：}#1\par\endgroup}
\newcommand{\ArticleKeywords}[1]{\begingroup\fangsong\fontsize{10.5bp}{24.4bp}\selectfont\setlength{\parindent}{2em}\textbf{关键词：}#1\par\endgroup}
% Author--year references are explicit: no fabricated bibliographic metadata.
\NewDocumentCommand{\TextCite}{m m O{}}{#1（#2\if\relax\detokenize{#3}\relax\else ，#3\fi）}
\NewDocumentCommand{\ParenCite}{m m O{}}{（#1，#2\if\relax\detokenize{#3}\relax\else ，#3\fi）}
\newenvironment{References}{%
  \par\addvspace{4bp}%
  {\parindent=0pt\noindent\heiti\fontsize{12bp}{24.4bp}\selectfont 参考文献\par}\nobreak
  \begingroup\songti\fontsize{7.5bp}{16.3bp}\selectfont
  \setlength{\parindent}{2em}\setlength{\parskip}{0pt}%
}{\par\endgroup}
\newcommand{\Reference}[1]{\par\indent #1\par}
\endinput
