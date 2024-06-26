
import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import { products, productsDefaultProperties } from '../fields'

export const checkoutFields: ActionDefinition<Settings>['fields'] = {
    CheckoutLineItems: {
        ...products,
        label: 'Checkout Line Items',
        description: 'Checkout Line Item details',
        properties: {
          ...products.properties,
          quantity: {
            label: 'Quantity',
            type: 'number',
            description: 'Quantity of the item'
          },
          discountTitle: {
            label: 'Discount Title',
            type: 'string',
            description: 'The Discount Code applied to the item.'
          },
          discountValue: {
            label: 'Discount Value',
            type: 'number',
            description: 'The Discount value applied to the item.'
          }
        },
        default: {
          '@arrayPath': [
            '$.properties.products',
            {
              ...productsDefaultProperties,
              quantity: {
                '@path': '$.quantity'
              },
              discountTitle: {
                '@path': '$.coupon'
              },
              discountValue: {
                '@path': '$.discount'
              }
            }
          ]
        }
    },
    totalAmount: {
        label: 'Total Amount',
        type: 'number',
        description: 'Decimal money amount.',
        default: {
            '@path': '$.properties.total'
        }
    },
    currencyCode: {
        label: 'Currency Code',
        type: 'string',
        description: 'The currency code of the money.',
        default: {
            '@path': '$.properties.currency'
        }
    },
    orderId: {
        label: 'Order ID',
        type: 'string',
        description: 'The ID of the order associated with this checkout.',
        default: {
            '@path': '$.properties.order_id'
        }
    },
    subtotalPriceAmount: {
        label: 'Subtotal Price Amount',
        type: 'number',
        description: 'A monetary value.',
        default: {
            '@path': '$.properties.subtotal'
        }
    },
    totalTaxAmount: {
        label: 'Total Tax Amount',
        type: 'number',
        description: 'A monetary value with currency.',
        default: {
            '@path': '$.properties.tax'
        }
    },
    shippingLinePriceAmount: {
        label: 'Shipping Line Price Amount',
        type: 'number',
        description: 'A monetary value.',
        default: {
            '@path': '$.properties.shipping'
        }
    }
}