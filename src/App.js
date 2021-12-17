import logo from './logo.svg';
import './App.css';
import {useState} from "react";

// https://api.github.com/users/SlavkaOnline/repos
function App() {

    const [username, setUsername] = useState("");
    const [repos, setRepos] = useState([]);
    const [reposContent, setReposContent] = useState([]);
    const [fileContent, setFileContent] = useState(null);
    const [dirContent, setDirContent] = useState(null);


    function getRepos(e) {
        e.preventDefault()
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            .then(res => res.json())
            .then(arr => setRepos(arr))
    }

    function getReposContent(url) {
        setFileContent(null);
        setDirContent(null);
        fetch(`${url}/contents`)
            .then(res => res.json())
            .then(rep => setReposContent(rep))
    }

    function getReview(r) {
        setFileContent(null);
        setDirContent(null);
        if (r.type === 'file') {
            fetch(r.url)
                .then(res => res.json())
                .then(rep => setFileContent(atob(rep.content)))
        }
        if (r.type === 'dir') {
            fetch(r.url)
                .then(res => res.json())
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
                        {dirContent.map(r => <li key={r.sha} className="rep" onClick={() => getReview(r)}>{r.name}</li>)}
                    </ul>) : <></>
            }
            </div>

        </div>
    );
}

export default App;
