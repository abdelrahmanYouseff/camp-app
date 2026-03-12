import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
export const templates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

templates.definition = {
    methods: ["get","head"],
    url: '/api/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:23
* @route '/api/templates'
*/
templatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

templates.form = templatesForm

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:36
* @route '/api/campaign/send'
*/
export const sendCampaign = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendCampaign.url(options),
    method: 'post',
})

sendCampaign.definition = {
    methods: ["post"],
    url: '/api/campaign/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:36
* @route '/api/campaign/send'
*/
sendCampaign.url = (options?: RouteQueryOptions) => {
    return sendCampaign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:36
* @route '/api/campaign/send'
*/
sendCampaign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:36
* @route '/api/campaign/send'
*/
const sendCampaignForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:36
* @route '/api/campaign/send'
*/
sendCampaignForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

sendCampaign.form = sendCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
export const getCampaignStatus = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'get',
})

getCampaignStatus.definition = {
    methods: ["get","head"],
    url: '/api/campaign/{campaign}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { campaign: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        campaign: typeof args.campaign === 'object'
        ? args.campaign.id
        : args.campaign,
    }

    return getCampaignStatus.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
const getCampaignStatusForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
getCampaignStatusForm.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:78
* @route '/api/campaign/{campaign}'
*/
getCampaignStatusForm.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getCampaignStatus.form = getCampaignStatusForm

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
export const getCampaigns = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaigns.url(options),
    method: 'get',
})

getCampaigns.definition = {
    methods: ["get","head"],
    url: '/api/campaigns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
getCampaigns.url = (options?: RouteQueryOptions) => {
    return getCampaigns.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
getCampaigns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
getCampaigns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaigns.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
const getCampaignsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
getCampaignsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:90
* @route '/api/campaigns'
*/
getCampaignsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getCampaigns.form = getCampaignsForm

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:103
* @route '/api/campaign/{campaign}/pause'
*/
export const pauseCampaign = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pauseCampaign.url(args, options),
    method: 'post',
})

pauseCampaign.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/pause',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:103
* @route '/api/campaign/{campaign}/pause'
*/
pauseCampaign.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { campaign: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        campaign: typeof args.campaign === 'object'
        ? args.campaign.id
        : args.campaign,
    }

    return pauseCampaign.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:103
* @route '/api/campaign/{campaign}/pause'
*/
pauseCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pauseCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:103
* @route '/api/campaign/{campaign}/pause'
*/
const pauseCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pauseCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:103
* @route '/api/campaign/{campaign}/pause'
*/
pauseCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pauseCampaign.url(args, options),
    method: 'post',
})

pauseCampaign.form = pauseCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:126
* @route '/api/campaign/{campaign}/resume'
*/
export const resumeCampaign = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resumeCampaign.url(args, options),
    method: 'post',
})

resumeCampaign.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:126
* @route '/api/campaign/{campaign}/resume'
*/
resumeCampaign.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { campaign: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        campaign: typeof args.campaign === 'object'
        ? args.campaign.id
        : args.campaign,
    }

    return resumeCampaign.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:126
* @route '/api/campaign/{campaign}/resume'
*/
resumeCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resumeCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:126
* @route '/api/campaign/{campaign}/resume'
*/
const resumeCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resumeCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:126
* @route '/api/campaign/{campaign}/resume'
*/
resumeCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resumeCampaign.url(args, options),
    method: 'post',
})

resumeCampaign.form = resumeCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:152
* @route '/api/campaign/{campaign}/retry'
*/
export const retryCampaign = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryCampaign.url(args, options),
    method: 'post',
})

retryCampaign.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:152
* @route '/api/campaign/{campaign}/retry'
*/
retryCampaign.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { campaign: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            campaign: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        campaign: typeof args.campaign === 'object'
        ? args.campaign.id
        : args.campaign,
    }

    return retryCampaign.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:152
* @route '/api/campaign/{campaign}/retry'
*/
retryCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:152
* @route '/api/campaign/{campaign}/retry'
*/
const retryCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:152
* @route '/api/campaign/{campaign}/retry'
*/
retryCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryCampaign.url(args, options),
    method: 'post',
})

retryCampaign.form = retryCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
export const whatsappPhoneNumbers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappPhoneNumbers.url(options),
    method: 'get',
})

whatsappPhoneNumbers.definition = {
    methods: ["get","head"],
    url: '/api/settings/whatsapp-phone-numbers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
whatsappPhoneNumbers.url = (options?: RouteQueryOptions) => {
    return whatsappPhoneNumbers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
whatsappPhoneNumbers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: whatsappPhoneNumbers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
whatsappPhoneNumbers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: whatsappPhoneNumbers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
const whatsappPhoneNumbersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: whatsappPhoneNumbers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
whatsappPhoneNumbersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: whatsappPhoneNumbers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::whatsappPhoneNumbers
* @see app/Http/Controllers/WhatsAppController.php:193
* @route '/api/settings/whatsapp-phone-numbers'
*/
whatsappPhoneNumbersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: whatsappPhoneNumbers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

whatsappPhoneNumbers.form = whatsappPhoneNumbersForm

/**
* @see \App\Http\Controllers\WhatsAppController::setActiveWhatsAppPhone
* @see app/Http/Controllers/WhatsAppController.php:216
* @route '/api/settings/active-whatsapp-phone'
*/
export const setActiveWhatsAppPhone = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setActiveWhatsAppPhone.url(options),
    method: 'post',
})

