const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const ids = process.argv.slice(2);
const outDir = path.join(__dirname, '..', 'uploads', 'hero');

const run = (command, args) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`))));
});

const prepare = async (id) => {
  fs.mkdirSync(outDir, { recursive: true });
  const mp4 = path.join(outDir, `${id}.mp4`);
  if (fs.existsSync(mp4) && fs.statSync(mp4).size > 100000) {
    console.log(`ready ${id}`);
    return;
  }
  const mov = path.join(outDir, `${id}.source`);
  console.log(`download ${id}`);
  await run('curl.exe', ['-L', '--fail', '-o', mov, `https://drive.google.com/uc?export=download&id=${id}`]);
  console.log(`transcode ${id}`);
  await run(ffmpegPath, [
    '-y',
    '-i', mov,
    '-an',
    '-vf', 'scale=1280:-2',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '28',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    mp4,
  ]);
  fs.rmSync(mov, { force: true });
  console.log(`ready ${id} ${fs.statSync(mp4).size}`);
};

(async () => {
  for (const id of ids) {
    await prepare(id);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
