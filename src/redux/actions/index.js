export const GET_PROFILE = "GET_PROFILE";

const USERS_URL = import.meta.env.VITE_USERS_URL;

export const getProfileAction = () => {
  return dispatch => {
    fetch(`${USERS_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json;
        } else {
          throw new Error("There was an error while retrieving your profile - @getProfileAction");
        }
      })
      .then(profile => {
        dispatch({
          type: GET_PROFILE,
          payload: profile
        });
      })
      .catch(error => console.log(error));
  };
};
