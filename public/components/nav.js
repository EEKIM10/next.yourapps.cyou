import styles from '../../styles/Nav.module.css';
import Image from "next/image";
import {Component} from "react";


class UserCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "loading",
            avatar_url: "/loading.gif",
            needsLogin: null
        }
    }

    async componentDidMount() {
        try {this.cookies = document.cookie.match("session=(?<session>[a-zA-Z0-9]+)").groups}
        catch {this.cookies = {session: null}}
        if(this.cookies.session) {
            let response;
            try {
                response = await fetch(
                    "/api/me",
                    {
                        headers: {
                            authorization: this.cookies.session,
                        }
                    }
                )
            }
            catch {
                response = {status: 0}
            }
            if(response.status!==200) {
                this.setState({
                        username: "log in",
                        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png?size=64",
                        needsLogin: true
                    }
                )
            }
            else {
                const data = await response.json();
                let av_url;
                if(data.avatar) {
                    if(data.avatar.startsWith("a_")) {
                        av_url = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif?size=64`
                    }
                    else {
                        av_url = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=64`
                    }
                }
                else {
                    av_url = `https://cdn.discordapp.com/embed/avatars/${data.id % 5}.png?size=64`
                }
                this.setState({
                        username: data.username,
                        avatar_url: av_url,
                        needsLogin: false
                    }
                )
            }
        }
        else {
            this.setState({
                username: "log in",
                    avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
                    needsLogin: true
                }
            )
        }
    }

    render() {
        let href;
        if(this.state.needsLogin===true) {
            href="/api/login";
        }
        else if (this.state.needsLogin===null) {
            href = "#"  // Request hasn't completed yet.
        }
        else {
            href = "/dashboard"
        }

        return (
            <div className={styles.spacedBox}>
                <a href={href}>
                    <div>
                        <Image src={this.state.avatar_url} width={"32px"} height={"32px"}/>
                        <span title={"Dashboard"} style={{paddingLeft: "4px", fontSize: "18px"}}>{this.state.username}</span>
                    </div>
                </a>
            </div>
        )
    }
}


export default class Nav extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className={styles.mainNav}>
                <div className={styles.navBoxLeft}>
                    <a href={"/"}>
                        <div style={{display: "inline-flex", flexDirection: "row", verticalAlign: "baseline", alignItems: "center"}}>
                            <Image src={"/avatar.png"} width={"64px"} height={"64px"} alt={""}/>
                            <span style={{marginLeft: "4px", fontSize: "2rem"}}>DDS - YourApps</span>
                        </div>
                    </a>
                </div>
                <div className={styles.navBoxRight}>
                    <div className={styles.spacedBox}>
                        <a href={"/"} style={{fontSize: "18px"}}>Home</a>
                    </div>
                    <UserCard/>
                </div>
            </nav>
        )
    }
}