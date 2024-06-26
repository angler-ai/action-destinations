import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import { baseURL, ordersEndpoint } from '../routes'
import { addressProperties, addressDefaultFields } from '../fields'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Save Order',
  description: 'Send an order to Angler.',
  fields: {
    app_id: {
      type: 'string',
      label: 'App ID',
      description: 'The ID of the app that created the order.',
      default: {
        '@path': '$.properties.app_id'
      }
    },
    billing_address: {
      type: 'object',
      label: 'Billing Address',
      description: 'The mailing address associated with the payment method.',
      properties: addressProperties,
      default: addressDefaultFields('$.properties.billing_address')
    },
    browser_ip: {
      type: 'string',
      label: 'Browser IP',
      description:
        'The IP address of the browser used by the customer when they placed the order. Both IPv4 and IPv6 are supported.',
      default: {
        '@path': '$.context.ip'
      }
    },
    buyer_accepts_marketing: {
      type: 'boolean',
      label: 'Buyer Accepts Marketing',
      description: 'Whether the customer consented to receive email updates from the shop.',
      default: {
        '@if': {
          exists: { '@path': '$.properties.buyer_accepts_marketing' },
          then: { '@path': '$.properties.buyer_accepts_marketing' },
          else: { '@path': '$.traits.accepts_marketing' }
        }
      }
    },
    cancel_reason: {
      type: 'string',
      label: 'Cancel Reason',
      description: 'The reason why the order was canceled.',
      default: {
        '@path': '$.properties.cancel_reason'
      }
    },
    cancelled_at: {
      type: 'string',
      label: 'Cancelled At',
      description: "The date and time when the order was canceled. Returns null if the order isn't canceled.",
      default: {
        '@path': '$.properties.cancelled_at'
      }
    },
    checkout_id: {
      type: 'string',
      label: 'Checkout ID',
      description: 'The ID of the checkout.',
      default: {
        '@path': '$.properties.checkout_id'
      }
    },
    client_details: {
      type: 'object',
      label: 'Client Details',
      description: 'Information about the browser that the customer used when they placed their order.',
      properties: {
        accept_language: {
          type: 'string',
          label: 'Accept Language',
          description: 'The languages and locales that the browser understands.'
        },
        browser_height: {
          type: 'number',
          label: 'Browser Height',
          description: 'The browser screen height in pixels, if available.'
        },
        browser_ip: {
          type: 'string',
          label: 'Browser IP',
          description: 'The browser IP address.'
        },
        browser_width: {
          type: 'number',
          label: 'Browser Width',
          description: 'The browser screen width in pixels, if available.'
        },
        session_hash: {
          type: 'string',
          label: 'Session Hash',
          description: 'A hash of the session.'
        },
        user_agent: {
          type: 'string',
          label: 'User Agent',
          description: 'Details of the browsing client, including software and operating versions.'
        }
      },
      default: {
        accept_language: { '@path': '$.context.locale' },
        browser_height: { '@path': '$.context.screen.height' },
        browser_ip: { '@path': '$.context.ip' },
        browser_width: { '@path': '$.context.screen.width' },
        session_hash: { '@path': '$.properties.session_hash' },
        user_agent: { '@path': '$.context.userAgent' }
      }
    },
    closed_at: {
      type: 'string',
      label: 'Closed At',
      description: 'The date and time (ISO 8601 format) when the order was closed.',
      default: {
        '@path': '$.properties.closed_at'
      }
    },
    confirmed: {
      type: 'boolean',
      label: 'Confirmed',
      description: '',
      default: {
        '@path': '$.properties.confirmed'
      }
    },
    contact_email: {
      type: 'string',
      label: 'Contact Email',
      description: '',
      default: {
        '@if': {
          exists: { '@path': '$.properties.contact_email' },
          then: { '@path': '$.properties.contact_email' },
          else: { '@path': '$.traits.email' }
        }
      }
    },
    created_at: {
      type: 'string',
      label: 'Created At',
      description: 'The autogenerated date and time (ISO 8601 format) when the order was created.',
      default: {
        '@path': '$.properties.created_at'
      }
    },
    currency: {
      type: 'string',
      label: 'Currency',
      description:
        'The three-letter code (ISO 4217 format) for the currency that the customer used when they paid for their last order.',
      default: {
        '@path': '$.properties.currency'
      }
    },
    current_subtotal_price: {
      type: 'string',
      label: 'Current Subtotal Price',
      description:
        'The current subtotal price of the order in the shop currency. The value of this field reflects order edits, returns, and refunds.',
      default: {
        '@path': '$.properties.current_subtotal_price'
      }
    },
    current_total_discounts: {
      type: 'string',
      label: 'Current Total Discounts',
      description:
        'The current total discounts on the order in the shop currency. The value of this field reflects order edits, returns, and refunds.',
      default: {
        '@path': '$.properties.current_total_discounts'
      }
    },
    current_total_price: {
      type: 'string',
      label: 'Current Total Price',
      description:
        'The current total price of the order in the shop currency. The value of this field reflects order edits, returns, and refunds.',
      default: {
        '@path': '$.properties.current_total_price'
      }
    },
    current_total_tax: {
      type: 'string',
      label: 'Current Total Tax',
      description:
        'The current total taxes charged on the order in the shop currency. The value of this field reflects order edits, returns, or refunds.',
      default: {
        '@path': '$.properties.current_total_tax'
      }
    },
    customer_id: {
      type: 'string',
      label: 'Customer ID',
      description: 'A unique identifier for the customer.',
      default: {
        '@if': {
          exists: { '@path': '$.userId' },
          then: { '@path': '$.userId' },
          else: { '@path': '$.traits.id' }
        }
      }
    },
    discount_applications: {
      type: 'object',
      multiple: true,
      label: 'Discount Applications',
      description:
        'An ordered list of stacked discount applications. The discount_applications property includes 3 types: discount_code, manual, and script. All 3 types share a common structure and have some type specific attributes.',
      properties: {
        target_type: {
          type: 'string',
          label: 'Target Type',
          description: 'The type of line on the order that the discount is applicable on.'
        },
        type: {
          type: 'string',
          label: 'Type',
          description: 'The discount application type.'
        },
        value: {
          type: 'string',
          label: 'Value',
          description:
            'The value of the discount application as a decimal. This represents the intention of the discount application.'
        },
        value_type: {
          type: 'string',
          label: 'Value Type',
          description: 'The type of the value.'
        },
        allocation_method: {
          type: 'string',
          label: 'Allocation Method',
          description: 'The method by which the discount application value has been allocated to entitled lines.'
        },
        target_selection: {
          type: 'string',
          label: 'Target Selection',
          description:
            'The lines on the order, of the type defined by target_type, that the discount is allocated over.'
        },
        code: {
          type: 'string',
          label: 'Code',
          description:
            'The discount code that was used to apply the discount. Available only for discount code applications.'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.discount_applications',
          {
            target_type: { '@path': '$.target_type' },
            type: { '@path': '$.type' },
            value: { '@path': '$.value' },
            value_type: { '@path': '$.value_type' },
            allocation_method: { '@path': '$.allocation_method' },
            target_selection: { '@path': '$.target_selection' },
            code: { '@path': '$.code' }
          }
        ]
      }
    },
    discount_codes: {
      type: 'object',
      multiple: true,
      label: 'Discount Codes',
      description: 'A list of discounts applied to the order.',
      properties: {
        code: {
          type: 'string',
          label: 'Code',
          description:
            'When the associated discount application is of type code, this property returns the discount code that was entered at checkout. Otherwise this property returns the title of the discount that was applied.'
        },
        amount: {
          type: 'string',
          label: 'Amount',
          description:
            "The amount that's deducted from the order total. When you create an order, this value is the percentage or monetary amount to deduct. After the order is created, this property returns the calculated amount."
        },
        type: {
          type: 'string',
          label: 'Type',
          description: 'The type of discount.'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.discount_codes',
          {
            code: { '@path': '$.code' },
            amount: { '@path': '$.amount' },
            type: { '@path': '$.type' }
          }
        ]
      }
    },
    email: {
      type: 'string',
      label: 'Email',
      description: "The customer's email address.",
      default: {
        '@if': {
          exists: { '@path': '$.properties.email' },
          then: { '@path': '$.properties.email' },
          else: { '@path': '$.traits.email' }
        }
      }
    },
    estimated_taxes: {
      type: 'boolean',
      label: 'Estimated Taxes',
      description:
        'Whether taxes on the order are estimated. Many factors can change between the time a customer places an order and the time the order is shipped, which could affect the calculation of taxes.',
      default: {
        '@path': '$.properties.estimated_taxes'
      }
    },
    financial_status: {
      type: 'string',
      label: 'Financial Status',
      description: 'The status of payments associated with the order.',
      default: {
        '@path': '$.properties.financial_status'
      }
    },
    fulfillment_status: {
      type: 'string',
      label: 'Fulfillment Status',
      description: "The order's status in terms of fulfilled line items.",
      default: {
        '@path': '$.properties.fulfillment_status'
      }
    },
    fulfillments: {
      type: 'object',
      multiple: true,
      label: 'Fulfillments',
      description: 'An array of fulfillments associated with the order.',
      properties: {
        id: {
          type: 'string',
          label: 'ID',
          description: 'The ID for the fulfillment.'
        },
        created_at: {
          type: 'string',
          label: 'Created At',
          description: 'The date and time (ISO 8601 format) when the fulfillment was created.'
        },
        order_id: {
          type: 'string',
          label: 'Order ID',
          description: 'The unique numeric identifier for the order.'
        },
        shipment_status: {
          type: 'string',
          label: 'Shipment Status',
          description: 'The current shipment status of the fulfillment.'
        },
        status: {
          type: 'string',
          label: 'Status',
          description: 'The status of the fulfillment.'
        },
        tracking_company: {
          type: 'string',
          label: 'Tracking Company',
          description: 'The name of the tracking company.'
        },
        updated_at: {
          type: 'string',
          label: 'Updated At',
          description: 'The date and time (ISO 8601 format) when the fulfillment was last modified.'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.fulfillments',
          {
            id: { '@path': '$.id' },
            created_at: { '@path': '$.created_at' },
            order_id: { '@path': '$.order_id' },
            shipment_status: { '@path': '$.shipment_status' },
            status: { '@path': '$.status' },
            tracking_company: { '@path': '$.tracking_company' },
            updated_at: { '@path': '$.updated_at' }
          }
        ]
      }
    },
    gateway: {
      type: 'string',
      label: 'Gateway',
      description: 'The payment gateway used.',
      default: {
        '@path': '$.properties.gateway'
      }
    },
    id: {
      required: true,
      type: 'string',
      label: 'ID',
      description: 'The ID of the order, used for API purposes.',
      default: {
        '@path': '$.properties.id'
      }
    },
    landing_site: {
      type: 'string',
      label: 'Landing Site',
      description: 'The URL for the page where the buyer landed when they entered the shop.',
      default: {
        '@path': '$.properties.landing_site'
      }
    },
    landing_site_ref: {
      type: 'string',
      label: 'Landing Site Ref',
      description: '',
      default: {
        '@path': '$.properties.landing_site_ref'
      }
    },
    location_id: {
      type: 'string',
      label: 'Location ID',
      description: 'The ID of one of the locations that was assigned to fulfill the order when the order was created.',
      default: {
        '@path': '$.properties.location_id'
      }
    },
    name: {
      type: 'string',
      label: 'Name',
      description: 'The order name.',
      default: {
        '@path': '$.properties.name'
      }
    },
    note: {
      type: 'string',
      label: 'Note',
      description: 'An optional note that a shop owner can attach to the order.',
      default: {
        '@path': '$.properties.note'
      }
    },
    note_attributes: {
      type: 'object',
      multiple: true,
      label: 'Note Attributes',
      description: 'Extra information that is added to the order.',
      properties: {
        name: {
          type: 'string',
          label: 'Name',
          description: 'Extra property name.'
        },
        value: {
          type: 'string',
          label: 'Value',
          description: 'Extra property value.'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.note_attributes',
          {
            name: { '@path': '$.name' },
            value: { '@path': '$.value' }
          }
        ]
      }
    },
    number: {
      type: 'integer',
      label: 'Number',
      description: "The order's position in the shop's count of orders. Numbers are sequential and start at 1.",
      default: {
        '@path': '$.properties.number'
      }
    },
    order_number: {
      type: 'integer',
      label: 'Order Number',
      description:
        'The order position in the shop count of orders starting at 1001. Order numbers are sequential and start at 1001.',
      default: {
        '@path': '$.properties.order_number'
      }
    },
    payment_details: {
      type: 'object',
      label: 'Payment Details',
      description: 'An object containing information about the payment.',
      properties: {
        credit_card_bin: {
          type: 'string',
          label: 'Credit Card Bin',
          description:
            "The issuer identification number (IIN), formerly known as the bank identification number (BIN), of the customer's credit card. This is made up of the first few digits of the credit card number."
        },
        avs_result_code: {
          type: 'string',
          label: 'AVS Result Code',
          description:
            'The response code from the address verification system (AVS). The code is a single letter. See this chart for the codes and their definitions.'
        },
        cvv_result_code: {
          type: 'string',
          label: 'CVV Result Code',
          description:
            'The response code from the credit card company indicating whether the customer entered the card security code (card verification value) correctly. The code is a single letter or empty string. See this chart for the codes and their definitions.'
        },
        credit_card_number: {
          type: 'string',
          label: 'Credit Card Number',
          description: "The customer's credit card number, with most of the leading digits redacted."
        },
        credit_card_name: {
          type: 'string',
          label: 'Credit Card Name',
          description: "The customer's credit card name."
        },
        credit_card_wallet: {
          type: 'string',
          label: 'Credit Card Wallet',
          description: "The customer's credit card wallet."
        },
        credit_card_expiration_month: {
          type: 'string',
          label: 'Credit Card Expiration Month',
          description: "The customer's credit card expiration month."
        },
        credit_card_expiration_year: {
          type: 'string',
          label: 'Credit Card Expiration Year',
          description: "The customer's credit card expiration year."
        }
      },
      default: {
        credit_card_bin: { '@path': '$.properties.payment_details.credit_card_bin' },
        avs_result_code: { '@path': '$.properties.payment_details.avs_result_code' },
        cvv_result_code: { '@path': '$.properties.payment_details.cvv_result_code' },
        credit_card_number: { '@path': '$.properties.payment_details.credit_card_number' },
        credit_card_name: { '@path': '$.properties.payment_details.credit_card_name' },
        credit_card_wallet: { '@path': '$.properties.payment_details.credit_card_wallet' },
        credit_card_expiration_month: { '@path': '$.properties.payment_details.credit_card_expiration_month' },
        credit_card_expiration_year: { '@path': '$.properties.payment_details.credit_card_expiration_year' }
      }
    },
    phone: {
      type: 'string',
      label: 'Phone',
      description: "The customer's phone number for receiving SMS notifications.",
      default: {
        '@path': '$.properties.phone'
      }
    },
    presentment_currency: {
      type: 'string',
      label: 'Presentment Currency',
      description: 'The presentment currency that was used to display prices to the customer.',
      default: {
        '@path': '$.properties.presentment_currency'
      }
    },
    processed_at: {
      type: 'string',
      label: 'Processed At',
      description: 'The date and time (ISO 8601 format) when an order was processed.',
      default: {
        '@path': '$.properties.processed_at'
      }
    },
    processing_method: {
      type: 'string',
      label: 'Processing Method',
      description: 'How the payment was processed.',
      default: {
        '@path': '$.properties.processing_method'
      }
    },
    reference: {
      type: 'string',
      label: 'Reference',
      description: '',
      default: {
        '@path': '$.properties.reference'
      }
    },
    referring_site: {
      type: 'string',
      label: 'Referring Site',
      description: 'The website where the customer clicked a link to the shop.',
      default: {
        '@path': '$.properties.referring_site'
      }
    },
    shipping_address: {
      type: 'object',
      label: 'Shipping Address',
      description: 'The mailing address associated with the payment method.',
      properties: addressProperties,
      default: addressDefaultFields('$.properties.shipping_address')
    },
    source_identifier: {
      type: 'string',
      label: 'Source Identifier',
      description: 'The ID of the order placed on the originating platform.',
      default: {
        '@path': '$.properties.source_identifier'
      }
    },
    source_name: {
      type: 'string',
      label: 'Source Name',
      description: 'The source of the checkout.',
      default: {
        '@path': '$.properties.source_name'
      }
    },
    source_url: {
      type: 'string',
      label: 'Source URL',
      description: 'A valid URL to the original order on the originating surface.',
      default: {
        '@path': '$.properties.source_url'
      }
    },
    subtotal_price: {
      type: 'string',
      label: 'Subtotal Price',
      description:
        'The price of the order in the shop currency after discounts but before shipping, duties, taxes, and tips.',
      default: {
        '@path': '$.properties.subtotal_price'
      }
    },
    tags: {
      type: 'string',
      label: 'Tags',
      description:
        'Tags attached to the order, formatted as a string of comma-separated values. Tags are additional short descriptors, commonly used for filtering and searching. Each individual tag is limited to 40 characters in length.',
      default: {
        '@path': '$.properties.tags'
      }
    },
    taxes_included: {
      type: 'boolean',
      label: 'Taxes Included',
      description: 'Whether taxes are included in the order subtotal.',
      default: {
        '@path': '$.properties.taxes_included'
      }
    },
    total_discounts: {
      type: 'string',
      label: 'Total Discounts',
      description: 'The total discounts applied to the price of the order in the shop currency.',
      default: {
        '@path': '$.properties.total_discounts'
      }
    },
    total_line_items_price: {
      type: 'string',
      label: 'Total Line Items Price',
      description: 'The sum of all line item prices in the shop currency.',
      default: {
        '@path': '$.properties.total_line_items_price'
      }
    },
    total_outstanding: {
      type: 'string',
      label: 'Total Outstanding',
      description: 'The total outstanding amount of the order in the shop currency.',
      default: {
        '@path': '$.properties.total_outstanding'
      }
    },
    total_price: {
      type: 'string',
      label: 'Total Price',
      description:
        'The sum of all line item prices, discounts, shipping, taxes, and tips in the shop currency. Must be positive.',
      default: {
        '@path': '$.properties.total_price'
      }
    },
    total_price_usd: {
      type: 'string',
      label: 'Total Price USD',
      description: 'The sum of all line item prices, discounts, shipping, taxes, and tips in the shop currency in USD',
      default: {
        '@path': '$.properties.total_price_usd'
      }
    },
    total_tax: {
      type: 'string',
      label: 'Total Tax',
      description: 'The sum of all the taxes applied to the order in the shop currency. Must be positive.',
      default: {
        '@path': '$.properties.total_tax'
      }
    },
    total_tip_received: {
      type: 'string',
      label: 'Total Tip Received',
      description: 'The sum of all the tips in the order in the shop currency.',
      default: {
        '@path': '$.properties.total_tip_received'
      }
    },
    user_id: {
      type: 'string',
      label: 'User ID',
      description: 'The ID of the user logged into Shopify POS who processed the order, if applicable.',
      default: {
        '@path': '$.properties.user_id'
      }
    },
    updated_at: {
      type: 'string',
      label: 'Updated At',
      description: 'The date and time (ISO 8601 format) when the order was last modified.',
      default: {
        '@path': '$.properties.updated_at'
      }
    },
    additional_fields: {
      type: 'object',
      multiple: true,
      label: 'Additional Fields',
      description: 'Extra properties.',
      properties: {
        name: {
          type: 'string',
          label: 'Name',
          description: 'Extra property name.'
        },
        value: {
          type: 'string',
          label: 'String',
          description: 'Extra property value.'
        }
      },
      default: {
        '@arrayPath': [
          '$.properties.additional_fields',
          {
            name: { '@path': '$.name' },
            value: { '@path': '$.value' }
          }
        ]
      }
    }
  },
  perform: (request, data) => {
    const payload = {
      src: 'SEGMENT',
      data: [data.payload]
    }
    return request(baseURL + ordersEndpoint(data.settings.workspaceId), {
      method: 'post',
      json: payload
    })
  }
}

export default action