setActiveWhatsAppPhone.definition = {
    methods: ["post"],
    url: '/api/settings/active-whatsapp-phone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::setActiveWhatsAppPhone
* @see app/Http/Controllers/WhatsAppController.php:216
* @route '/api/settings/active-whatsapp-phone'
*/
setActiveWhatsAppPhone.url = (options?: RouteQueryOptions) => {
    return setActiveWhatsAppPhone.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::setActiveWhatsAppPhone
* @see app/Http/Controllers/WhatsAppController.php:216
* @route '/api/settings/active-whatsapp-phone'
*/
setActiveWhatsAppPhone.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setActiveWhatsAppPhone.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::setActiveWhatsAppPhone
* @see app/Http/Controllers/WhatsAppController.php:216
* @route '/api/settings/active-whatsapp-phone'
*/
const setActiveWhatsAppPhoneForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setActiveWhatsAppPhone.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::setActiveWhatsAppPhone
* @see app/Http/Controllers/WhatsAppController.php:216
* @route '/api/settings/active-whatsapp-phone'
*/
setActiveWhatsAppPhoneForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setActiveWhatsAppPhone.url(options),
    method: 'post',
})

setActiveWhatsAppPhone.form = setActiveWhatsAppPhoneForm

/**
* @see \App\Http\Controllers\WhatsAppController::storeWhatsAppAccount
* @see app/Http/Controllers/WhatsAppController.php:264
* @route '/api/settings/whatsapp-accounts'
*/
export const storeWhatsAppAccount = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWhatsAppAccount.url(options),
    method: 'post',
})

storeWhatsAppAccount.definition = {
    methods: ["post"],
    url: '/api/settings/whatsapp-accounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::storeWhatsAppAccount
* @see app/Http/Controllers/WhatsAppController.php:264
* @route '/api/settings/whatsapp-accounts'
*/
storeWhatsAppAccount.url = (options?: RouteQueryOptions) => {
    return storeWhatsAppAccount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::storeWhatsAppAccount
* @see app/Http/Controllers/WhatsAppController.php:264
* @route '/api/settings/whatsapp-accounts'
*/
storeWhatsAppAccount.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWhatsAppAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::storeWhatsAppAccount
* @see app/Http/Controllers/WhatsAppController.php:264
* @route '/api/settings/whatsapp-accounts'
*/
const storeWhatsAppAccountForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWhatsAppAccount.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::storeWhatsAppAccount
* @see app/Http/Controllers/WhatsAppController.php:264
* @route '/api/settings/whatsapp-accounts'
*/
storeWhatsAppAccountForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWhatsAppAccount.url(options),
    method: 'post',
})

storeWhatsAppAccount.form = storeWhatsAppAccountForm

/**
* @see \App\Http\Controllers\WhatsAppController::updateWhatsAppAccountLabel
* @see app/Http/Controllers/WhatsAppController.php:301
* @route '/api/settings/whatsapp-accounts/{account}/label'
*/
export const updateWhatsAppAccountLabel = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWhatsAppAccountLabel.url(args, options),
    method: 'patch',
})

updateWhatsAppAccountLabel.definition = {
    methods: ["patch"],
    url: '/api/settings/whatsapp-accounts/{account}/label',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WhatsAppController::updateWhatsAppAccountLabel
* @see app/Http/Controllers/WhatsAppController.php:301
* @route '/api/settings/whatsapp-accounts/{account}/label'
*/
updateWhatsAppAccountLabel.url = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { account: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { account: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            account: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        account: typeof args.account === 'object'
        ? args.account.id
        : args.account,
    }

    return updateWhatsAppAccountLabel.definition.url
            .replace('{account}', parsedArgs.account.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::updateWhatsAppAccountLabel
* @see app/Http/Controllers/WhatsAppController.php:301
* @route '/api/settings/whatsapp-accounts/{account}/label'
*/
updateWhatsAppAccountLabel.patch = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWhatsAppAccountLabel.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WhatsAppController::updateWhatsAppAccountLabel
* @see app/Http/Controllers/WhatsAppController.php:301
* @route '/api/settings/whatsapp-accounts/{account}/label'
*/
const updateWhatsAppAccountLabelForm = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWhatsAppAccountLabel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::updateWhatsAppAccountLabel
* @see app/Http/Controllers/WhatsAppController.php:301
* @route '/api/settings/whatsapp-accounts/{account}/label'
*/
updateWhatsAppAccountLabelForm.patch = (args: { account: number | { id: number } } | [account: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWhatsAppAccountLabel.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateWhatsAppAccountLabel.form = updateWhatsAppAccountLabelForm

const WhatsAppController = { templates, sendCampaign, getCampaignStatus, getCampaigns, pauseCampaign, resumeCampaign, retryCampaign, whatsappPhoneNumbers, setActiveWhatsAppPhone, storeWhatsAppAccount, updateWhatsAppAccountLabel }

export default WhatsAppController