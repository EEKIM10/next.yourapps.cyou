import styles from '../../styles/Nav.module.css';
import Image from "next/image";
import {Component} from "react";


export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.cookies = props.cookies;
        this.state = {userData: {"username": "loading", "avatar_url": "/loading.gif"}}
    }

    async componentDidMount() {
        if(this.props.cookies.session) {
            const response = await fetch(
                "https://discord.com/api/v8/users/@me",
                {
                    headers: {
                        authorization: "Bearer " + "null",
                        "User-Agent": "DiscordBot"
                    }
                }
            )
            if(response.status!==200) {
                console.error("Failed to fetch user.")
                this.setState({
                        userData: {
                            username: "Error",
                            avatar_url: "https://discord.com/assets/289673858e06dfa2e0e3a7ee610c3a30.svg"
                        }
                    }
                )
            }
            else {
                const data = await response.json();
                let av_url;
                if(data.avatar) {
                    if(data.avatar.startsWith("a_")) {
                        av_url = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif`
                    }
                    else {
                        av_url = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp`
                    }
                }
                else {
                    av_url = `https://cdn.discordapp.com/embed/avatars/${data.id % 5}.png`
                }
                this.setState({
                        userData: {
                            username: data.username,
                            avatar_url: av_url
                        }
                    }
                )
            }
        }
    }

    render() {
        return (
            <nav className={styles.mainNav}>
                <div className={styles.navBoxLeft}>
                    <a href={"//beta.dragdev.xyz"}>
                        <Image src={"/avatar.png"} width={"64px"} height={"64px"} alt={""}/>
                        <span><h1>DDS - YourApps</h1></span>
                    </a>
                </div>
                <div className={styles.navBoxRight}>
                    <div className={styles.spacedBox}>
                        <a href={"/"}>Home</a>
                    </div>
                    <div className={styles.spacedBox}>
                        <a href={"/dash"}>
                            <div style={{display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
                                <Image src={this.state.userData.avatar_url} width={"32px"} height={"32px"}/>
                                <span style={{paddingLeft: "4px"}}>{this.state.userData.username}</span>
                            </div>
                        </a>
                    </div>
                </div>
            </nav>
        )
    }
}