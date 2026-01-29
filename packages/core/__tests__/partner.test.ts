import * as core from '../src/core'
import {registerPartner, getPartnerInfo} from '../src/partner'

describe('partner', () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env['INPUT_PARTNER-INFO']
    jest.clearAllMocks()
  })

  describe('registerPartner', () => {
    it('should register partner with name only', () => {
      const setOutputSpy = jest.spyOn(core, 'setOutput')

      registerPartner({name: 'test-action'})

      expect(setOutputSpy).toHaveBeenCalledWith(
        'partner-info',
        JSON.stringify({name: 'test-action'})
      )
    })

    it('should register partner with full metadata', () => {
      const setOutputSpy = jest.spyOn(core, 'setOutput')
      const metadata = {
        name: 'test-action',
        version: '1.0.0',
        data: {
          key1: 'value1',
          key2: 'value2'
        }
      }

      registerPartner(metadata)

      expect(setOutputSpy).toHaveBeenCalledWith(
        'partner-info',
        JSON.stringify(metadata)
      )
    })
  })

  describe('getPartnerInfo', () => {
    it('should return undefined when no partner info is available', () => {
      const result = getPartnerInfo()
      expect(result).toBeUndefined()
    })

    it('should retrieve partner info from default input', () => {
      process.env['INPUT_PARTNER-INFO'] = JSON.stringify({
        name: 'partner-action',
        version: '2.0.0'
      })

      const result = getPartnerInfo()

      expect(result).toEqual({
        name: 'partner-action',
        version: '2.0.0'
      })
    })

    it('should retrieve partner info from custom input', () => {
      process.env['INPUT_CUSTOM-PARTNER'] = JSON.stringify({
        name: 'custom-partner',
        data: {info: 'test'}
      })

      const result = getPartnerInfo('custom-partner')

      expect(result).toEqual({
        name: 'custom-partner',
        data: {info: 'test'}
      })
    })

    it('should return undefined for invalid JSON', () => {
      process.env['INPUT_PARTNER-INFO'] = 'invalid json'

      const result = getPartnerInfo()

      expect(result).toBeUndefined()
    })

    it('should return undefined for empty string', () => {
      process.env['INPUT_PARTNER-INFO'] = ''

      const result = getPartnerInfo()

      expect(result).toBeUndefined()
    })
  })
})
