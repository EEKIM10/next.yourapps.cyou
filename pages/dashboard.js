import { Component } from "react";
import { Image } from 'next/image';
import styles from '../styles/Dashboard.module.css';
import errorBox from '../public/components/errorBox';


async function fetch_me() {
    const response = await fetch(
        "/api/me"
    );
    if(response.ok) {
        return response.json();
    }
    return {"error": response.status}
}

async function fetch_me_guilds() {
    const response = await fetch(
        "/api/me/guilds"
    );
    if(response.ok) {
        return response.json();
    }
    return {"error": response.status}
}

async function fetch_guild(guild_id, metadata=true, positions=false, applications=false) {
    let wantedData = ["config"];
    if(metadata) {
        wantedData.push("meta");
    };
    if(positions) {
        wantedData.push("positions");
    };
    if(applications) {
        wantedData.push("applications");
    };
    let url = "/api/guild?id="+guild_id;
    if(wantedData) {
        url += "&data=" + wantedData.join(" ")
    }
    const response = await fetch(url);
    if(response.ok) {
        let data = response.json();
        if(metadata===null) {
            data.meta = {
                "id": guild_id,
                "name": "Unknown Server",
                "icon": null,
                "owner": false,
                "permissions": "0",
                "features": []
            }
        }
        return data
    }
    return {"error": response.status}
}

async function resolve_roles(guild_id, roles) {
    const response = await fetch("/api/role?id="+guild_id+"&role_ids=" + roles.join(","));
    if(response.ok) {
        return response.json();
    }
    return {"error": response.status}
}

async function resolve_channel(channel_id) {
    const response = await fetch(
        "/api/channel?id="+channel_id
    );
    if(response.ok) {
        return response.json();
    }
    return {"error": response.status}
}

function resolve_image_url(image_hash, prefix, size=1024) {
    if(!image_hash) {
        return `https://cdn.discordapp.com/embed/avatars/${(Math.floor(Math.random()*10000)%5)}.png`
    }
    let extension = "webp";
    if(image_hash.startsWith("a_")) {
        extension="gif";
    };
    return `https://cdn.discordapp.com${prefix}/${image_hash}.${extension}?size=${size}`;
}


class ServerSelector extends Component {
    state = {
        failed: false,
        guilds: [],
    }
    constructor(props) {
        super(props);
        this.parent = props.parent;
    };

    async componentDidMount() {
        let _guilds;
        try {
            _guilds = await fetch_me_guilds();
        }
        catch {
            this.setState({failed: true});
            return;
        }
        if(_guilds.error!==undefined) {
            this.setState({failed: true});
            return;
        }
        let newGuilds = [];
        for(let g of _guilds) {
            if((g.permissions & 0x20)===0x20 || g.owner===true) {
                newGuilds.push(g)
            }
        }
        this.setState({"guilds": newGuilds})
    }

    render() {
        const parent_this = this.parent;
        if(this.state.failed) {
            return (
                <div style={{border: "1px solid #ba000d", backgroundColor: "#f44336", borderRadius: "12px", padding: "6px"}}>
                    <h4>Failed to load servers.</h4>
                    Try reloading the page. If that doesn't work, clear your cookies and site data, and log-in again.
                </div>
            )
        }
        if(this.state.guilds.length===0) {
            return <div className={styles.loader}></div>
        }
        else {
            return (
                <div style={{margin: "0 10vw", backgroundColor: "#2C2F33", padding: "24px", borderRadius: "12px"}}>
                    <div style={{display: "flex", flexFlow: "row wrap", justifyContent: "space-evenly", alignContent: "center", gap: "12px", paddingLeft: "20px"}}>
                        {
                            this.state.guilds.map(
                                (guild) => {
                                    const icon = resolve_image_url(guild.icon, "/icons/"+guild.id, 128);
                                    return (
                                        <a onClick={(e)=>{e.preventDefault();parent_this.selectGuild(guild)}} style={{width: "128px", height: "128px"}} key={guild.id}>
                                            <img src={icon} className={styles.avatar} title={guild.name} style={{width: "128px", height: "128px"}}/>
                                        </a>
                                    )
                                }
                            )
                        }
                    </div>
                    <div>
                        <p><i>Note: You can only see servers that you can manage.</i></p>
                    </div>
                </div>
            )
        }
    }
}


class ManageServer extends Component {
    constructor(props) {
        super(props);
        this.parent = props.parent;
        this.state = {
            data: props.data,
            guild: props.guild,
            resolved_channels: {
                log_channel: null,
                archive_channel: null
            },
            resolved_roles: {
                admin_roles: {},
                review_roles: {},
                blacklist_roles: {}
            }
        }
    }

    async componentDidMount() {
        let newState = this.state;
        if(this.state.data.config.log_channel!==null){
            newState.resolved_channels.log_channel = await resolve_channel(this.state.data.config.log_channel);
        }
        if(this.state.data.config.archive_channel!==null){
            newState.resolved_channels.archive_channel = await resolve_channel(this.state.data.config.archive_channel);
        }
        if(this.state.data.config.admin_roles.length!==0) {
            newState.resolved_roles.admin_roles = await resolve_roles(this.state.guild.id, this.state.data.config.admin_roles)
        }
        if(this.state.data.config.review_roles.length!==0) {
            newState.resolved_roles.review_roles = await resolve_roles(this.state.guild.id, this.state.data.config.review_roles)
        }
        if(this.state.data.config.blacklist_roles.length!==0) {
            newState.resolved_roles.blacklist_roles = await resolve_roles(this.state.guild.id, this.state.data.config.blacklist_roles)
        }
        this.setState(newState)
    }

    formatChannel(x) {
        if(x) {
            return (
                <a href={"https://discord.com/channels/"+this.state.guild.id+"/"+x.id} className={styles.mention}>
                    #{x.name}
                </a>
            )
        }
        return (
            <p>Unset</p>
        )
    }

    formatRole(x) {
        return (
            <p className={styles.mention} style={{"color": '#'+x.color.toString(16), backgroundColor: "#" + x.color.toString(16) + "AA"}}>
                @{x.name}
            </p>
        )
    }

    render() {
        return (
            <div>
                <h1>Manage settings for <em>{this.state.guild.name}</em>:</h1>
                <hr style={{width: "90%", textAlign: "center"}}/>
                <div>
                    <label>Prefixes: </label> <code>{this.state.data.config.prefixes.join(" ")||"ya?"}</code>
                </div>
                <div>
                    <p>Log channel: {this.formatChannel(this.state.resolved_channels.log_channel)}</p>
                    <p>Archive channel: {this.formatChannel(this.state.resolved_channels.archive_channel)}</p>
                </div>
                <div>
                    {/* <p>Administrator roles: {this.formatRole(null)})</p> */}
                </div>
            </div>
        );
    }
}


export default class Dashboard extends Component {
    state = {
        guild: null,
        data: {}
    }

    async selectGuild(guild_data) {
        let newState = {
            guild: guild_data,
            data: await fetch_guild(guild_data.id, null, true, true)
        }
        fetch_guild(guild_data.id, true, false, false).then(
            data=>this.setState({"data": {meta: data}})
        )
        this.setState(newState);
    }

    render() {
        if(!this.state.guild) {
            return <ServerSelector parent={this}/>
        }
        else {
            return <><ManageServer parent={this} data={this.state.data} guild={this.state.guild}/><hr/><pre><code>{JSON.stringify(this.state, null, 2)}</code></pre></>
        }
    }
}