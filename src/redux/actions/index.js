export const GET_PROFILE = "GET_PROFILE";
export const RESET_PROFILE = "RESET_PROFILE";
export const SET_ADDRESS = "SET_ADDRESS";

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
          return response.json();
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

export const resetProfileAction = () => ({
  type: "RESET_PROFILE"
});

export const setAddressAction = address => ({
  type: SET_ADDRESS,
  payload: address
});
