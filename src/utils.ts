import type { Awaitable, Config } from './types'

import process from 'node:process'
import { isPackageExists } from 'local-pkg'

/**
 * Check if TypeScript is present in the project.
 */
export const isTypescriptPresent = (): boolean => isPackageExists('typescript')

/**
 * Check if Vue is present in the project.
 */
export function isVuePresent(): boolean {
  return isPackageExists('vue')
    || isPackageExists('nuxt')
    || isPackageExists('vitepress')
    || isPackageExists('@slidev/cli')
}

/**
 * Check if React is present in the project.
 */
export function isReactPresent(): boolean {
  return isPackageExists('react')
    || isPackageExists('next')
    || isPackageExists('react-dom')
}

/**
 * Check if Svelte is present in the project.
 */
export function isSveltePresent(): boolean {
  return isPackageExists('svelte')
    || isPackageExists('@sveltejs/kit')
}

/**
 * Check if the environment is an editor environment.
 */
export function isInEditorEnv(): boolean {
  if (process.env.CI)
    return false
  if (isInGitHooksOrLintStaged())
    return false
  return !!(
    process.env.VSCODE_PID
    || process.env.VSCODE_CWD
    || process.env.JETBRAINS_IDE
    || process.env.VIM
    || process.env.NVIM
  )
}

/**
 * Check if the environment is a Git hooks or lint-staged environment.
 */
export function isInGitHooksOrLintStaged(): boolean {
  return !!(
    process.env.GIT_PARAMS
    || process.env.VSCODE_GIT_COMMAND
    || process.env.npm_lifecycle_script?.startsWith('lint-staged')
  )
}

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<Config | Config[]>[]): Promise<Config[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

export const parserPlain = {
  meta: {
    name: 'parser-plain',
  },
  parseForESLint: (code: string) => ({
    ast: {
      body: [],
      comments: [],
      loc: { end: code.length, start: 0 },
      range: [0, code.length],
      tokens: [],
      type: 'Program',
    },
    scopeManager: null,
    services: { isPlain: true },
    visitorKeys: {
      Program: [],
    },
  }),
}

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@antfu/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value]
        }
        return [key, value]
      }),
  )
}

/**
 * Rename plugin names a flat configs array
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from '@antfu/eslint-config'
 * import someConfigs from './some-configs'
 *
 * export default renamePluginInConfigs(someConfigs, {
 *   '@typescript-eslint': 'ts',
 *   '@stylistic': 'style',
 * })
 * ```
 */
export function renamePluginInConfigs(configs: Config[], map: Record<string, string>): Config[] {
  return configs.map((i) => {
    const clone = { ...i }
    if (clone.rules)
      clone.rules = renameRules(clone.rules, map)
    if (clone.plugins) {
      clone.plugins = Object.fromEntries(
        Object.entries(clone.plugins)
          .map(([key, value]) => {
            if (key in map)
              return [map[key], value]
            return [key, value]
          }),
      )
    }
    return clone
  })
}

export function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}
