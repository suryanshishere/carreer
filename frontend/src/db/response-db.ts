interface IResponseDb {
  not_authenticated: string;
}

const RESPONSE_DB: IResponseDb = {
  not_authenticated: "Not authenticated, please login or signup to continue!",
};

export default RESPONSE_DB;
