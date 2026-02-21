import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:15
* @route '/new'
*/
export const newMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})

newMethod.definition = {
    methods: ["get","head"],
    url: '/new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:15
* @route '/new'
*/
newMethod.url = (options?: RouteQueryOptions) => {
    return newMethod.definition.url + queryParams(options)
}

/**
* @see routes/web.php:15
* @route '/new'
*/
newMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})

/**
* @see routes/web.php:15
* @route '/new'
*/
newMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(options),
    method: 'head',
})

/**
* @see routes/web.php:15
* @route '/new'
*/
const newMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: newMethod.url(options),
    method: 'get',
})

/**
* @see routes/web.php:15
* @route '/new'
*/
newMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: newMethod.url(options),
    method: 'get',
})

/**
* @see routes/web.php:15
* @route '/new'
*/
newMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: newMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

newMethod.form = newMethodForm

const campaign = {
    new: Object.assign(newMethod, newMethod),
}

export default campaign