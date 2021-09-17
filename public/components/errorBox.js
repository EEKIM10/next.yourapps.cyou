export default function errorBox(title, description, code) {
    let elements = [];
    if(title) {
        elements.push(<h1>{title}</h1>)
    }
    if(description) {
        elements.push(<p>{description}</p>)
    }
    if(code) {
        elements.push(
            <pre><code>{code}</code></pre>
        )
    }
    if(!elements.length) {
        return null;
    }
    return (
        <div style={{border: "1px solid #ba000d", backgroundColor: "#f44336", borderRadius: "12px", padding: "6px"}}>
            {elements.map((x, i) => {<div key={i}>{x}</div>})}
        </div>
    )
}