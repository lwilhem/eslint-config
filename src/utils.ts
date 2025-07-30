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
