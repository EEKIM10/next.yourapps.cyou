import Image from "next/image";
import {Component} from "react";

const icons = {
    discord: "/icons/discord.svg",
    email: "/icons/email.svg"
}


class Icon extends Component {
    constructor(props) {
        super(props);
        if(icons[props.name]===undefined) {
            throw new TypeError(`${props.name} is not a valid icon. Valid icons are: ${Object.keys(icons).join(', ')}`);
        }
    }

    render() {
        return <Image src={icons[this.props.name]} width={this.props.width||"32px"} height={this.props.height||"32px"}
        alt={this.props.name}/>
    }

}

export default Icon;
