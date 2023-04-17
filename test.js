
const { v4: uuidv4 } = require('uuid');
const { remote } = require('webdriverio');
const { exec } = require('child_process');

const testId = uuidv4();

async function runTests() {
  const browser = await remote({
    capabilities: {
      browserName: 'chrome'
    }
  });

  browser.config.logLevel = 'error';

  global.browser = browser;

  await browser.url('/');

  const result = await browser.executeAsync(function (testId, done) {
    const videoElement = document.createElement('video');
    const options = {
      mimeType: 'video/webm;codecs=vp9'
    };
    const mediaRecorder = new MediaRecorder(window.stream, options);

    mediaRecorder.ondataavailable = function (event) {
      const blob = new Blob([event.data], { type: 'video/webm' });
      const formData = new FormData();
      formData.append('testId', testId);
      formData.append('video', blob, 'test.mp4');
      fetch('/api/tests', {
        method: 'POST',
        body: formData,
      });
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        window.stream = stream;
        videoElement.srcObject = stream;
        videoElement.play();
        mediaRecorder.start();
        done();
      })
      .catch(function (error) {
        console.error(error);
      });
  }, testId);

  if (result.error) {
    console.error(result.error);
  }

  await browser.deleteSession();
}

const port = process.env.PORT || 4000;

async function startServer() {
  const { default: app } = await import('./index.js');
  return new Promise(resolve => {
    const server = app.listen(port, () => {
      console.log(`App listening on port ${port}`);
      resolve(server);
    });
  });
}

async function stopServer(server) {
  return new Promise(resolve => {
    server.close(() => {
      console.log('Server stopped');
      resolve();
    });
  });
}

async function main() {
  const server = await startServer();
  await runTests();
  await stopServer(server);
}

main();
