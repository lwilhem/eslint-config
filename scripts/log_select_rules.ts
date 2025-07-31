import js from '@eslint/js'

// WIP Devtools to log list of all rules inside a plugin

const rules = js.configs.recommended.rules

console.log(JSON.stringify(rules, null, 2))
