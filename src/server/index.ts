import '../lib/polyfills.ts';
import http from 'http';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { globalCoordinator } from '../lib/agents/coordinator.ts';
import { globalMcpServer } from '../lib/mcp/server.ts';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Agents on start
let agentsReady = false;
globalCoordinator.initialize().then(() => {
  agentsReady = true;
  console.log('--- ALL AGENTS INITIALIZED AND READY ---');
}).catch(err => {
  console.error('Failed to initialize agents:', err);
});

// Chat endpoint (invokes Coordinator)
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!agentsReady) {
    return res.status(503).json({ error: 'Agents are initializing. Please try again in a few seconds.' });
  }

  try {
    console.log(`[API /chat] Received request: "${message}"`);
    const result = await globalCoordinator.run(message, history || []);
    res.json({
      content: result.content,
      steps: result.steps,
    });
  } catch (error: any) {
    console.error('[API /chat] Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error during chat coordination' });
  }
});

// Get MCP Tools list
app.get('/api/mcp/tools', (_req, res) => {
  res.json({
    tools: globalMcpServer.getToolsList(),
  });
});

// Get MCP Server transmission logs (JSON-RPC)
app.get('/api/mcp/logs', (_req, res) => {
  res.json({
    logs: globalMcpServer.logs,
  });
});

// Execute an MCP Tool directly from frontend (useful for widgets)
app.post('/api/mcp/call', async (req, res) => {
  const { toolName, arguments: args } = req.body;
  if (!toolName) {
    return res.status(400).json({ error: 'toolName is required' });
  }

  try {
    const rpcRequest = {
      jsonrpc: '2.0',
      id: Math.random().toString(36).substring(7),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args || {},
      },
    };
    const response = await globalMcpServer.handleRequest(rpcRequest);
    if (response.error) {
      return res.status(500).json({ error: response.error.message });
    }
    res.json(response.result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to call MCP tool' });
  }
});

app.get('/api/status', (_req, res) => {
  res.json({ agentsReady });
});

// Use http.createServer explicitly to keep process alive under Express 5 + ESM
const server = http.createServer(app);

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run this command to free it, then restart:\n`);
    console.error(`   Windows: netstat -ano | findstr :${PORT}  → then: taskkill /PID <pid> /F\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, () => {
  console.log(`EduAssist AI backend API is running on http://localhost:${PORT}`);
});

// Keep the process alive and handle graceful shutdown
process.on('SIGINT', () => { server.close(); process.exit(0); });
process.on('SIGTERM', () => { server.close(); process.exit(0); });

