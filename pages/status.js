import { Component } from "react";
import Head from "next/head";
import styles from '../styles/status.module.css'

// Example data:
// {
//     "shards": {
//       "0": {
//         "latency": 0.02378507098183036,
//         "online": true
//       }
//     },
//     "cogs": {
//       "jishaku": true,
//       "cogs.admin": true,
//       "cogs.member": true,
//       "cogs.guild": true,
//       "cogs._dbl": true,
//       "cogs.debug": true
//     },
//     "latency": 0.02378507098183036,
//     "online": true
//   }


function statusBar(is_online, data, parent) {
    let colour;
    let status;
    if(is_online) {
        colour = "#43b581";
        status = "Online";
    }
    else {
        colour = "#d64141";
        status = "Offline";
    }
    let cpu_percents = [];
    let cpu_sum = 0
    for(let cpu_core of data.cpu) {
        cpu_percents.push(cpu_core.toLocaleString() + "%")
        cpu_sum += cpu_core
    }
    let load_averages=[];
    for(let avg of data.load_averages) {
        load_averages.push(avg.toLocaleString())
    }
    const _this = parent;
    const switch_state = (e) => {
        e.preventDefault();
        _this.setState(
            {
                verbose: !_this.state.verbose
            }
        )
    };
    const speed = _this.state.verbose ? "Slow Internet?" : "Fast Internet?"
    return (
        <div className={styles.overallBar} style={{borderColor: colour}}>
            <a onClick={switch_state} href="#" style={{fontSize: "12px"}}>{speed}</a>
            <p>Overall Bot Process Status: <span style={{fontWeight: "bolder", color: colour}}>{status}</span></p>
            <i style={{fontSize: "11px"}}>This status represents if the bot process is even running.</i>
            <hr/>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableRow}>
                        <th>CPU usage</th>
                        <th>RAM usage</th>
                        <th>Disk usage</th>
                        <th>Load Averages (1m, 5m, 15m)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.tableRow}>
                        <td>{cpu_percents.join(", ")} ({(cpu_sum / cpu_percents.length).toLocaleString()}% overall)</td>
                        <td>{data.memory.used} used ({data.memory.percent}), {data.memory.free} free</td>
                        <td>{data.disk.used} used ({data.disk.percent}), {data.disk.free} free</td>
                        <td>{load_averages.join(", ")}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


class ShardStatus extends Component {

    state = {
        online: false,
        latency: 0.0
    }
    constructor(props) {
        super(props)
        this.shard_id = props.shard_id;
        this.setState({online: props.online, latency: props.latency})
    }

    update(online=false, latency=0.0) {
        this.setState({online: online, latency: latency})
    }

    render() {
        let online = this.state.online;
        let latency = this.state.latency;
        let slowStatus = null;
    
        if(latency>=500 && online) {
            _classname = styles.shardReallySlow;
            slowStatus = "Really Slow"
        }
        else if (latency>=200 && online) {
            _classname = styles.shardSlow
            slowStatus = "Slow"
        }
        else {
            slowStatus = "Average Speed"
        }
    
        return (
            <>
                <h1>Shard {this.shard_id}</h1>
                <div className={online ? styles.shardOnline : styles.shardOffline}>
                    <span>ID: {this.shard_id}</span><br/>
                    <span>Connected To Discord: <span style={{color: this.state.online ? "green":"red"}}>{String(this.state.online)}</span></span><br/>
                    <span>Speed: {slowStatus} ({latency.toLocaleString()}ms)</span>
                </div>
            </>
        )
    }
}

const didSetState = () => {console.debug("Set State.")}


class StatusPage extends Component {
    state = {
        data: {
            shards: {},
            cogs: {},
            latency: 0.0,
            online: null
        },
        call: 0,
        server_online: false,
        shard_elements: [],
        stats: {
            "cpu": [
                -1,
                -1
            ],
            "load_averages": [
                "loading"
            ],
            "memory": {
                "free": "0B",
                "used": "0B",
                "percent": "0%"
            },
            "disk": {
                "free": "0G",
                "used": "0G",
                "percent": "0%"
            },
            "shards": 0,
            "ping": -1
        }
    }

    constructor(props) {
        super(props);
        this.interval;
        this.lock = false;
        this.shard_elements = [];
    }

    keyPressEvent(that) {
        return (e) => {
            switch (e.key) {
                case "s":
                    if(!that.state.data.shards) {
                        break;
                    }
                    const server_id = prompt("Please enter your server ID to calculate your shard.");
                    if(!server_id) {
                        alert("No server ID provided.");
                        break;
                    }
                    else {
                        const shard_id = (server_id >> 22) % Object.keys(that.state.data.shards).length
                        alert("Your server is on shard: " + shard_id)
                    }
                    
                    break;
                case "d":
                    let element = document.getElementById("debug");
                    if(element) {
                        element.hidden = !element.hidden;
                    }
                    break;
            }
            return;
        }
    }

