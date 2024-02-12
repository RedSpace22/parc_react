import React from "react";
import PropTypes from "prop-types";

const UserData = ({ userData, repos }) => {
  return (
    <div className="userDetails">
      <img src={userData.avatar_url} alt="User logo" />
      <h2>USER: {userData.name}</h2>
      <p>Location: {userData.location}</p>
      <p>BIO: {userData.bio}</p>
      <h3>REPOSITORIES:</h3>
      <table>
        <tbody>
          {repos.map((repo) => (
            <tr key={repo.id}>
              <td>{repo.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserData.propTypes = {
  userData: PropTypes.object.isRequired,
  repos: PropTypes.array.isRequired,
};

export default UserData;
