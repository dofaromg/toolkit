import {setOutput, getInput} from './core'
import {issueCommand} from './command'

/**
 * Interface for partner metadata
 */
export interface PartnerMetadata {
  /** Name of the partner action */
  name: string
  /** Optional version of the partner */
  version?: string
  /** Optional additional data */
  data?: {[key: string]: string}
}

/**
 * Registers this action as a partner, making it discoverable by other actions in the workflow
 * @param metadata Partner metadata including name, version, and optional data
 */
export function registerPartner(metadata: PartnerMetadata): void {
  const partnerInfo = JSON.stringify(metadata)
  setOutput('partner-info', partnerInfo)
}

/**
 * Retrieves partner information from another action in the workflow
 * @param inputName The input name where partner info was passed (defaults to 'partner-info')
 * @returns Partner metadata if available, undefined otherwise
 */
export function getPartnerInfo(
  inputName = 'partner-info'
): PartnerMetadata | undefined {
  try {
    const partnerInfoStr = getInput(inputName)
    if (!partnerInfoStr) {
      return undefined
    }
    const parsed = JSON.parse(partnerInfoStr)

    // Validate that parsed data conforms to PartnerMetadata interface
    if (!parsed || typeof parsed !== 'object') {
      return undefined
    }

    if (typeof parsed.name !== 'string' || !parsed.name) {
      return undefined
    }

    if (parsed.version !== undefined && typeof parsed.version !== 'string') {
      return undefined
    }

    if (parsed.data !== undefined) {
      if (typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
        return undefined
      }
      // Validate that all data values are strings
      for (const key in parsed.data) {
        if (typeof parsed.data[key] !== 'string') {
          return undefined
        }
      }
    }

    return parsed as PartnerMetadata
  } catch (error) {
    // Log error for debugging purposes but don't throw
    issueCommand(
      'debug',
      {},
      `Failed to parse partner info: ${error instanceof Error ? error.message : String(error)}`
    )
    return undefined
  }
}
