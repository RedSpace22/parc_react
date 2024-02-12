import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserData from "./UserData";

const SearchForm = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showInputForm, setShowInputForm] = useState(true);

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e, searchUsername) => {
    if (e) {
      e.preventDefault();
    }
    const searchName = searchUsername ? searchUsername : username;
    if (searchName === "") {
      alert("Please enter a correct username");
    } else {
      try {
        const userRes = await fetch(`https://api.github.com/users/${searchName}`);
        const userData = await userRes.json();
        setUserData(userData);

        const reposRes = await fetch(userData.repos_url);
        const reposData = await reposRes.json();
        setRepos(reposData);

        setShowInputForm(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setUsername("");
    }
  };

  const handleReset = () => {
    setUserData(null);
    setRepos([]);
    setUsername("");
    setShowInputForm(true);
  };

  const handleSuggestionClick = (username) => {
    handleSubmit(null, username);
    setSuggestions([]);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`https://api.github.com/search/users?q=${username}`);
        const data = await response.json();
        setSuggestions(data.items.filter(item => item.login && item.login.trim() !== ''));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    if (username) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [username]);

  return (
    <div className="userSearch">
      {!showInputForm && (
        <div className="resetButton">
          <button type="button" className="resetButton" onClick={handleReset}>
          New search
          </button>
        </div>
      )}
      {showInputForm && (
        <div className="inputForm">
          <form onSubmit={handleSubmit}>
            <input
              className="searchInput"
              id="username"
              type="text"
              placeholder="Enter a GitHub username..."
              autoComplete="username"
              onChange={handleChange}
              value={username}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      )}
      {userData && <UserData userData={userData} repos={repos} />}
      {suggestions.length > 0 && (
        <div className="suggestions">
          <h4>Suggestions:</h4>
          <ul>
            {suggestions.map((user) => (
              <li key={user.id} onClick={() => handleSuggestionClick(user.login)}>
                {user.login}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!showInputForm && (
        <div className="resetButton">
          <button type="button" onClick={handleReset} className="reset">
          New search
          </button>
        </div>
      )}
    </div>
  );
};

SearchForm.propTypes = {
  userData: PropTypes.object,
  repos: PropTypes.array,
};

export default SearchForm;
