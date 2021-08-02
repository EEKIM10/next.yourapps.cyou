import {Component} from "react";
import Image from "next/image";
import styles from '../styles/Dashboard.module.css';


const placeholder = (
    "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" +
    "CDAAIMAAIMAAgwAAgwAAgwACAAAOAAAMAAgwAAgwACDAACDAAIMAAIMAAIMAAgAADgAADAAIMAAIMAAgwAAgwACDAACDAAIAAA4AAA4AAAwACDAA" +
    "CDAAIMAAIMAAgwAAgwACAAAOAAAOAAAMAAgwAAgwACDAACDAAIMAAIMAAgAADgAADgAADAAIMAAIMAAgwAAgwACDAACDAAIAAA4AAA4AAAwACDAA" +
    "CDAAIMAAIMAAgwAAgwACAAAOAAAOAAAMAAgwAAgwACDAACDAAIMAAIMAAgAADgAADgAADAAIMAAIMAAgwAAgwACDAACDAAIAAA4AAA4AAAwACDAA" +
    "CDAAIMAAIMAAgwAAgwACAAAOAAAOAAAMAAgwAAgwACDAACDAAIMAAIMAAgAADgAADgAADAAIMAAIMAAgwAAgwALBqKl8BACxgABBgAECAAUCAAQA" +
    "BBgABBgAEGAAEGAAE2CcAAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBg" +
    "AEGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBgA" +
    "EGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgABBgAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYAAQYABBgABBgA" +
    "EGAAEGAAQIABQIABAAEGAAEGAAEGAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgA" +
    "EGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgA" +
    "EGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAE" +
    "GAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAE" +
    "GAAEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAEG" +
    "AAEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgAEGAAEGA" +
    "AEGAAQIABQIABAAEGAAEGAAQYAAQYABBgABBgABBgAECAAUCAAQABBgABBgAEGAAEGAAQYAAQYAAQYJ8AAAQYAAQYABBgABBgAECAAUCAAQABBg" +
    "ABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQABB" +
    "gABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQAB" +
    "BgABBgAEGAAEGAAEGAAQYAAQYABAgAFAgAEAAQYAAQYABBgABBgABBgAEGAAEGAAQIABQIABAAEGAAEGAAQYAAQYAAQYABBgABBgAECAAUCAAQA" +
    "BBgABBgAEGAAEGAAQYADYYSpfAQAAgOv5BRoAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADG" +
    "AAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAADAA" +
    "AYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAw" +
    "gAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAA" +
    "DGAAAAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAAD" +
    "CAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAAAwgH0CAAAADGAAA" +
    "AAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgA" +
    "AAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAE" +
    "AAMAABgAAAAMYAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGA" +
    "AAAAxgAAAAMIABAADAAAYAAAADGAAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAAAxgAAAAMYAAAADCAA" +
    "QAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAMY" +
    "AAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQA" +
    "AwAAGAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAA" +
    "AMYAAAADGAAAAAwgAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAADAAAYAAAADGAAAAAx" +
    "gAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAAB" +
    "gAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAA" +
    "AAAxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAwAAGAAAAAxgAAAAMYAAAA" +
    "DCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAAAwgAEAAMA" +
    "ABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMY" +
    "AAAADCAAQAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAE" +
    "AAMAABgAAAAMYAAAADGAAAAAwgAEAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAMIABAADAAAYAA" +
    "AADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAAAxgAAAAMIABAAAwgAEAAMAABgAAAAMYAAAADGAAAAAwgAEAAMAABgAAAAMYAAAADGAAAAA" +
    "wgAEAADCAAQAAwAAGAAAAAxgAAAAMYAAAADCAAQAAwAAGAAAAAxgAAAAMYAAAAAxgnwAAAAADGAAAAAxgAAAAMIABAADAAAYAAAADGAAAA" +
    "AxgAAAAMIABAADAAAYAAMAABgAAAAMYAAAADGAAAAA4xAfbHRdn8eH6cwAAAABJRU5ErkJggg=="
)



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
        <a onClick={} title={props.guild.name}>
            <Image src={uri} alt={props.guild.name} width={"64px"} height={"64px"} placeholder={"blur"} blurDataURL={placeholder} style={{borderRadius: "50%"}}/>
        </a>
    )
}


class ServerSelection extends Component {
    constructor(props) {
        super(props);
        this.state = {guilds: []}
    }

    async componentDidMount() {
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
            <div id={"guilds"}>
                {legal.map((g)=>{return <Guild guild={g}/>})}
            </div>
        )
    }
}


export default class Dashboard extends Component {
    render() {
        return (
            <main>
                <Loader width={"64px"} height={"64px"}/>
                <div style={{display: "flex"}}>
                    <ServerSelection/>
                </div>
            </main>
        )
    }
}