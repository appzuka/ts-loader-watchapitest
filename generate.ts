import * as fs from 'fs';

const baseDir = 'src/generated';

// Unnecessary TypeScript to keep the compiler busy
const busyLines = `for(let i=0;i<1000;i++) {
  const f1 =  (val) => {
    if (val === null || val === undefined) {
      return [];
    }
    return Array.isArray(val) ? val : [val];
  }
};`;

const busyWork = 0;  // The number of times to include busyLines in each file

const iterate = (i, f) => {
  return Array(i).fill(0).map((v,j) => f(j)).join('\n')
}

let filesGenerated = 0;

const writeIndexFile = (counters, level) => {
  const last = counters[level];
  const rest = counters.slice(0, level);
  filesGenerated += 1;

  if (rest.length > 0) {
    fs.writeFileSync(`${baseDir}/generated_${rest.join('_')}.tsx`, 
    `import React from 'react';
${iterate(last, (i) => `import { Generated_${rest.join('_')}_${i} } from './generated_${rest.join('_')}_${i}';`)}
    
export function Generated_${rest.join('_')} () {
${iterate(busyWork, () => busyLines)}
<div>
<h2>Generated component ${rest.join('_')}</h2>
${iterate(last, (i) => `    <Generated_${rest.join('_')}_${i} />`)}
</div>
}
`);
  } else {
    fs.writeFileSync(`${baseDir}/generatedindex.tsx`, 
`import React from 'react';
${iterate(last, (i) => `import { Generated_${i} } from './generated_${i}';`)}
    
export function GeneratedContent () {
<div>
${iterate(last, (i) => `    <Generated_${i} />`)}
</div>
}
`);
  }

}

// Nested loop implemented with recursion

const depths = [4,4,4,4,4];
const counters = new Array(depths.length).fill(0);

const nestedLoopOperation = (counters, depths, level) => {
    if (level !== counters.depths) {
        for (counters[level] = 0; counters[level] < depths[level]; counters[level]++) {
            nestedLoopOperation(counters, depths, level + 1);
        }
        writeIndexFile(counters, level);
    }
}

nestedLoopOperation(counters, depths, 0);

console.log(`Total source files generated: ${filesGenerated} in ${depths.length} nesting levels.`)
