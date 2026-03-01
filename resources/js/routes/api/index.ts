import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import campaign from './campaign'
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
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
export const campaigns = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: campaigns.url(options),
    method: 'get',
})

campaigns.definition = {
    methods: ["get","head"],
    url: '/api/campaigns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
campaigns.url = (options?: RouteQueryOptions) => {
    return campaigns.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
campaigns.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: campaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
campaigns.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: campaigns.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
const campaignsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: campaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
campaignsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: campaigns.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::campaigns
* @see app/Http/Controllers/WhatsAppController.php:89
* @route '/api/campaigns'
*/
campaignsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: campaigns.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

campaigns.form = campaignsForm

const api = {
    templates: Object.assign(templates, templates),
    campaign: Object.assign(campaign, campaign),
    campaigns: Object.assign(campaigns, campaigns),
}

export default api