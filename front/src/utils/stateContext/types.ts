export interface IState {
  loading: boolean;
  isLoggedIn: boolean;
  user: any;
}

export interface Action {
  type: string;
  payload: any;
}
