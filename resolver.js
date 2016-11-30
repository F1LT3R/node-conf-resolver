const path = require('path');
const fs = require('fs');


// Creates spaced tab before log to show nesting
const tab = n => {
  let result = '';
  for (let i=0; i< n; i += 1) {
    result += '\t';
  }
  return result;
};

// Logs nesated message
const log = (n, msg) => {
  if (typeof msg === 'object') {
    msg = JSON.stringify(msg, null, 4);
  }
  msg = tab(n) + msg.toString().replace(/\n/g, `\n${tab(n)}`);
  console.log(`${msg}`);
};

const dirExists = dir => {
  try {
    stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
      return true;
    }
  }
  catch (e) {
  }
  return false;
};

const fileExists = file => {
  try {
    stats = fs.lstatSync(file);
    if (stats.isFile()) {
      return true;
    }
  }
  catch (e) {
  }
  return false;
};

let calls = 0;

const parse = (confFile, property, d) => {
  log(d, `PARSE -> ${confFile}`);

  calls += 1;

  let conf;

  conf = require(confFile);
  log(d, conf);

  if (typeof conf === 'function') {
    return conf;
  }

  const returnConf = {};

  if (typeof conf === 'object') {
    const confDir = path.dirname(require.resolve(confFile));
    // log(d, confDir);

    for (const name in conf) {
      log(d, name);
      log(d, conf[name]);

      const nextConf = path.join(confDir, 'node_modules', conf[name], 'conf.js');
      const nextDir = path.dirname(nextConf);

      if (fileExists(nextConf)) {
        const next = parse(nextConf, name, d+1);
        returnConf[name] = next;
        continue;
      }

      if (dirExists(nextDir)) {
        const next = parse(nextDir, name, d+1);
        returnConf[name] = next;
        continue;
      }
    }

    if (property) {
      return returnConf[property];
    } else {
      return returnConf;
    }
  }
};


const confFile = path.join(process.cwd(), 'conf.js');
const app = parse(confFile, null, 0);

console.log('\n==========================================================');
console.log('app:', app);
console.log(`Parse calls: ${calls}`);

console.log(`app.foo()...`);
app.foo() // should be module 2

console.log(`app.bar()...`);
app.bar() // should be module 3

console.log(`app.baz()...`);
app.baz() // should be module a
