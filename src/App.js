import './App.css';
import {useState} from "react";

function App() {

    const [username, setUsername] = useState("");
    const [repos, setRepos] = useState([]);
    const [reposContent, setReposContent] = useState([]);
    const [fileContent, setFileContent] = useState(null);
    const [dirContent, setDirContent] = useState(null);
    const [videoContent, setVideoContent] = useState(null);

    function clear() {
        setFileContent(null);
        setDirContent(null);
        setVideoContent(null);
    }

    function sendRequest(url) {
        return fetch('https://localhost:7268/api/github', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                url: url,
                method: "GET",
                payload: ""
            })
        }).then(res => res.json())
    }

    function sendVideoRequest(url) {
        return fetch('https://localhost:7268/api/github', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                url: url,
                method: "GET",
                payload: ""
            })
        }).then(res => res.blob())
    }

    async function videoStream(url) {
        setVideoContent(URL.createObjectURL(await sendVideoRequest(url)));
    }

    function getRepos(e) {
        e.preventDefault()
        clear();
        sendRequest(`https://api.github.com/users/${username}/repos?type='all'`)
            .then(arr => setRepos(arr))
    }

    function getReposContent(url) {
        clear();
        sendRequest(`${url}/contents`)
            .then(rep => setReposContent(rep))
    }

    function getReview(r) {
        clear();
        if (r.type === 'file') {
            const arr = r.name.split('.');
            if (arr[arr.length - 1] === "mp4") {
                videoStream(r.download_url);
            } else {
                sendRequest(r.url)
                    .then(rep => setFileContent(atob(rep.content)))
            }
        }
        if (r.type === 'dir') {
            sendRequest(r.url)
                .then(dir => setDirContent(dir))
        }
    }

    return (
        <div className="app">
            <div className="repos" onSubmit={getRepos}>
                <form>
                    <label htmlFor="username">user name</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} id="username"/>
                    <button type={"submit"}>Get</button>
                </form>
            </div>
            <h3>Repositories</h3>
            <div>
                <ul>
                    {repos.map(r => <li key={r.id} className="rep"
                                        onClick={() => getReposContent(r.url)}>{r.name}</li>)}
                </ul>
            </div>

            <h3>Contents</h3>
            <div>
                <ul>
                    {reposContent.map(r => <li key={r.sha} className="rep" onClick={() => getReview(r)}>{r.name}</li>)}
                </ul>
            </div>
            <h3>View</h3>
            <div>
                {
                    fileContent !== null
                        ? (<div>{fileContent}</div>) : <></>
                }
                {
                    dirContent !== null
                        ? (<ul>
                            {dirContent.map(r => <li key={r.sha} className="rep"
                                                     onClick={() => getReview(r)}>{r.name}</li>)}
                        </ul>) : <></>
                }
                {
                    videoContent !== null
                        ? (<video controls width="500" height="500">
                                <source src={videoContent}/>
                            </video>)
                        : <></>
                }
            </div>

        </div>
    );
}

export default App;
