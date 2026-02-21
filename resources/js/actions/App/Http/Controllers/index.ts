import WhatsAppController from './WhatsAppController'
import Settings from './Settings'

const Controllers = {
    WhatsAppController: Object.assign(WhatsAppController, WhatsAppController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers