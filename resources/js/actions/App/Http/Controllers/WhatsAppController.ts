import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
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
* @see app/Http/Controllers/WhatsAppController.php:22
* @route '/api/templates'
*/
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
* @route '/api/templates'
*/
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
* @route '/api/templates'
*/
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
* @route '/api/templates'
*/
const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
* @route '/api/templates'
*/
templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:22
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
* @see app/Http/Controllers/WhatsAppController.php:35
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
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
sendCampaign.url = (options?: RouteQueryOptions) => {
    return sendCampaign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
sendCampaign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
const sendCampaignForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
sendCampaignForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

sendCampaign.form = sendCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:77
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
* @see app/Http/Controllers/WhatsAppController.php:77
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
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
const getCampaignStatusForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
getCampaignStatusForm.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:77
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
* @see app/Http/Controllers/WhatsAppController.php:89
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
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
getCampaigns.url = (options?: RouteQueryOptions) => {
    return getCampaigns.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
getCampaigns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
getCampaigns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaigns.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
const getCampaignsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
getCampaignsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:89
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
* @see app/Http/Controllers/WhatsAppController.php:102
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
* @see app/Http/Controllers/WhatsAppController.php:102
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
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
pauseCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pauseCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
const pauseCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pauseCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pauseCampaign
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
pauseCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pauseCampaign.url(args, options),
    method: 'post',
})

pauseCampaign.form = pauseCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:125
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
* @see app/Http/Controllers/WhatsAppController.php:125
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
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
resumeCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resumeCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
const resumeCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resumeCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resumeCampaign
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
resumeCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resumeCampaign.url(args, options),
    method: 'post',
})

resumeCampaign.form = resumeCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:151
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
* @see app/Http/Controllers/WhatsAppController.php:151
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
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
retryCampaign.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
const retryCampaignForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryCampaign.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retryCampaign
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
retryCampaignForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryCampaign.url(args, options),
    method: 'post',
})

retryCampaign.form = retryCampaignForm

const WhatsAppController = { templates, sendCampaign, getCampaignStatus, getCampaigns, pauseCampaign, resumeCampaign, retryCampaign }

export default WhatsAppController