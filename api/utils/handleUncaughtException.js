process.on('uncaughtException', async function (err) {
  console.error(err.name, err.message);
  console.log('exiting...');
  process.exit(1);
});
