import { Login, Logout, ChangeProduct, ChangeTimeInterval, DisplayExchange} from '../constant/constant'

// 本處使用同步action
export const LoginAction = data => ({ type: Login, payload:data.api})// 等同return
export const LogoutAction = () => ({ type: Logout, payload: null })
export const ChangeProductAction = data => ({ type: ChangeProduct, payload: data })
export const ChangeTimeIntervalAction = data => ({ type: ChangeTimeInterval, payload: data })
export const DisplayExchangeAction = data => ({ type: DisplayExchange, payload: data })
