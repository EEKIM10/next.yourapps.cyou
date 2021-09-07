import { Component } from "react";
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


function statusBar(is_online, data) {
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
    return (
        <div className={styles.overallBar} style={{borderColor: colour}}>
            <p>Overall Bot Process Status: <span style={{fontWeight: "bolder"}}>{status}</span></p>
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
                        <td>{data.load_averages.join(", ")}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}


class ShardStatus extends Component {
    constructor(props) {
        super(props)
        this.shard_id = props.shard_id;
        this.setState({online: props.online, latency: props.latency})
    }

    update(online, latency) {
        this.setState({online: online, latency: latency})
    }

    render() {
        if(!this.state) {
            return null;
        }
        let online = this.state.online;
        let latency = this.state.latency;
        let _classname = online ? styles.shardOnline : styles.shardOffline;
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
            <div className={_classname} title={`Shard ID: ${this.shard_id} | Online: ${this.state.online} | Latency (ms): ${this.state.latency}`} key={this.shard_id}>
                ID: {this.shard_id}<br/>
                Connected To Discord: {String(this.state.online)}<br/>
                Speed: {slowStatus} ({latency}ms)<br/>
            </div>
        )
    }
}

const didSetState = () => {console.log("Set State.")}


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
        shards: [],
        stats: {
            "users": 0,
            "guilds": 0,
            "channels": 0,
            "emojis": 0,
            "commands": 0,
            "positions": 0,
            "cpu": [
                -1,
                -1
            ],
            "load_averages": [
                -1,
                -1,
                -1
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
        this.shard_elements = {};
    }

    async fetchStatus() {
        let response;
        let response2
        try {
            console.log("Requesting status")
            response = await fetch("https://api.yourapps.cyou/meta/status");
            console.log("Requesting stats")
            response2 = await fetch("https://api.yourapps.cyou/meta/stats")
        }
        catch (e) {
            console.error("Network Error.")
            console.error(e)
            this.setState(
                {
                    server_online: false
                },
                didSetState
            )
            return;
        }
        if(!response.ok) {
            this.setState(
                {
                    server_online: false
                },
                didSetState
            );
            return;
        }
        else {
            const data = await response.json();
            console.log("Status Data:", data)
            this.createShards(data)
            this.setState(
                {
                    server_online: true,
                    data: data,
                    stats: await response2.json()
                },
                didSetState
            )
        }
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
        this.setState({shards: new_shards}, didSetState)
    }

    async getInitialShardCount() {
        console.log("GetInitialShardCount")
        // The purpose of this method is to pre-create the shard objects before they're rendered.
        // This makes it significantly easier to update them as we don't have to do anything but render in the render method.
        // The drawback to this, however, is that we won't get any new shards if this page is left open when a new shard is created.
        // I mean, to be honest though, the chances of a new shard being launched during this page's lifespan is... slim, at best.
        let response, data;
        try {
            response = await fetch("https://api.yourapps.cyou/meta/status");
            data = await response.json();
            console.log(data)
        }
        catch (e) {
            console.error(e)
            return;
        };
        let new_shards = []
        for(let shard_id of Object.keys(data.shards)) {
            console.log(shard_id)
            let shard_data = data.shards[shard_id]
            new_shards.push(
                <ShardStatus shard_id={shard_id} online={shard_data.online} latency={shard_data.latency}/>
            )
        }
        this.setState({shards: new_shards}, didSetState)
        console.log(new_shards)
    }

    componentWillUnmount() {
        if(this.interval) {
            clearInterval(this.interval);
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", (x) => {if(x.key==="d"){document.getElementById("debug").hidden=!document.getElementById("debug").hidden}})
        const _t = this;
        function callback(_this) {
            if(_this.lock===true) {
                return;
            };
            _this.lock = true;

            _this.fetchStatus()
            .then(
                () => {_this.lock = false}
            )
            .catch(
                () => {_this.lock = false}
            )
        }
        const x = () => this.interval = setInterval(callback, 1000, _t)
        this.getInitialShardCount().then(x)
    }

    // componentDidUpdate() {
    //     try {
    //         this.setState({call: this.state.call+1})
    //     }
    //     catch {}
    // }

    render() {
        if(!this.state) {
            return null;
        }
        return (
            <>
                <div id="debug" hidden>
                    <p>StatusPage State:</p>
                    <code><pre>{JSON.stringify(this.state, null, 2)}</pre></code>
                </div>
                <div style={{height: "50vh", textAlign: "center"}}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {statusBar(this.state.server_online, this.state.stats)}
                    </div>
                    <hr style={{width: "75%", textAlign: "center"}}/>
                    <h2>Individual shard statuses</h2>
                    <div style={{display: "flex", justifyContent: "center", backgroundColor: "rgba(5,5,5,0.5)"}}>
                        {console.log("Rendering...", this.state.shards)}
                        {this.state.shards.map((x, i) => {return x})}
                    </div>
                </div>
            </>
        )
    }
}

export default StatusPage