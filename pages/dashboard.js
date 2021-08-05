import {Component} from "react";
import Image from "next/image";
import styles from '../styles/Dashboard.module.css';
import Head from "next/head";


const placeholder = "/placeholder.png"



function Loader(props) {
    return (
        <div className={styles.loader} style={{width: props.width||"128px", height: props.height||"128px"}} id={"loader"}/>
    )
}


function Guild(props) {
    let uri = `https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}`;
    if(!props.guild.icon) {
        uri = `https://cdn.discordapp.com/embed/avatars/${props.guild.id % 5}.png`;
    }
    else if (props.guild.icon.startsWith("a_")) {
        uri += ".gif";
    }
    else {
        uri += ".webp";
    }
    return (
        <a onClick={()=>{props.p.selected(props.guild.id)}} title={props.guild.name} style={{margin: "4px", borderRadius: "50%"}} id={props.guild.id}>
            <Image src={uri} alt={props.guild.name} placeholder={"blur"} blurDataURL={placeholder} className={styles.avatar} width={"128px"} height={"128px"}/>
        </a>
    )
}


class ServerSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {guilds: []}
    }

    async componentDidMount() {
        document.body.style.minHeight = "100%"
        const request = await fetch(
            "/api/me/guilds"
        )
        const data = await request.json();
        this.setState({guilds: data});
        document.getElementById("loader").remove();
    };

    render() {
        let legal = []
        for(let guild of this.state.guilds) {
            if((guild.permissions & 0x20) === 0x20) {
                legal.push(guild)
            }
        }
        return (
            <>
                <div style={{textAlign: "center"}}>
                    <Loader width={"128px"} height={"128px"}/>
                </div>
                <div id={"guilds"}>
                    {legal.map((g)=>{return <Guild key={g.id} guild={g} p={this.props.p}/>})}
                </div>
            </>
        )
    }
}


