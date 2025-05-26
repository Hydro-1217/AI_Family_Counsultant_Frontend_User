import {Navigate} from 'react-router-dom';
import {FC_X_TOKEN} from "@/common/constants.js";

const withPrivateRoute = (Component) => {
  return (props) => {
    if (!localStorage.getItem(FC_X_TOKEN)) {
      return <Navigate to="/login"/>;
    }

    return <Component {...props} />;
  };
};

export default withPrivateRoute;