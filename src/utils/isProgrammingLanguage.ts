export default function isProgrammingLanguage(id: string, textBefore: string) {
  if (id === 'markdown' && textIsInMarkdownCodeBlock(textBefore)) {
    return true;
  }

  return languages.includes(id);
}

const textIsInMarkdownCodeBlock = (textBefore: string) => isOdd(textBefore.match('```')?.length);

const isOdd = (num: number | undefined) => num !== undefined && num % 2 !== 0;

const languages = [
  'bat',
  'clojure',
  'coffeescript',
  'c',
  'cpp',
  'csharp',
  'css',
  'cuda-cpp',
  'fsharp',
  'go',
  'groovy',
  'java',
  'javascript',
  'javascriptreact',
  'json',
  'less',
  'lua',
  'makefile',
  'objective-c',
  'objective-cpp',
  'perl',
  'perl6',
  'php',
  'powershell',
  'jade',
  'pug',
  'python',
  'r',
  'razor',
  'ruby',
  'rust',
  'scss',
  'sass',
  'shellscript',
  'slim',
  'sql',
  'stylus',
  'swift',
  'typescript',
  'typescriptreact',
  'vb',
  'vue',
  'vue-html',
  'xml',
];
