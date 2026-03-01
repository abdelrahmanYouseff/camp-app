import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WhatsAppController::send
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/api/campaign/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::send
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::send
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::send
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::send
* @see app/Http/Controllers/WhatsAppController.php:35
* @route '/api/campaign/send'
*/
sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

send.form = sendForm

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
export const status = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/campaign/{campaign}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
status.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
status.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
status.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
const statusForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
statusForm.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WhatsAppController::status
* @see app/Http/Controllers/WhatsAppController.php:77
* @route '/api/campaign/{campaign}'
*/
statusForm.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\WhatsAppController::pause
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
export const pause = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

pause.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/pause',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::pause
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
pause.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return pause.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::pause
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
pause.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pause
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
const pauseForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::pause
* @see app/Http/Controllers/WhatsAppController.php:102
* @route '/api/campaign/{campaign}/pause'
*/
pauseForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pause.url(args, options),
    method: 'post',
})

pause.form = pauseForm

/**
* @see \App\Http\Controllers\WhatsAppController::resume
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
export const resume = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::resume
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
resume.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return resume.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::resume
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
resume.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resume
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
const resumeForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::resume
* @see app/Http/Controllers/WhatsAppController.php:125
* @route '/api/campaign/{campaign}/resume'
*/
resumeForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

resume.form = resumeForm

/**
* @see \App\Http\Controllers\WhatsAppController::retry
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
export const retry = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/api/campaign/{campaign}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WhatsAppController::retry
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
retry.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return retry.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WhatsAppController::retry
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
retry.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retry
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
const retryForm = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WhatsAppController::retry
* @see app/Http/Controllers/WhatsAppController.php:151
* @route '/api/campaign/{campaign}/retry'
*/
retryForm.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retry.url(args, options),
    method: 'post',
})

retry.form = retryForm

const campaign = {
    send: Object.assign(send, send),
    status: Object.assign(status, status),
    pause: Object.assign(pause, pause),
    resume: Object.assign(resume, resume),
    retry: Object.assign(retry, retry),
}

export default campaign