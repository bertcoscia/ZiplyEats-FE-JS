import { useSelector } from "react-redux";
import RestaurantDashboardComponent from "./RestaurantDashboardComponent/RestaurantDashboardComponent";
import NavComponent from "../navbar/NavComponent";
import RiderDashboardComponent from "./RiderDashboardComponent/RiderDashboardComponent";

const HomeComponent = () => {
  const profile = useSelector(state => state.profile.content);
  return (
    <>
      <NavComponent />
      {profile && (
        <>
          {profile.userRole.userRole === "RIDER" && <RiderDashboardComponent profile={profile} />}
          {profile.userRole.userRole === "ADMIN" && <h1>Ciao admin {profile.name}</h1>}
          {profile.userRole.userRole === "RESTAURANT" && <RestaurantDashboardComponent />}
          {profile.userRole.userRole === "USER" && <h1>Ciao user {profile.name}</h1>}
        </>
      )}
    </>
  );
};

export default HomeComponent;
