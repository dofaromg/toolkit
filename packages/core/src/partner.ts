import {setOutput, getInput} from './core'

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
    return JSON.parse(partnerInfoStr) as PartnerMetadata
  } catch {
    return undefined
  }
}
