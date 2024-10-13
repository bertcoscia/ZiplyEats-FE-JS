import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../redux/actions/index";
import RestaurantDashboardComponent from "./RestaurantDashboard/RestaurantDashboardComponent";

const HomeComponent = () => {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile.content);

  useEffect(() => {
    dispatch(getProfileAction());
  }, []);
  return (
    <>
      {profile && profile.userRole.userRole == "RIDER" && <h1>Ciao rider {profile.name}</h1>}
      {profile && profile.userRole.userRole == "ADMIN" && <h1>Ciao admin {profile.name}</h1>}
      {profile && profile.userRole.userRole == "RESTAURANT" && <RestaurantDashboardComponent />}
      {profile && profile.userRole.userRole == "USER" && <h1>Ciao user {profile.name}</h1>}
    </>
  );
};

export default HomeComponent;
