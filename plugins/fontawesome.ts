import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faGithub, 
  faInstagram, 
  faDiscord,
  faLinkedin,
  faTwitter
} from '@fortawesome/free-brands-svg-icons'
import { 
  faArrowUp, 
  faCode, 
  faMobileAlt, 
  faServer, 
  faTools,
  faPalette,
  faCogs,
  faMobile,
  faWrench,
  faBars,
  faTimes,
  faEnvelope,
  faLaptopCode,
  faRocket,
  faStar,
  faHeart,
  faBolt,
  faFire,
  faGraduationCap,
  faTrophy,
  faPuzzlePiece,
  faChartLine
} from '@fortawesome/free-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

// Add icons to the library
library.add(
  faGithub,
  faInstagram,
  faDiscord,
  faLinkedin,
  faTwitter,
  faArrowUp,
  faCode,
  faMobileAlt,
  faServer,
  faTools,
  faPalette,
  faCogs,
  faMobile,
  faWrench,
  faBars,
  faTimes,
  faEnvelope,
  faLaptopCode,
  faRocket,
  faStar,
  faHeart,
  faBolt,
  faFire,
  faGraduationCap,
  faTrophy,
  faPuzzlePiece,
  faChartLine
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
