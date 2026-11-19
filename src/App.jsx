
import { useState } from "react";
import "./App.css";

function App() {

  // Step 1: Create states
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2: Create function to view GitHub profile
  const viewProfile = async () => {

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      setUser(null);
      return;
    }

    try {

      setLoading(true);
      setError("");
      setUser(null);

      // Step 3: Fetch data from GitHub API
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username.trim())}`,
        {
          headers: {
            Accept: "application/vnd.github+json"
          }
        }
      );

      console.log(response);

      // Step 4: Check API response
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "GitHub user not found."
            : `API Error: ${response.status}`
        );
      }

      // Step 5: Convert response into JSON
      const data = await response.json();

      console.log(data);

      // Step 6: Store data in state
      setUser(data);

    } catch (err) {

      setError(err.message || "Something went wrong.");

    } finally {

      setLoading(false);

    }
  };

  // Step 7: Display website
  return (
    <div className="app">

      <header className="header">
        <div className="github-mark">⌘</div>
        <span>GitHub Profile Viewer</span>
      </header>

      <main className="main">

        <p className="eyebrow">DEVELOPER LOOKUP</p>

        <h1>View GitHub Profiles</h1>

        <p className="subtitle">
          Enter a GitHub username and discover their public profile information.
        </p>

        <div className="search-box">

          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" && viewProfile()
            }
            placeholder="Enter GitHub username"
            aria-label="GitHub username"
          />

          <button onClick={viewProfile} disabled={loading}>
            {loading ? "Loading..." : "View Profile"}
          </button>

        </div>

        {error && <p className="error">{error}</p>}

        {loading && (
          <p className="loading">
            Fetching GitHub profile...
          </p>
        )}

        {user && (
          <section className="profile-card">

            <img
              className="avatar"
              src={user.avatar_url}
              alt={`${user.login} avatar`}
            />

            <h2>{user.name || user.login}</h2>

            <p className="username">
              @{user.login}
            </p>

            <p className="bio">
              {user.bio || "No bio available."}
            </p>

            <div className="stats">

              <div>
                <strong>{user.public_repos}</strong>
                <span>Repositories</span>
              </div>

              <div>
                <strong>{user.followers}</strong>
                <span>Followers</span>
              </div>

              <div>
                <strong>{user.following}</strong>
                <span>Following</span>
              </div>

            </div>

            {user.location && (
              <p className="detail">
                <b>Location:</b> {user.location}
              </p>
            )}

            {user.company && (
              <p className="detail">
                <b>Company:</b> {user.company}
              </p>
            )}

            <p className="detail">
              <b>GitHub account created:</b>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>

            <a
              className="profile-link"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub Profile ↗
            </a>

          </section>
        )}

      </main>

      <footer>
        Made with React · GitHub REST API
      </footer>

    </div>
  );
}

export default App;
