import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faYoutube, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../styles/global.css';

const SocialIcons = () => {
    return (
        <div className="flex justify-center space-x-6 class">
            <a href="https://www.linkedin.com/in/marten-gierth/" target="_blank" rel="noopener noreferrer"
               aria-label="LinkedIn"
               className="rounded-full bg-blue-700 hover:bg-blue-800 transition duration-300 p-6">
                <FontAwesomeIcon icon={faLinkedin} className="icon-large"/>
            </a>
            <a href="https://github.com/marten-gierth" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="rounded-full bg-gray-800 hover:bg-gray-600 transition duration-300 p-6">
                <FontAwesomeIcon icon={faGithub} className="icon-large"/>
            </a>
            <a href="https://youtube.com/@moinmarten" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
               className="rounded-full bg-red-600 hover:bg-red-700 transition duration-300 p-6">
                <FontAwesomeIcon icon={faYoutube} className="icon-large"/>
            </a>
            <a href="https://instagram.com/moin.marten" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="rounded-full bg-pink-500 hover:bg-pink-600 transition duration-300 p-6">
                <FontAwesomeIcon icon={faInstagram} className="icon-large"/>
            </a>
        </div>
    );
};

export default SocialIcons;