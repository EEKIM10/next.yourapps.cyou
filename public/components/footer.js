import {Component} from "react";
import Icon from "./icon";
import styles from '../../styles/footer.module.css';

const t = "https://top.gg/bot/"


function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}


function footerCheck() {
    const footer = document.getElementsByTagName("footer").item(0);
    if(footer) {
        footer.hidden = !isInViewport(footer)
    }
}



class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <span onLoad={()=>{console.log("fuck this");setInterval(footerCheck, 10)}}/>
                <footer className={styles.mainFooter}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <h1>DragDev Studios</h1>
                            <div className={styles.flexRow}>
                                <a href={"//discord.gg/YBNWw7nMGH"} className={styles.social}>
                                    <Icon name={"discord"}/>
                                </a>
                                <a href={"mailto:support@dragdev.xyz"} className={styles.social}>
                                    <Icon name={"email"}/>
                                </a>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h4>Bots</h4>
                            </div>
                            <div>
                                <a href={t+"619328560141697036"}>YourApps</a>
                            </div>
                            <div>
                                <a href={t+"753952234026303550"}>Tickets</a>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h4>Other Sites</h4>
                            </div>
                            <div><a href={"//dragdev.xyz"}>Main site</a></div>
                            <div><a href={"//beta.dragdev.xyz"}>Partial beta redesign site</a></div>
                            <div><a href={"//yourapps.cyou"}>YourApps' site</a></div>
                            <div><a href={"//api.yourapps.cyou/"}>YourApps' API</a></div>
                            <div><a href={"//ddt.clicksminuteper.net/docs"}>Tickets Docs</a></div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

export default Footer;