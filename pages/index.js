import Head from 'next/head';
import Image from "next/image";
import styles from '../styles/Home.module.css'
import {Component} from "react";

let statsData = {guilds: "loading", users: "loading", positions: "loading", commands: "loading", shards: "loading", ping: 1};

function convertCookies(cookie) {
  let output = {};
  cookie.split(/\s*;\s*/).forEach(function(pair) {
    pair = pair.split(/\s*=\s*/);
    output[pair[0]] = pair.splice(1).join('=');
  });
  return output
}


class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {render: false}
  }

  componentDidMount() {
    this.setState({render: true})
  }

  render() {
    if(this.state.render) {
      return (
          <video width={"60%"} height={"40%"} style={{"margin": "0", "padding": "0"}} loop autoPlay={true}>
            <source type={"video/webm"} src={"/examples/create-app.webm"}/>
          </video>
      );
    }
    return <Image src={'/placeholder.png'} width={"60%"} height={"40%"} alt={"loading video..."}/>
  }
}


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = statsData
  }

  async getServerSideProps(ctx) {
    return {
      cookies: convertCookies(ctx.req.cookies)
    }
  }

  componentDidMount() {
    fetch(document.location.origin + "/api/stats").then(
        r=>r.json().then(j=> {
          statsData = j;
          this.setState(statsData)
        })
    ).catch()
  }

  render() {
    return (
        <div>
          <Head>
            <title>YourApps</title>
            <meta charSet="utf-8"/>
            <meta property="og:title" content="YourApps - Home"/>
            <meta property="og:site_name" content="YourApps"/>
            <meta property="og:description"
                  content="YourApps is the newest, most reliable and feature-rich discord application bot to date. Improving on other applicaiton bots, YourApps perfectly balances reliability, with free content & features. Come check us out, make your life easier!"
            />
            <meta property="og:type" content="website"/>
            <meta name="theme-color" content="#7289DA"/>
            <meta name="description"
                  content="YourApps is the newest, most reliable and feature-rich discord application bot to date. Improving on other application bots, YourApps perfectly balances reliability, with free content & features. Come check us out, make your life easier! This large partner program allows larger servers to easily scale up their applications, making yourapps even faster and easier to use for larger, more active servers."
            />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta httpEquiv="Cache-Control" content="max-age=86400"/>
            <link rel="preconnect" href="https://api.yourapps.cyou"/>
          </Head>
          <main>
            <div style={{backgroundColor: "#ff5555", color: "#fff", margin: "0", padding: "8px", display: "inline-flex", justifyContent: "space-between", width: "100%"}}>
              <div><p>This is a beta design of the site, and is not completed.</p></div>
              <div>
                <span style={{cursor: "pointer"}} onClick={()=>{document.querySelector("main > div").remove()}}>
                  X
                </span>
              </div>
            </div>
            <div style={{textAlign: "center"}}>
              <h1 style={{textAlign: "center"}}>YourApps</h1>
              <Image src={'/avatar.png'} alt={""} width={"128px"} height={"128px"}/>
              <p><strong>{this.state.guilds.toLocaleString()}</strong> Servers!</p>
              <div style={{display: "flex",flexDirection:"row",justifyContent: "space-evenly",alignContent:"center",alignItems:"center"}}>
                <a href={"https://yourapps.cyou/invite?ref=index-top-new"}>
                  <button className={styles.btn}>Invite</button>
                </a>
                <a href={"/api/support"}>
                  <button className={styles.btn}>Support</button>
                </a>
                <a href={"https://top.gg/bot/619328560141697036/vote"} rel={"noreferrer"}>
                  <button className={styles.btn}>Vote</button>
                </a>
                <a href={"https://top.gg/bot/619328560141697036/"} rel={"noreferrer"}>
                  <button className={styles.btn}>DBL</button>
                </a>
                <a href={"/status"}>
                  <button className={styles.btn}>Status</button>
                </a>
              </div>
            </div>
            <div style={{marginLeft: "4%", width: "90%"}}>
              <br/>
              <hr/>
              <br/>
              <div>
                <h2>What is YourApps?</h2>
                <p>
                  YourApps is a discord bot designed with the sole purpose of making your life in data collection easier.

                  Perhaps you wanted to hire some new people into your staff team? Or maybe, you wanted to collect some
                  information on what people think about your server. Well, YourApps does just that!
                </p>
                <p>The easy setup means you can get your applications ready to go in a matter of minutes!</p>
                <div style={{textAlign: "center"}}>
                  <a href={"/examples/create-app.webm"}>
                    <VideoComponent/>
                  </a>
                  <p><i>Figure displaying the creation of an application</i></p>
                </div>
              </div>
              <div>
                <h2>Statistics:</h2>
                <p>We aren&apos;t just joking around here, we&apos;ve got some serious numbers to prove our worth!</p>
                <table style={{width: "65%", textAlign: "center", margin: "0 auto"}}>
                  <thead>
                  <tr className={styles.tableRow}>
                    <th>Servers</th>
                    <th>Users</th>
                    <th>Applications</th>
                    <th>Commands</th>
                    <th>Shards</th>
                    <th>Ping (ms)</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className={styles.tableRow}>
                    <td>{this.state.guilds.toLocaleString()}</td>
                    <td>{this.state.users.toLocaleString()}</td>
                    <td>{this.state.positions.toLocaleString()}</td>
                    <td>{this.state.commands.toLocaleString()}</td>
                    <td>{this.state.shards.toLocaleString()}</td>
                    <td>{(this.state.ping).toLocaleString()}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <h2>Just tell me the features already!</h2>
                <p>Well, here&apos;s just a few:</p>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", alignContent: "center"}}>
                  <div style={{display: "flex", flexDirection: "column", alignSelf: "center"}}>
                    <div className={styles.shadowBox}>
                      <h4>Simple, memorable commands</h4>
                      <p>The commands you use most are easy to remember, with short names & arguments.</p>
                    </div>
                    <div className={styles.shadowBox}>
                      <h4>Powerful flexibility</h4>
                      <p>YourApps has been pressured and tested in basically all environments known to man -
                        earth, space, moon, you name it!</p>
                      <p>Just pulling your leg! However, on a serious note, YourApps has over 1 thousand servers,
                        all with their own unique configurations and permissions. And YourApps works in all of them!</p>
                    </div>
                  </div>
                  <div className={styles.shadowBox}>
                    <h4>Reliable &amp; Fast</h4>
                    <p>YourApps is designed to have many redundancies, while still remaining fast.
                      YourApps is pretty much always ready when you are!</p>
                  </div>
                  <div className={styles.shadowBox}>
                    <h4>Foo bar</h4>
                    <p>If there&apos;s infinite multiverses, then there&apos;s a multiverse where the multiverse theory does not exist.</p>
                  </div>
                </div>
                </div>
              </div>
          </main>
        </div>
    );
  }
};

