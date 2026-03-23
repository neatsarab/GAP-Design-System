import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Solid icons
import { fas } from '@fortawesome/free-solid-svg-icons'

// Regular icons
import { far } from '@fortawesome/free-regular-svg-icons'

// Brand icons
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

export { FontAwesomeIcon }
