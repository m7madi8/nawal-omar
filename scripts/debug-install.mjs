import { readFileSync, existsSync, statSync } from 'node:fs'
import { cwd } from 'node:process'

const stage = process.argv[2] || 'unknown'
const runId = `install-${stage}-${Date.now()}`

let scripts = {}
try {
  const raw = readFileSync(new URL('../package.json', import.meta.url), 'utf8')
  scripts = JSON.parse(raw).scripts || {}
} catch {
  scripts = {}
}

const nuxtBinPath = './node_modules/.bin/nuxt'
const nuxtMjsPath = './node_modules/nuxt/bin/nuxt.mjs'

const payloadBase = {
  sessionId: '22da07',
  runId,
  location: 'scripts/debug-install.mjs',
  timestamp: Date.now()
}

console.log(
  `[DBG22da07] stage=${stage} lifecycle=${process.env.npm_lifecycle_event || 'n/a'} script=${process.env.npm_lifecycle_script || 'n/a'} vercel=${process.env.VERCEL || 'n/a'} env=${process.env.VERCEL_ENV || 'n/a'} commit=${process.env.VERCEL_GIT_COMMIT_SHA || 'n/a'}`
)

// #region agent log
fetch('http://127.0.0.1:7310/ingest/9ee75b90-4eea-4b11-bc90-38a0a7c4ef84',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22da07'},body:JSON.stringify({sessionId:'22da07',runId,hypothesisId:'H1',location:'scripts/debug-install.mjs:25',message:'install-stage-context',data:{stage,cwd:cwd(),initCwd:process.env.INIT_CWD||null,npmLifecycleEvent:process.env.npm_lifecycle_event||null,npmLifecycleScript:process.env.npm_lifecycle_script||null,vercelEnv:process.env.VERCEL_ENV||null,vercel:process.env.VERCEL||null,nodeVersion:process.version},timestamp:Date.now()})}).catch(()=>{});
// #endregion

// #region agent log
fetch('http://127.0.0.1:7310/ingest/9ee75b90-4eea-4b11-bc90-38a0a7c4ef84',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22da07'},body:JSON.stringify({sessionId:'22da07',runId,hypothesisId:'H2',location:'scripts/debug-install.mjs:29',message:'package-scripts-at-runtime',data:{preinstall:scripts.preinstall||null,install:scripts.install||null,postinstall:scripts.postinstall||null,build:scripts.build||null},timestamp:Date.now()})}).catch(()=>{});
// #endregion

const nuxtBinExists = existsSync(nuxtBinPath)
const nuxtMjsExists = existsSync(nuxtMjsPath)
const nuxtBinMode = nuxtBinExists ? statSync(nuxtBinPath).mode : null
const nuxtMjsMode = nuxtMjsExists ? statSync(nuxtMjsPath).mode : null

// #region agent log
fetch('http://127.0.0.1:7310/ingest/9ee75b90-4eea-4b11-bc90-38a0a7c4ef84',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22da07'},body:JSON.stringify({sessionId:'22da07',runId,hypothesisId:'H3',location:'scripts/debug-install.mjs:39',message:'nuxt-binary-presence',data:{nuxtBinExists,nuxtMjsExists,nuxtBinMode,nuxtMjsMode},timestamp:Date.now()})}).catch(()=>{});
// #endregion

// #region agent log
fetch('http://127.0.0.1:7310/ingest/9ee75b90-4eea-4b11-bc90-38a0a7c4ef84',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22da07'},body:JSON.stringify({...payloadBase,hypothesisId:'H4',location:'scripts/debug-install.mjs:43',message:'install-stage-finished',data:{stage,status:'ok'},timestamp:Date.now()})}).catch(()=>{});
// #endregion
