const args = [
  '-i',
  '-c',
  `echo ${Math.random()}; pwd`,
];

await main3();
await sleep(1 * 1000);
await main3();

async function main1() {
  const decoder = new TextDecoder();

  const p = Deno.run({
    cmd: [
      'bash',
      ...args,
    ],
    stdout: 'piped',
    stderr: 'piped',
  });

  console.log(1);
  const outputRaw = await p.output();
  const output = decoder.decode(outputRaw).slice(0, -1);
  console.log(output);
  console.log(2);
  //await p.close();
  await p.kill();
}

async function main2() {
  const command = new Deno.Command('bash', {
    args,
    stdin: 'inherit',
    stderr: 'piped',
    stdout: 'piped',
  });
  //const output = await command.output();
  const output = command.outputSync();
  const {success, stdout} = output;
  console.log(output);
  console.log(new TextDecoder().decode(stdout));
  console.log('end');
}

async function main3() {
  const command = new Deno.Command('bash', {
    args,
    //stdin: 'null',
    //*
    stderr: 'piped',
    stdout: 'piped',
    /*/
    stderr: 'inherit',
    stdout: 'inherit',
    //*/
  });
  const p = command.spawn();

  //console.log('p', p);
  console.log('p.pid', p.pid);

  //*
  const {stdout} = p;
  const output = await streamReadableWebToString(stdout);
  //console.log(new TextDecoder().decode(output));
  console.log('output', output);
  //*/
  //await p.kill();
  console.log('end');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function streamReadableWebToString(readableWeb: ReadableStream<Uint8Array>): Promise<string> {
  //let str: uint8array = new uint8array()
  let str = '';
  const reader = readableWeb.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    // console.log('value', value);
    // console.log('typeof value', typeof value);
    // console.log('value.constructor', value.constructor);
    str += new TextDecoder().decode(value);
  }
  return str;
}
