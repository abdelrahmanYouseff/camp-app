import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
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
* @see app/Http/Controllers/WhatsAppController.php:21
* @route '/api/templates'
*/
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
* @route '/api/templates'
*/
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
* @route '/api/templates'
*/
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
* @route '/api/templates'
*/
const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
* @route '/api/templates'
*/
templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::templates
* @see app/Http/Controllers/WhatsAppController.php:21
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
* @see app/Http/Controllers/WhatsAppController.php:34
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
* @see app/Http/Controllers/WhatsAppController.php:34
* @route '/api/campaign/send'
*/
sendCampaign.url = (options?: RouteQueryOptions) => {
    return sendCampaign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:34
* @route '/api/campaign/send'
*/
sendCampaign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:34
* @route '/api/campaign/send'
*/
const sendCampaignForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::sendCampaign
* @see app/Http/Controllers/WhatsAppController.php:34
* @route '/api/campaign/send'
*/
sendCampaignForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendCampaign.url(options),
    method: 'post',
})

sendCampaign.form = sendCampaignForm

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:71
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
* @see app/Http/Controllers/WhatsAppController.php:71
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
* @see app/Http/Controllers/WhatsAppController.php:71
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:71
* @route '/api/campaign/{campaign}'
*/
getCampaignStatus.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaignStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:71
* @route '/api/campaign/{campaign}'
*/
const getCampaignStatusForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:71
* @route '/api/campaign/{campaign}'
*/
getCampaignStatusForm.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaignStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaignStatus
* @see app/Http/Controllers/WhatsAppController.php:71
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
* @see app/Http/Controllers/WhatsAppController.php:83
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
* @see app/Http/Controllers/WhatsAppController.php:83
* @route '/api/campaigns'
*/
getCampaigns.url = (options?: RouteQueryOptions) => {
    return getCampaigns.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:83
* @route '/api/campaigns'
*/
getCampaigns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:83
* @route '/api/campaigns'
*/
getCampaigns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCampaigns.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:83
* @route '/api/campaigns'
*/
const getCampaignsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:83
* @route '/api/campaigns'
*/
getCampaignsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getCampaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::getCampaigns
* @see app/Http/Controllers/WhatsAppController.php:83
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

const WhatsAppController = { templates, sendCampaign, getCampaignStatus, getCampaigns }

export default WhatsAppController