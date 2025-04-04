import type { DestinationDefinition } from '@segment/actions-core'
import type { Settings } from './generated-types'

import updateUserProfile from './updateUserProfile'

import sendEmail from './sendEmail'

const destination: DestinationDefinition<Settings> = {
  name: 'SendGrid',
  slug: 'actions-sendgrid',
  mode: 'cloud',
  description: 'Trigger emails from SendGrid and sync Contacts to SendGrid Markeitng Campaigns.',

  authentication: {
    scheme: 'custom',
    fields: {
      sendGridApiKey: {
        label: 'API Key',
        type: 'password',
        description: 'The Api key for your SendGrid account.',
        required: true
      }
    },
    testAuthentication: (request) => {
      // Return a request that tests/validates the user's credentials.
      // If you do not have a way to validate the authentication fields safely,
      // you can remove the `testAuthentication` function, though discouraged.
      return request('https://api.sendgrid.com/v3/user/account')
    }
  },

  extendRequest({ settings }) {
    return {
      headers: {
        Authorization: `Bearer ${settings.sendGridApiKey}`,
        Accept: 'application/json'
      }
    }
  },

  actions: {
    updateUserProfile,
    sendEmail
  }
}

export default destination