class DashboardUI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewing: "index",
            metaData: {
                name: "loading"
            },
            serverData: {
                id: "0",
                prefixes: ["ya?"],
                log_channel: "0",
                arc_channel: "0",
                admin_roles: [],
                review_roles: [],
                blacklist_roles: [],
                ignored_channels: [],
                ignored_roles: [],
                apps: {},
                premium: null
            },
            resolvedChannels: {
                log: "loading",
                arc: "loading",
            },
            resolvedRoles: {
                admin: ["loading"],
                review: ["loading"],
                black: ["loading"]
            }
        }
        this.bodies = {
            index: this.index,
            "settings.prefix": this.settings_prefix
        }
    }

    async resolve_all() {
        let newResolvedChannels = {
            log: (await this.fetchChannel(this.state.serverData.log_channel)).name,
            arc: (await this.fetchChannel(this.state.serverData.arc_channel)).name,
        }
        let newResolvedRoles = {
            admin: [],
            review: [],
            black: []
        }
        let resolvedRolesData = await this.fetchRoles()
        for(let roleID of this.state.serverData.admin_roles) {
            if(!resolvedRolesData[roleID]) {
                continue;
            }
            newResolvedRoles.admin.push(resolvedRolesData[roleID]);
        }
        for(let roleID of this.state.serverData.review_roles) {
            newResolvedRoles.review.push(resolvedRolesData[roleID]);
        }
        newResolvedRoles.admin = newResolvedRoles.admin || ["No Admin Roles"];
        newResolvedRoles.review = newResolvedRoles.review || ["No Reviewer Roles"];
        newResolvedRoles.black = newResolvedRoles.black || ["No Blacklisted Roles"];
        this.setState({resolvedRoles: newResolvedRoles, resolvedChannels: newResolvedChannels})
    }

    async fetchRoles() {
        const response = await fetch("/api/role?id="+this.state.serverData.id);
        const roles = await response.json();
        let resolved = {};
        for(let role of roles) {
            resolved[role.id] = role.name
        }
        return resolved
    }

    async fetchChannel(id) {
        const response = await fetch("/api/channel?id="+id)
        return await response.json()
    }

    index(_t) {
        let log_channel = _t.state.resolvedChannels.log;
        let archive_channel = _t.state.resolvedChannels.arc;
        let premiumStatus;
        if(_t.state.serverData.premium===true) {
            premiumStatus = <em style={{color: "green"}}>Premium Activated ❤️</em>
        }
        else if (_t.state.serverData.premium===null) {
            premiumStatus = <em>Loading</em>
        }
        else {
            premiumStatus = (
                <a href={"https://donatebot.io/checkout/706271127542038608"}>
                    <em style={{color: "red"}}>Premium Not Activated😔<br/>Click here to purchase.</em>
                </a>
            )
        }

        return (
            <>
                {premiumStatus}
                <p>Server ID: <code>{_t.state.serverData.id}</code></p>
                <p>Prefixes: <code>{_t.state.serverData.prefixes.join(", ")||"ya?"}</code></p>
                <br/>
                <p>Log channel: <code>{isNaN(log_channel)?<span>#</span>:null}{log_channel||"No Log Channel."}</code></p>
                <p>Archive channel: <code>{isNaN(log_channel)?<span>#</span>:null}{archive_channel||"No Archive Channel."}</code></p>
                <br/>
                <p>Admin Roles: {_t.state.resolvedRoles.admin.join(", ")||"No Admin Roles"}</p>
                <p>Reviewer Roles: {_t.state.resolvedRoles.review.join(", ")||"No Reviewer Roles"}</p>
                <p>Blacklisted Roles: {_t.state.resolvedRoles.black.join(", ")||"No Blacklist Roles"}</p>
                <h4>Positions:</h4>
                <ul>
                    {Object.keys(_t.state.serverData.apps).map((a)=>{return <li key={a}>{_t.state.serverData.apps[a]}</li>})}
                </ul>
            </>
        )
    }

    async componentDidMount() {
        document.body.style.height = "100%"
        try {this.cookies = document.cookie.match("session=(?<session>[a-zA-Z0-9]+)").groups}
        catch {this.cookies = {session: null}}
        if(this.cookies.session) {
            let me_response;
            try {
                me_response = await fetch(
                    "/api/me",
                    {
                        headers: {
                            authorization: this.cookies.session,
                        }
                    }
                )
            }
            catch {
                me_response = {status: 0}
            }
            if(me_response.status!==200) {
                window.location.href = "/api/login"
            }
        }
        else {
            window.location.href = "/api/login"
        }

        const response = await fetch(
            "/api/guild?id=" + this.props.guild + "&data=meta",
            {
                headers: {
                    "Authorization": this.cookies.session
                }
            }
        )
        if([403, 404].includes(response.status)) {
            /* Bot is not in this server. */
            return this.props.dad.setState({selected: null})
        }
        const response2 = await fetch("/api/guild?id="+this.props.guild+"&data=config")
        if(response.status !== 200) {
            // We can't really ignore this one
            return this.props.dad.setState({selected: null})
        }
        let newData = {metaData: await response.json(), serverData: await response2.json()}
        this.setState(newData)
        await this.resolve_all();
    }

    switchView(to) {
        this.setState({viewing: to})
    }

    getBody() {
        return this.bodies[this.state.viewing](this);
    }

    settings_prefix(_t) {
        _t.setState({viewing: "settings.prefix"})
        return (
            <div>
                <h2>Settings</h2>
                <div className={styles.section}>
                    <h3>Prefix</h3>
                    <p>This is the few characters you add to the front of your message to inform the bot that
                    you&apos;re talking to it.</p>
                    <p><code>ya-v3-force-prefix?</code> is a hardcoded prefix that cannot be added or removed,
                    and is there in case you forget your prefix.</p>
                    <span>Prefix: </span> <input type={"text"} value={(_t.state.serverData.prefixes||["ya?"]).join(" ")}/>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{marginLeft: "20px", display: "flex"}}>
                <Head>
                    <title>Dashboard - Edit server - {this.state.metaData.name}</title>
                </Head>
                <div>
                    <div className={styles.column}>
                        <h3>{this.state.metaData.name}</h3>
                        <div style={{margin: "4px"}}>
                            <button style={{cursor: "pointer"}} onClick={()=>{this.props.dad.setState({selected: null})}}
                                    className={styles.inactive}>
                                Back To Server Selection
                            </button>
                        </div>
                        <div style={{margin: "4px"}}>
                            <button style={{cursor: "pointer"}} onClick={()=>{this.switchView("settings")}}
                                    className={this.state.viewing === "settings.prefix" ? styles.active:styles.inactive}>
                                Settings - Prefix
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft: "10%"}}>
                    <h1>Edit server: {this.state.metaData.name}</h1>
                    <div className={styles.body}>
                        {this.getBody(this.state.viewing)}
                    </div>
                </div>
            </div>
        )
    }
}


export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }

    selected(server_id) {
        this.setState({selected: server_id});
    }

    render() {
        if(!this.state.selected) {
            return (
                <main>
                    <Head>
                        <title>Dashboard - Select Server</title>
                    </Head>
                    <h1 style={{textAlign: "center"}}>Select A Server</h1>
                    <div style={{display: "flex", justifyContent: "center", alignItems: "baseline", textAlign: "center"}}>
                        <div style={{width: "50%"}}>
                            <ServerSelection p={this}/>
                        </div>
                    </div>
                </main>
            )
        }
        else {
            return (
                <main>
                    <DashboardUI dad={this} guild={this.state.selected}/>
                </main>
            )
        }
    }
}