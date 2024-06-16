const express = require('express');
const next = require('next');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//
const http = require('http');
//

app.prepare().then(async () => {
    const server = express();
    const httpServer = http.createServer(server);

    // Scheduler
    const runScheduler = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/services/scheduler`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT_NUMBER || 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

        runScheduler();
    });
});