    fetchStats() {
        const that = this;
        const request = new XMLHttpRequest();
        request.timeout = 2999;  // Kills the request, which means we don't have to handle locks.
        
        function onStateChange(event) {
            console.debug(JSON.stringify(request, null, 2));
            if(request.readyState===4) {
                if(request.status===200) {
                    if(request.getResponseHeader("Content-Type") === "application/json") {
                        const parsed = JSON.parse(request.responseText);
                        that.setState({stats: parsed}, didSetState)
                    }
                };
            };
        };
        request.onreadystatechange = onStateChange;
        request.open("GET", "https://api.yourapps.cyou/meta/stats?system_stats=true");
        request.send();
    }

    fetchBotStatus() {
        const that = this;
        const request = new XMLHttpRequest();
        request.timeout = 1999;
        
        function onStateChange(event) {
            console.debug(JSON.stringify(request, null, 2))
            if(request.readyState===4) {
                if(request.status !== 200) {
                    return that.setState(
                        {
                            server_online: false
                        },
                        didSetState
                    );
                };

                if(request.getResponseHeader("Content-Type") === "application/json") {
                    const parsed = JSON.parse(request.responseText);
                    if(that.state.shard_elements) {
                        for(let shard_id of Object.keys(parsed.shards)) {
                            that.updateShard(shard_id)
                        }
                    }
                    else {
                        that.createShards(parsed)
                    };
                    that.setState(
                        {
                            server_online: true,
                            shard_elements: that.state.shard_elements,
                            data: parsed
                        },
                        didSetState
                    );
                };
            };
        };
        request.onreadystatechange = onStateChange;
        request.open("GET", "https://api.yourapps.cyou/meta/status");
        request.send();   
    }

    fetchStatusNew() {
        this.fetchStats();
        this.fetchBotStatus();
    }

    updateShard(shard_id, new_element) {
        let new_shards = this.state.shard_elements;
        new_shards[shard_id] = new_element
        this.setState({shard_elements: new_shards})
    }

    createShards(data) {
        let new_shards = []
        for(let shard_id of Object.keys(data.shards)) {
            console.log(shard_id)
            let shard_data = data.shards[shard_id]
            new_shards.push(
                <ShardStatus shard_id={shard_id} online={shard_data.online} latency={shard_data.latency} key={shard_id}/>
            )
        }
        return new_shards
    }

    componentWillUnmount() {
        if(this.interval) {
            clearInterval(this.interval);
        };
    }

    componentDidMount() {
        const _t = this;
        function callback(_this) {
            _this.fetchStatusNew()
        }
        this.interval = setInterval(callback, 2000, _t)
    }

    renderShards() {
        let elements = [];
        for(let shard_id of Object.keys(this.state.data.shards)) {
            let _data = this.state.data.shards[shard_id]
            elements.push(
                <tr>
                    <td>{shard_id}</td>
                    <td style={{color: _data.online ? "green" : "red"}}>{_data.online ? "yes" : "no"}</td>
                    <td>{(_data.latency*1000).toLocaleString()} {(_data.latency*1000)>120.0 ? "&#x26A0" : ""}</td>
                </tr>
            )
        }
        return (
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableRow}>
                        <th>Shard ID</th>
                        <th>Connected To Discord</th>
                        <th>Ping (ms)</th>
                    </tr>
                </thead>
                <tbody className={styles.tableRow}>
                    {elements.map((x) => x)}
                </tbody>
            </table>
        )
    }

    render() {
        if(!this.state) {
            return null;
        }
        return (
            <>
                <Head>
                    <title>YourApps Status</title>
                    <meta charSet="utf-8"/>
                    <meta property="og:title" content="YourApps - Status"/>
                    <meta property="og:site_name" content="YourApps"/>
                    <meta property="og:description"
                        content="View the live status for YourApps here."
                    />
                    <meta property="og:type" content="website"/>
                    <meta name="theme-color" content="#7289DA"/>
                    <meta name="description"
                        content="View the live status for YourApps here."
                    />
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta httpEquiv="Cache-Control" content="max-age=86400"/>
                    <link rel="preconnect" href="https://api.yourapps.cyou"/>
                </Head>
                <div id="debug" hidden>
                    <p>StatusPage State:</p>
                    <code><pre>{JSON.stringify(this.state, null, 2)}</pre></code>
                </div>
                <div style={{height: "50vh", textAlign: "center"}} onKeyDown={this.onKeyDown}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {statusBar(this.state.server_online, this.state.stats, this)}
                    </div>
                    <hr style={{width: "75%", textAlign: "center"}}/>
                    <h2>Individual shard statuses</h2>
                    <div style={{display: "flex", justifyContent: "center", backgroundColor: "rgba(20,20,20,0.2)"}}>
                        {this.renderShards()}
                    </div>
                </div>
            </>
        )
    }
}

export default StatusPage