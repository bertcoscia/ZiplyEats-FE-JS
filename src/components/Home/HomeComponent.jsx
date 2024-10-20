import { useSelector } from "react-redux";
import RestaurantDashboardComponent from "./RestaurantDashboardComponent/RestaurantDashboardComponent";
import NavComponent from "../NavComponent/NavComponent";
import RiderDashboardComponent from "./RiderDashboardComponent/RiderDashboardComponent";
import UserDashboardComponent from "./UserDashboardComponent/UserDashboardComponent";

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
          {profile.userRole.userRole === "USER" && <UserDashboardComponent />}
        </>
      )}
    </>
  );
};

export default HomeComponent;
