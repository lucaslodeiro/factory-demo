// A per-worktree launchd service survives the worker and only manages its own label.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const cwd=process.cwd();
const label='com.openxpand.local.'+createHash('sha256').update(cwd).digest('hex').slice(0,12);
const domain=`gui/${process.getuid()}`;
const state=path.join(cwd,'.local');fs.mkdirSync(state,{recursive:true});
const plist=path.join(state,'service.plist');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const run=args=>spawnSync('/bin/launchctl',args,{stdio:'inherit'}).status;
const command=process.argv[2];
if(command==='stop'){process.exit(run(['bootout',`${domain}/${label}`])??1);}
if(command==='status'){process.exit(run(['print',`${domain}/${label}`])??1);}
if(!['start','restart'].includes(command)){console.error('Use start, restart, stop or status');process.exit(1);}
if(command==='restart')run(['bootout',`${domain}/${label}`]);
const args=[process.execPath,'--import',path.join(cwd,'node_modules/tsx/dist/loader.mjs'),path.join(cwd,'scripts/local-server.ts')];
fs.writeFileSync(plist,`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>${label}</string><key>ProgramArguments</key><array>${args.map(a=>`<string>${escape(a)}</string>`).join('')}</array><key>WorkingDirectory</key><string>${escape(cwd)}</string><key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>StandardOutPath</key><string>${escape(state)}/server.log</string><key>StandardErrorPath</key><string>${escape(state)}/server-error.log</string></dict></plist>`);
process.exit(run(['bootstrap',domain,plist])??1);
