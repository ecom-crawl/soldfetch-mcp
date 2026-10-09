import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const s=JSON.parse(readFileSync('server.json','utf8'));
assert.equal(s.name,'com.soldfetch/api');assert.equal(s.repository.url,'https://github.com/ricciflow-api/soldfetch-mcp');assert.equal(s.remotes[0].url,'https://soldfetch.com/api/mcp');assert.equal(s.remotes[0].headers[0].isSecret,true);
const r=spawnSync('python3',['-c',"import ast; ast.parse(open('examples/python/list_tools.py').read())"],{stdio:'inherit'});assert.equal(r.status,0);
console.log('MCP metadata and Python syntax checks passed.');
