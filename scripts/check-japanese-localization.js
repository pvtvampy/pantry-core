const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const workflowFiles=fs.readdirSync(path.join(root,'.github','workflows'),{withFileTypes:true}).filter(x=>x.isFile()&&/\.ya?ml$/i.test(x.name)).map(x=>'.github/workflows/'+x.name).sort();
const files=[
  'index.html','shop.html','journal.html','about.html','faq.html','404.html','sitemap.html','site.webmanifest','waifu-tips.json',
  'products/rev-core.html','products/rev-studio.html','products/rev-toolkit.html','products/rev-vault.html','products/rev-priority.html','products/rev-bundle.html',
  'posts/buyer-guide.html','posts/github-first.html','posts/project-rev-standard.html','posts/pubg-player-market-guide.html',
  'assets/store.js','assets/blogfa-bootstrap.js','assets/blogfa-supervisor.js','assets/blogfa-widget.js','assets/blogfa-widget-v2.js','assets/blogfa-widget-v3.js','assets/blogfa-live2d-addon.js',
  'blogfa-bootstrap-template.html','blogfa-final-template.html','blogfa-custom-html-snippet.html',
  'README.md','CONTRIBUTING.md','SECURITY.md','.github/pull_request_template.md',...workflowFiles,
  'docs/ARCHITECTURE.md','docs/BLOGFA_RUNTIME.md','docs/DEPLOYMENT.md','docs/LIVE2D_MAINTENANCE.md','docs/TROUBLESHOOTING.md'
];

const banned=[
  [/lang=["']en["']/gi,'英語のhtml lang'],
  [/\bFA\s*\/\s*EN\b|\bEN\s*\/\s*FA\b/g,'旧言語切替'],
  [/GITHUB-FED\s+MARKET/gi,'英語のマーケット見出し'],
  [/\bLOAD\s+ERROR\b/gi,'英語の読み込みエラー'],
  [/\bSIGNAL\s+LOST\b/gi,'英語の404見出し'],
  [/\bHUMAN\s+MODE\b/gi,'英語の人対応見出し'],
  [/\bTHE\s+SYSTEM\b/g,'英語のシステム見出し'],
  [/\bSOURCE\s*\+\s*HUMAN\b/g,'英語の情報源見出し'],
  [/\bPUBG\s+PLAYER\s+GUIDE\b/g,'英語のPUBG見出し'],
  [/\bBUILD\s+NOTES\b/g,'英語の開発ノート見出し'],
  [/\bBLOGFA\s+ARCHIVE\b/g,'英語のBlogfaアーカイブ見出し'],
  [/>\s*Home\s*</g,'英語のホーム'],
  [/>\s*Shop\s*</g,'英語のストア'],
  [/>\s*Journal\s*</g,'英語のジャーナル'],
  [/>\s*About\s*</g,'英語のAbout'],
  [/>\s*FAQ\s*</g,'英語のFAQ'],
  [/Toggle menu/gi,'英語のメニューaria'],
  [/Open navigation|Close navigation/gi,'英語のナビゲーションaria'],
  [/The market source did not arrive/gi,'英語のフォールバック本文'],
  [/Build and validate|Static integrity|Checkout repository|Validate runtime JSON/g,'英語のActions表示名']
];

const errors=[];
for(const rel of files){
  const file=path.join(root,rel);
  if(!fs.existsSync(file)){errors.push(`${rel}: ファイルがありません`);continue;}
  const text=fs.readFileSync(file,'utf8');
  for(const [re,label] of banned){
    re.lastIndex=0;
    if(re.test(text))errors.push(`${rel}: ${label}`);
  }
}

if(errors.length){
  console.error(`日本語ローカライズ検証に失敗しました。問題数: ${errors.length}`);
  errors.forEach(x=>console.error(`- ${x}`));
  process.exit(1);
}
console.log(`日本語ローカライズOK: ${files.length}ファイルを確認しました。`);
