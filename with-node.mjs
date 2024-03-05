import { exec } from 'child_process';

const args = [
  '-i',
  '-c',
  //`echo ${Math.random()};`,
  `echo ${Math.random()}; pwd`,
];

await main2();
await main2();

async function main2() {
  try {
    const output = await exec(`bash ${args.join(' ')}`);
    console.log(output);
    console.log('end');
  } catch (error) {
    console.error(error);
  }
}
