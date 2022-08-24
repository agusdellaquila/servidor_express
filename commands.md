--mode fork, o --mode cluster

Server en puerto 8080: 

- pm2 start server.js --name="server1" --watch -- 8080

- pm2 start server.js --name="server2" --watch -- 8081 cluster

pm2 start server.js --name="server1" --watch -- 8080

pm2 start server.js --name="server2" --watch -- 8082

pm2 start server.js --name="server3" --watch -- 8083

pm2 start server.js --name="server4" --watch -- 8084

pm2 start server.js --name="server5" --watch -- 8085

pm2 start server.js --name="server6" --watch -- 8086

pm2 start server.js --name="server7" --watch -- 8087

pm2 start server.js --name="server8" --watch -- 8088