import { server, PORT } from './server';

server.on('close', () => {
  console.log('Closing HTTP server');
});

server.listen(PORT, () => {
  console.log(`Server listening at http://${server.address().address}:${server.address().port}`);
});

