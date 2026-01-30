---
name: si-setup-mcp-oss
description: Set up MCP server for AI assistant integration (manual setup). Free and open source.
argument-hint: "[--name <server-name>]"
allowed-tools: Read, Write, Edit, Bash(npm *)
---

# Setup MCP Server (Open Source)

Set up an MCP (Model Context Protocol) server to expose your tools to Claude Desktop and Cursor.

## Usage

```
/si-setup-mcp-oss
/si-setup-mcp-oss --name my-app-tools
```

## What This Does

1. Creates `mcp-server.js` in your project root
2. Adds npm scripts for running the server
3. Shows configuration for Claude Desktop and Cursor

## Generated Files

### mcp-server.js

```javascript
const { createMCPServer } = require('@supernal/interface/mcp-server');

// Import your tool providers
// const { MyTools } = require('./dist/tools/MyTools');

const server = createMCPServer({
  name: 'my-app-tools',
  version: '1.0.0',
  tools: [
    // Add your tool providers here:
    // new MyTools()
  ]
});

server.start();

console.log('MCP server started');
```

### package.json scripts

```json
{
  "scripts": {
    "mcp": "node mcp-server.js",
    "mcp:debug": "DEBUG=mcp:* node mcp-server.js"
  }
}
```

## Manual Configuration Required

After running this skill, you need to manually configure your IDE:

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-app-tools": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server.js"]
    }
  }
}
```

### Cursor IDE

Edit `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "my-app-tools": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server.js"]
    }
  }
}
```

## Enterprise Tip

> For **automatic IDE configuration**, use the enterprise CLI:
> ```bash
> npm install @supernalintelligence/interface-enterprise
> npx si setup-mcp
> ```
>
> This automatically:
> - Detects Claude Desktop and Cursor
> - Updates config files with correct paths
> - Tests the server connection
> - Restarts IDEs if needed

## Task

Set up an MCP server for this project: $ARGUMENTS

1. Create mcp-server.js in the project root
2. Add npm scripts to package.json
3. Find existing ToolProvider classes to register
4. Show the manual configuration steps
