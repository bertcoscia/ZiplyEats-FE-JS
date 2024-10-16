import { useSelector } from "react-redux";
import RestaurantDashboardComponent from "./RestaurantDashboardComponent/RestaurantDashboardComponent";
import NavComponent from "../navbar/NavComponent";

const HomeComponent = () => {
  const profile = useSelector(state => state.profile.content);
  return (
    <>
      <NavComponent />
      {profile && profile.userRole.userRole == "RIDER" && <h1>Ciao rider {profile.name}</h1>}
      {profile && profile.userRole.userRole == "ADMIN" && <h1>Ciao admin {profile.name}</h1>}
      {profile && profile.userRole.userRole == "RESTAURANT" && <RestaurantDashboardComponent />}
      {profile && profile.userRole.userRole == "USER" && <h1>Ciao user {profile.name}</h1>}
    </>
  );
};

export default HomeComponent;
