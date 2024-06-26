import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import { product, productDefaultProperties } from '../fields/productFields'
import { transformPayload } from './transform-payload'
import { baseURL, eventsEndpoint } from '../routes'
import { commonFields } from '../fields/commonFields'
import { cart } from '../fields/cartFields'
import { customer } from '../fields/customerFields'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Save Cart Event',
  description: 'Save a cart event.',
  fields: {
    cartLine: {
      ...product,
      label: 'Cart Line',
      description: 'Cart Line details',
      properties: {
        ...product.properties,
        quantity: {
          label: 'Quantity',
          type: 'number',
          description: 'Quantity of the item'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.products',
          {
            ...productDefaultProperties,
            quantity: {
              '@path': '$.quantity'
            }
          }
        ]
      }
    },
    ...commonFields,
    eventName: {
      label: 'Cart Event Name',
      type: 'string',
      description: 'The name of the Cart Event to track.',
      required: true,
      choices: [
        { label: 'product_added_to_cart', value: 'product_added_to_cart' },
        { label: 'product_removed_from_cart', value: 'product_removed_from_cart' }
      ]
    },
    ...cart, // TODO: do we really need this field if the cartLine is already defined above?
    customer
  },
  perform: (request, data) => {
    const transformedPayload = transformPayload(data.payload)

    const payload = {
      src: 'SEGMENT',
      data: [transformedPayload]
    }
    return request(baseURL + eventsEndpoint(data.settings.workspaceId), {
      method: 'post',
      json: payload
    })
  }
}

export default action
