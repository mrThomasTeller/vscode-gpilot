import * as assert from 'assert';

export function formatCodeForInsertion(code: string, codeBefore: string) {
  const codeLines = code.split('\n');
  if (codeLines.length <= 1) {
    return code;
  }

  const tabulation = getTabulationOfTheLastLine(codeBefore);
  const prefixedAllLinesButFirst = codeLines.map((l, i) => (i === 0 ? l : tabulation + l));
  return prefixedAllLinesButFirst.join('\n');
}

export function getTabulationOfTheLastLine(code: string) {
  const lastLine = code.split('\n').pop();
  assert(lastLine !== undefined);
  const tabulation = lastLine.match(/^\s*/)?.[0];
  return tabulation ?? '';
}
