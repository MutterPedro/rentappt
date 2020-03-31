import { UserLogin } from "./actions";
import { IUser } from "../../types/user";
import { CustomAction } from "../../types/action";

interface State {
  loading: boolean;
  user: IUser | null;
  apartments: string[];
  errorMessage?: string;
}
const initialState: State = {
  user: null,
  apartments: [],
  loading: false
};

export default function userReducer(
  state: State = initialState,
  action: Partial<CustomAction<any>> = {}
): State {
  switch (action.type) {
    case UserLogin.Request:
      return { ...state, user: null, loading: true, errorMessage: "" };
    case UserLogin.Success:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        errorMessage: ""
      };
    case UserLogin.Fail:
      return {
        ...state,
        user: null,
        loading: false,
        errorMessage: action.payload.message
      };
    default:
      return state;
  }
}
